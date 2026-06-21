-- ============================================================
-- AroundJos — Supabase Schema
-- Run via: supabase db push  OR  paste into Supabase SQL Editor
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy text search

-- ─── USERS ───────────────────────────────────────────────────────────────────

CREATE TABLE public.users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'User',
  photo_url    TEXT,
  role         TEXT NOT NULL DEFAULT 'visitor'
               CHECK (role IN ('visitor', 'business_owner', 'moderator', 'admin')),
  phone        TEXT,
  bio          TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create user row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, photo_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── CATEGORIES ──────────────────────────────────────────────────────────────

CREATE TABLE public.categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  color       TEXT DEFAULT '#FF7D0A',
  featured    BOOLEAN DEFAULT false,
  order_num   INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── LISTINGS ────────────────────────────────────────────────────────────────

CREATE TABLE public.listings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  business_name    TEXT NOT NULL,
  tagline          TEXT,
  description      TEXT NOT NULL,
  category_slug    TEXT REFERENCES public.categories(slug) ON DELETE SET NULL,
  subcategory_slug TEXT,
  address          TEXT NOT NULL,
  area             TEXT NOT NULL,
  lat              DECIMAL(10, 8),
  lng              DECIMAL(11, 8),
  phone            TEXT NOT NULL,
  whatsapp         TEXT,
  email            TEXT,
  website          TEXT,
  images           TEXT[]   DEFAULT '{}',
  cover_image      TEXT,
  opening_hours    JSONB,
  amenities        TEXT[]   DEFAULT '{}',
  services         TEXT[]   DEFAULT '{}',
  price_range      TEXT     CHECK (price_range IN ('budget', 'mid', 'premium', 'luxury')),
  -- Status flags
  status           TEXT     NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('draft', 'pending', 'active', 'rejected', 'suspended')),
  verified         BOOLEAN  DEFAULT false,
  claimed          BOOLEAN  DEFAULT false,
  featured         BOOLEAN  DEFAULT false,
  sponsored        BOOLEAN  DEFAULT false,
  -- Stats (denormalized for query speed)
  rating_average   DECIMAL(3, 1) DEFAULT 0,
  review_count     INTEGER  DEFAULT 0,
  view_count       INTEGER  DEFAULT 0,
  save_count       INTEGER  DEFAULT 0,
  -- Ownership
  created_by       UUID     REFERENCES public.users(id) ON DELETE SET NULL,
  owner_id         UUID     REFERENCES public.users(id) ON DELETE SET NULL,
  claimed_by       UUID     REFERENCES public.users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX listings_search_idx ON public.listings
  USING GIN (to_tsvector('english', business_name || ' ' || COALESCE(description, '') || ' ' || area));

-- Trigram index for partial-match search
CREATE INDEX listings_name_trgm_idx ON public.listings USING GIN (business_name gin_trgm_ops);

-- Composite indexes for common queries
CREATE INDEX listings_category_status_idx ON public.listings (category_slug, status);
CREATE INDEX listings_area_status_idx     ON public.listings (area, status);
CREATE INDEX listings_featured_idx        ON public.listings (featured, status, rating_average DESC);
CREATE INDEX listings_created_at_idx      ON public.listings (created_at DESC);
CREATE INDEX listings_view_count_idx      ON public.listings (view_count DESC);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────

CREATE TABLE public.reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id   UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  author_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  author_name  TEXT NOT NULL DEFAULT 'Anonymous Visitor',
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title        TEXT,
  body         TEXT NOT NULL,
  images       TEXT[] DEFAULT '{}',
  helpful      INTEGER DEFAULT 0,
  reported     BOOLEAN DEFAULT false,
  report_count INTEGER DEFAULT 0,
  status       TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
  owner_reply  JSONB,  -- { body: string, replied_at: string }
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX reviews_listing_id_idx ON public.reviews (listing_id, status, created_at DESC);

-- Auto-update listing rating when a review is inserted/updated/deleted
CREATE OR REPLACE FUNCTION public.update_listing_rating()
RETURNS TRIGGER AS $$
DECLARE
  new_avg   DECIMAL(3,1);
  new_count INTEGER;
  target_id UUID;
