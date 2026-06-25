import { getSupabaseClient } from '@/lib/supabase/client';
import type { DbReview } from '@/types/database';

const db = () => getSupabaseClient() as any;

export interface Review {
  id: string;
  listingId: string;
  authorId: string | null;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  images: string[];
  helpful: number;
  reported: boolean;
  reportCount: number;
  status: 'active' | 'hidden' | 'deleted';
  ownerReply: { body: string; repliedAt: string } | null;
  createdAt: string;
  updatedAt: string;
}

function toReview(row: DbReview): Review {
  const reply = row.owner_reply as any;
  return {
    id: row.id,
    listingId: row.listing_id,
    authorId: row.author_id,
    authorName: row.author_name,
    rating: row.rating,
    title: row.title,
    body: row.body,
    images: row.images || [],
    helpful: row.helpful,
    reported: row.reported,
    reportCount: row.report_count,
    status: row.status,
    ownerReply: reply ? { body: reply.body, repliedAt: reply.replied_at } : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createReview(
  listingId: string,
  authorId: string,
  data: { rating: number; title?: string; body: string },
  images: string[] = []
): Promise<string> {
  const { data: review, error } = await db()
    .from('reviews')
    .insert({
      listing_id:  listingId,
      author_id:   authorId,
      author_name: 'Anonymous Visitor',
      rating:      data.rating,
      body:        data.body,
      title:       data.title || null,
      images,
      status:      'active',
    })
    .select('id')
    .single();
  if (error) throw error;
  return review.id;
}

export async function getReviewsByListing(listingId: string, limit = 20): Promise<Review[]> {
  const { data, error } = await db()
    .from('reviews').select('*').eq('listing_id', listingId).eq('status', 'active')
    .order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return (data || []).map(toReview);
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
  const { error } = await db()
    .from('reviews')
    .update({ owner_reply: { body, replied_at: new Date().toISOString() }, updated_at: new Date().toISOString() })
    .eq('id', reviewId);
  if (error) throw error;
}

export async function getAdminReviews(status?: string): Promise<Review[]> {
  let query = db().from('reviews').select('*').order('created_at', { ascending: false }).limit(100);
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(toReview);
}

export async function setReviewStatus(id: string, status: 'active' | 'hidden' | 'deleted'): Promise<void> {
  const { error } = await db().from('reviews').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}
