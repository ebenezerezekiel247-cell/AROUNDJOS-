import { getSupabaseClient } from '@/lib/supabase/client';
import type { DbClaim } from '@/types/database';

const db = () => getSupabaseClient() as any;

export interface BusinessClaim {
  id: string;
  listingId: string;
  listingName: string;
  userId: string;
  userEmail: string;
  userName: string;
  phone: string;
  position: string;
  message: string;
  proofDocuments: string[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

function toClaim(row: DbClaim): BusinessClaim {
  return {
    id:              row.id,
    listingId:       row.listing_id,
    listingName:     row.listing_name,
    userId:          row.user_id,
    userEmail:       row.user_email,
    userName:        row.user_name,
    phone:           row.phone,
    position:        row.position,
    message:         row.message,
    proofDocuments:  row.proof_documents || [],
    status:          row.status,
    reviewedBy:      row.reviewed_by,
    reviewedAt:      row.reviewed_at,
    rejectionReason: row.rejection_reason,
    createdAt:       row.created_at,
  };
}

export async function submitClaim(
  listingId: string, listingName: string, userId: string,
  userEmail: string, userName: string,
  phone: string, position: string, message: string,
  proofDocuments: string[] = []
): Promise<string> {
  const { data, error } = await db()
    .from('business_claims')
    .insert({
      listing_id:      listingId,
      listing_name:    listingName,
      user_id:         userId,
      user_email:      userEmail,
      user_name:       userName,
      phone,
      position,
      message,
      proof_documents: proofDocuments,
      status:          'pending',
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function getPendingClaims(): Promise<BusinessClaim[]> {
  const { data, error } = await db()
    .from('business_claims').select('*').eq('status', 'pending')
    .order('created_at', { ascending: false }).limit(50);
  if (error) throw error;
  return (data || []).map(toClaim);
}

export async function getAllClaims(): Promise<BusinessClaim[]> {
  const { data, error } = await db()
    .from('business_claims').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return (data || []).map(toClaim);
}

export async function approveClaim(
  claimId: string, listingId: string, userId: string, adminId: string
): Promise<void> {
  await db().from('business_claims')
    .update({ status: 'approved', reviewed_by: adminId, reviewed_at: new Date().toISOString() })
    .eq('id', claimId);
  await db().from('listings')
    .update({ claimed: true, owner_id: userId, claimed_by: userId, updated_at: new Date().toISOString() })
    .eq('id', listingId);
  await db().from('users').update({ role: 'business_owner' }).eq('id', userId);
}

export async function rejectClaim(claimId: string, adminId: string, reason: string): Promise<void> {
  const { error } = await db()
    .from('business_claims')
    .update({ status: 'rejected', reviewed_by: adminId, reviewed_at: new Date().toISOString(), rejection_reason: reason })
    .eq('id', claimId);
  if (error) throw error;
}

export async function getUserClaims(userId: string): Promise<BusinessClaim[]> {
  const { data, error } = await db()
    .from('business_claims').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toClaim);
}
