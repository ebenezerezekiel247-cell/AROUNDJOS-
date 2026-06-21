import { getSupabaseClient } from '@/lib/supabase/client';
import type { DbListing } from '@/types/database';
import type { SearchFilters } from '@/types';
import slugify from 'slugify';

const db = () => getSupabaseClient();

// ─── Public Type (camelCase — matches what UI components expect) ─────────────
export interface Listing {
  id: string;
  slug: string;
  businessName: string;
  tagline: string | null;
  description: string;
  categorySlug: string | null;
  subcategorySlug: string | null;
  address: string;
  area: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  images: string[];
  coverImage: string | null;
  openingHours: any;
  amenities: string[];
  services: string[];
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury' | null;
  status: 'draft' | 'pending' | 'active' | 'rejected' | 'suspended';
  verified: boolean;
  claimed: boolean;
  featured: boolean;
  sponsored: boolean;
  ratingAverage: number;
  reviewCount: number;
  viewCount: number;
  saveCount: number;
  createdBy: string | null;
  ownerId: string | null;
  claimedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Transformer: DB row (snake_case) → UI shape (camelCase) ──────────────────
function toListing(row: DbListing): Listing {
  return {
    id: row.id,
    slug: row.slug,
    businessName: row.business_name,
    tagline: row.tagline,
    description: row.description,
    categorySlug: row.category_slug,
    subcategorySlug: row.subcategory_slug,
    address: row.address,
    area: row.area,
    lat: row.lat,
    lng: row.lng,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    website: row.website,
    images: row.images || [],
    coverImage: row.cover_image,
    openingHours: row.opening_hours,
    amenities: row.amenities || [],
    services: row.services || [],
    priceRange: row.price_range,
    status: row.status,
    verified: row.verified,
    claimed: row.claimed,
    featured: row.featured,
    sponsored: row.sponsored,
    ratingAverage: row.rating_average,
    reviewCount: row.review_count,
    viewCount: row.view_count,
    saveCount: row.save_count,
    createdBy: row.created_by,
    ownerId: row.owner_id,
    claimedBy: row.claimed_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Create Listing ───────────────────────────────────────────────────────────
// Accepts snake_case insert payload (matches DB columns directly — used by add-listing form)
export async function createListing(
  data: Record<string, any>,
  userId: string
): Promise<string> {
  const slug = await generateUniqueSlug(data.business_name);

  const { data: listing, error } = await db()
    .from('listings')
    .insert({ ...data, slug, created_by: userId, status: 'pending' })
    .select('id')
    .single();

  if (error) throw error;
  return listing.id;
}

// ─── Get by slug ──────────────────────────────────────────────────────────────
export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const { data, error } = await db()
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !data) return null;
  return toListing(data);
}

// ─── Get by ID ────────────────────────────────────────────────────────────────
export async function getListingById(id: string): Promise<Listing | null> {
  const { data, error } = await db().from('listings').select('*').eq('id', id).single();
  if (error || !data) return null;
  return toListing(data);
}

// ─── Update / Delete ───────────────────────────────────────────────────────────
export async function updateListing(id: string, data: Record<string, any>): Promise<void> {
  const { error } = await db().from('listings').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function deleteListing(id: string): Promise<void> {
  const { error } = await db().from('listings').delete().eq('id', id);
  if (error) throw error;
}

// ─── Featured / Trending / Recent ──────────────────────────────────────────────
export async function getFeaturedListings(count = 8): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings').select('*').eq('status', 'active').eq('featured', true)
    .order('rating_average', { ascending: false }).limit(count);
  if (error) throw error;
  return (data || []).map(toListing);
}

export async function getTrendingListings(count = 8): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings').select('*').eq('status', 'active')
    .order('view_count', { ascending: false }).limit(count);
  if (error) throw error;
  return (data || []).map(toListing);
}

export async function getRecentListings(count = 8): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings').select('*').eq('status', 'active')
    .order('created_at', { ascending: false }).limit(count);
  if (error) throw error;
  return (data || []).map(toListing);
}

