import { getSupabaseClient } from '@/lib/supabase/client';
import type { DbReview } from '@/types/database';

const db = () => getSupabaseClient();
export type Review = DbReview;

export async function createReview(
  listingId: string,
  authorId:  string,
  rating:    number,
  body:      string,
  title?:    string,
  images:    string[] = []
): Promise<string> {
  const { data, error } = await db()
    .from('reviews')
    .insert({ listing_id: listingId, author_id: authorId, author_name: 'Anonymous Visitor', rating, body, title: title || null, images, status: 'active' })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function getReviewsByListing(listingId: string, limit = 20): Promise<Review[]> {
  const { data, error } = await db()
    .from('reviews')
    .select('*')
    .eq('listing_id', listingId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function markReviewHelpful(reviewId: string): Promise<void> {
  const { data: r } = await db().from('reviews').select('helpful').eq('id', reviewId).single();
  if (!r) return;
  await db().from('reviews').update({ helpful: (r.helpful || 0) + 1 }).eq('id', reviewId);
}

export async function reportReview(reviewId: string, userId: string): Promise<void> {
  await db().from('reports').insert({ target_type: 'review', target_id: reviewId, reported_by: userId, reason: 'inappropriate' });
  const { data: r } = await db().from('reviews').select('report_count').eq('id', reviewId).single();
  if (r) await db().from('reviews').update({ report_count: (r.report_count || 0) + 1, reported: true }).eq('id', reviewId);
}

export async function addOwnerReply(reviewId: string, body: string): Promise<void> {
  const { error } = await db().from('reviews')
    .update({ owner_reply: { body, replied_at: new Date().toISOString() }, updated_at: new Date().toISOString() })
    .eq('id', reviewId);
  if (error) throw error;
}

export async function getAdminReviews(status?: string): Promise<Review[]> {
  let query = db().from('reviews').select('*').order('created_at', { ascending: false }).limit(100);
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function setReviewStatus(id: string, status: 'active' | 'hidden' | 'deleted'): Promise<void> {
  const { error } = await db().from('reviews').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}