BEGIN
  target_id := COALESCE(NEW.listing_id, OLD.listing_id);

  SELECT
    ROUND(AVG(rating)::NUMERIC, 1),
    COUNT(*)
  INTO new_avg, new_count
  FROM public.reviews
  WHERE listing_id = target_id AND status = 'active';

  UPDATE public.listings
  SET
    rating_average = COALESCE(new_avg, 0),
    review_count   = COALESCE(new_count, 0),
    updated_at     = NOW()
  WHERE id = target_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_listing_rating();

-- ─── FAVORITES ───────────────────────────────────────────────────────────────

CREATE TABLE public.favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id)    ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, listing_id)
);

-- Auto-update save_count on listings
CREATE OR REPLACE FUNCTION public.update_save_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.listings SET save_count = save_count + 1 WHERE id = NEW.listing_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.listings SET save_count = GREATEST(save_count - 1, 0) WHERE id = OLD.listing_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_favorite_change
  AFTER INSERT OR DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_save_count();

-- ─── BUSINESS CLAIMS ─────────────────────────────────────────────────────────

CREATE TABLE public.business_claims (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id       UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  listing_name     TEXT NOT NULL,
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_email       TEXT NOT NULL,
  user_name        TEXT NOT NULL,
  phone            TEXT NOT NULL,
  position         TEXT NOT NULL,
  message          TEXT NOT NULL,
  proof_documents  TEXT[] DEFAULT '{}',
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by      UUID REFERENCES public.users(id),
  reviewed_at      TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ADS ─────────────────────────────────────────────────────────────────────

CREATE TABLE public.ads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  image_url   TEXT NOT NULL,
  link_url    TEXT NOT NULL,
  listing_id  UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  placement   TEXT[] DEFAULT '{}',
  status      TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'expired')),
  budget      DECIMAL(10, 2),
  impressions INTEGER DEFAULT 0,
  clicks      INTEGER DEFAULT 0,
  start_date  TIMESTAMPTZ,
  end_date    TIMESTAMPTZ,
  created_by  UUID REFERENCES public.users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REPORTS ─────────────────────────────────────────────────────────────────

CREATE TABLE public.reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'review')),
  target_id   UUID NOT NULL,
  reported_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reason      TEXT NOT NULL,
  details     TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

CREATE TABLE public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  read       BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── updated_at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

ALTER TABLE public.users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_claims  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories       ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin or moderator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_listing_owner(listing_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.listings
    WHERE id = listing_id AND (created_by = auth.uid() OR owner_id = auth.uid())
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- USERS policies
CREATE POLICY "Users can view all profiles"       ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"      ON public.users FOR UPDATE USING (auth.uid() = id);

-- CATEGORIES policies
CREATE POLICY "Anyone can read categories"        ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL   USING (public.is_admin());

-- LISTINGS policies
CREATE POLICY "Anyone can read active listings"
  ON public.listings FOR SELECT
  USING (status = 'active' OR auth.uid() = created_by OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Authenticated users can create listings"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners and admins can update listings"
  ON public.listings FOR UPDATE
  USING (auth.uid() = created_by OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and admins can delete listings"
  ON public.listings FOR DELETE
  USING (auth.uid() = created_by OR public.is_admin());

-- REVIEWS policies
CREATE POLICY "Anyone can read active reviews"
  ON public.reviews FOR SELECT USING (status = 'active' OR public.is_admin());

CREATE POLICY "Authenticated users can write reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors and admins can update reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE
  USING (public.is_admin());

-- FAVORITES policies
CREATE POLICY "Users can view own favorites"     ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites"          ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own favorites"   ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- BUSINESS CLAIMS policies
CREATE POLICY "Users can view own claims"        ON public.business_claims FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Authenticated users can claim"    ON public.business_claims FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update claims"         ON public.business_claims FOR UPDATE USING (public.is_admin());

-- NOTIFICATIONS policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifs"      ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- REPORTS policies
CREATE POLICY "Authenticated users can report"   ON public.reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can view all reports"      ON public.reports FOR SELECT USING (public.is_admin());

-- ADS policies
CREATE POLICY "Anyone can view active ads"       ON public.ads FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Only admins can manage ads"       ON public.ads FOR ALL USING (public.is_admin());