// ─── By Category / Area ────────────────────────────────────────────────────────
export async function getListingsByCategory(categorySlug: string, count = 24): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings').select('*').eq('status', 'active').eq('category_slug', categorySlug)
    .order('rating_average', { ascending: false }).limit(count);
  if (error) throw error;
  return (data || []).map(toListing);
}

export async function getListingsByArea(area: string, count = 24): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings').select('*').eq('status', 'active').eq('area', area)
    .order('rating_average', { ascending: false }).limit(count);
  if (error) throw error;
  return (data || []).map(toListing);
}

// ─── Generic listings fetch (used by map page) ─────────────────────────────────
export async function getListings(options: {
  status?: string;
  limit?: number;
} = {}): Promise<{ listings: Listing[] }> {
  const { data, error } = await db()
    .from('listings')
    .select('*')
    .eq('status', options.status || 'active')
    .order('created_at', { ascending: false })
    .limit(options.limit || 100);
  if (error) throw error;
  return { listings: (data || []).map(toListing) };
}

// ─── Search ───────────────────────────────────────────────────────────────────
export async function searchListings(filters: SearchFilters): Promise<Listing[]> {
  let query = db().from('listings').select('*').eq('status', 'active');

  if (filters.category) query = query.eq('category_slug', filters.category);
  if (filters.area)     query = query.eq('area', filters.area);
  if (filters.rating)   query = query.gte('rating_average', filters.rating);
  if (filters.verified) query = query.eq('verified', true);
  if (filters.featured) query = query.eq('featured', true);

  query = query.order('rating_average', { ascending: false }).limit(50);

  const { data, error } = await query;
  if (error || !data) {
    const { data: fallback } = await db()
      .from('listings').select('*').eq('status', 'active')
      .ilike('business_name', `%${filters.query || ''}%`).limit(50);
    return (fallback || []).map(toListing);
  }

  let results = data.map(toListing);
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (l) =>
        l.businessName.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.area.toLowerCase().includes(q)
    );
  }
  return results;
}

// ─── View count ───────────────────────────────────────────────────────────────
export async function incrementViewCount(id: string): Promise<void> {
  const { data } = await db().from('listings').select('view_count').eq('id', id).single();
  if (!data) return;
  await db().from('listings').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id);
}

// ─── Favorites ────────────────────────────────────────────────────────────────
export async function addFavorite(userId: string, listingId: string): Promise<void> {
  const { error } = await db().from('favorites').insert({ user_id: userId, listing_id: listingId });
  if (error && error.code !== '23505') throw error;
}

export async function removeFavorite(userId: string, listingId: string): Promise<void> {
  const { error } = await db().from('favorites').delete().eq('user_id', userId).eq('listing_id', listingId);
  if (error) throw error;
}

export async function getUserFavorites(userId: string): Promise<Listing[]> {
  const { data, error } = await db()
    .from('favorites').select('listing_id, listings(*)').eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data?.map((f: any) => f.listings).filter(Boolean) || []).map(toListing);
}

// ─── Owner / Admin ──────────────────────────────────────────────────────────────
export async function getOwnerListings(ownerId: string): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings').select('*')
    .or(`created_by.eq.${ownerId},owner_id.eq.${ownerId}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toListing);
}

export async function getAdminListings(status?: string): Promise<Listing[]> {
  let query = db().from('listings').select('*').order('created_at', { ascending: false }).limit(100);
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(toListing);
}

export async function setListingStatus(
  id: string,
  status: 'active' | 'rejected' | 'pending' | 'suspended'
): Promise<void> {
  const { error } = await db().from('listings').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

// ─── Slug helper ──────────────────────────────────────────────────────────────
async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name, { lower: true, strict: true });
  const { data } = await db().from('listings').select('slug').like('slug', `${base}%`).limit(20);
  if (!data?.length) return base;
  const existing = data.map((r) => r.slug);
  let counter = 1;
  let candidate = `${base}-${counter}`;
  while (existing.includes(candidate)) { counter++; candidate = `${base}-${counter}`; }
  return candidate;
}
