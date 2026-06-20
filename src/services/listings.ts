import { getSupabaseClient } from '@/lib/supabase/client';
import type { DbListing } from '@/types/database';
import type { SearchFilters } from '@/types';
import slugify from 'slugify';

const db = () => getSupabaseClient();

// ─── Types ────────────────────────────────────────────────────────────────────
export type Listing = DbListing;

// ─── Create Listing ───────────────────────────────────────────────────────────
export async function createListing(
  data: Omit<Listing, 'id' | 'slug' | 'created_at' | 'updated_at' | 'rating_average' | 'review_count' | 'view_count' | 'save_count'>,
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
  return data;
}

// ─── Get by ID ────────────────────────────────────────────────────────────────
export async function getListingById(id: string): Promise<Listing | null> {
  const { data, error } = await db()
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

// ─── Update Listing ───────────────────────────────────────────────────────────
export async function updateListing(id: string, data: Partial<Listing>): Promise<void> {
  const { error } = await db()
    .from('listings')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

// ─── Delete Listing ───────────────────────────────────────────────────────────
export async function deleteListing(id: string): Promise<void> {
  const { error } = await db().from('listings').delete().eq('id', id);
  if (error) throw error;
}

// ─── Featured ─────────────────────────────────────────────────────────────────
export async function getFeaturedListings(count = 8): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .eq('featured', true)
    .order('rating_average', { ascending: false })
    .limit(count);

  if (error) throw error;
  return data || [];
}

// ─── Trending (most viewed) ───────────────────────────────────────────────────
export async function getTrendingListings(count = 8): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('view_count', { ascending: false })
    .limit(count);

  if (error) throw error;
  return data || [];
}

// ─── Recent ───────────────────────────────────────────────────────────────────
export async function getRecentListings(count = 8): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(count);

  if (error) throw error;
  return data || [];
}

// ─── By Category ─────────────────────────────────────────────────────────────
export async function getListingsByCategory(categorySlug: string, count = 24): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .eq('category_slug', categorySlug)
    .order('rating_average', { ascending: false })
    .limit(count);

  if (error) throw error;
  return data || [];
}

// ─── By Area ──────────────────────────────────────────────────────────────────
export async function getListingsByArea(area: string, count = 24): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .eq('area', area)
    .order('rating_average', { ascending: false })
    .limit(count);

  if (error) throw error;
  return data || [];
}

// ─── Search ───────────────────────────────────────────────────────────────────
export async function searchListings(filters: SearchFilters): Promise<Listing[]> {
  let query = db()
    .from('listings')
    .select('*')
    .eq('status', 'active');

  if (filters.category) query = query.eq('category_slug', filters.category);
  if (filters.area)     query = query.eq('area', filters.area);
  if (filters.rating)   query = query.gte('rating_average', filters.rating);
  if (filters.verified) query = query.eq('verified', true);
  if (filters.featured) query = query.eq('featured', true);

  if (filters.query) {
    // Supabase full-text search
    query = query.textSearch('business_name', filters.query, { type: 'websearch' });
  }

  query = query.order('rating_average', { ascending: false }).limit(50);

  const { data, error } = await query;
  if (error) {
    // Fallback: ilike search if full-text fails
    const { data: fallback } = await db()
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .ilike('business_name', `%${filters.query || ''}%`)
      .limit(50);
    return fallback || [];
  }
  return data || [];
}

// ─── Increment view count ─────────────────────────────────────────────────────
export async function incrementViewCount(id: string): Promise<void> {
  await db().rpc('increment_view_count' as never, { listing_id: id } as never).catch(() => {
    // Fallback if RPC not available
    db().from('listings').update({ view_count: db().from('listings').select('view_count') as never }).eq('id', id);
  });
}

// ─── Toggle favorite ──────────────────────────────────────────────────────────
export async function addFavorite(userId: string, listingId: string): Promise<void> {
  const { error } = await db().from('favorites').insert({ user_id: userId, listing_id: listingId });
  if (error && error.code !== '23505') throw error; // ignore duplicate
}

export async function removeFavorite(userId: string, listingId: string): Promise<void> {
  const { error } = await db().from('favorites').delete().eq('user_id', userId).eq('listing_id', listingId);
  if (error) throw error;
}

export async function getUserFavorites(userId: string): Promise<Listing[]> {
  const { data, error } = await db()
    .from('favorites')
    .select('listing_id, listings(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data?.map((f: any) => f.listings).filter(Boolean) || []) as Listing[];
}

// ─── Owner listings ───────────────────────────────────────────────────────────
export async function getOwnerListings(ownerId: string): Promise<Listing[]> {
  const { data, error } = await db()
    .from('listings')
    .select('*')
    .or(`created_by.eq.${ownerId},owner_id.eq.${ownerId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ─── Admin: all listings ──────────────────────────────────────────────────────
export async function getAdminListings(status?: string): Promise<Listing[]> {
  let query = db().from('listings').select('*').order('created_at', { ascending: false }).limit(100);
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ─── Admin: set status ────────────────────────────────────────────────────────
export async function setListingStatus(
  id: string,
  status: 'active' | 'rejected' | 'pending' | 'suspended'
): Promise<void> {
  const { error } = await db()
    .from('listings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

// ─── Slug helper ──────────────────────────────────────────────────────────────
async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name, { lower: true, strict: true });

  const { data } = await db()
    .from('listings')
    .select('slug')
    .like('slug', `${base}%`)
    .limit(20);

  if (!data?.length) return base;

  const existing = data.map((r) => r.slug);
  let counter = 1;
  let candidate = `${base}-${counter}`;
  while (existing.includes(candidate)) {
    counter++;
    candidate = `${base}-${counter}`;
  }
  return candidate;
}
