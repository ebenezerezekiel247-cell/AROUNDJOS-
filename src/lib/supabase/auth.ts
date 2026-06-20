import { getSupabaseClient } from './client';
import type { Provider } from '@supabase/supabase-js';

const supabase = () => getSupabaseClient();

// ─── Email Auth ───────────────────────────────────────────────────────────────

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const { data, error } = await supabase().auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, full_name: displayName },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// ─── OAuth (Google) ───────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const { data, error } = await supabase().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  });
  if (error) throw error;
  return data;
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut() {
  const { error } = await supabase().auth.signOut();
  if (error) throw error;
}

// ─── Password Reset ───────────────────────────────────────────────────────────

export async function resetPassword(email: string) {
  const { error } = await supabase().auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset`,
  });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase().auth.updateUser({ password: newPassword });
  if (error) throw error;
}

// ─── Session Helpers ──────────────────────────────────────────────────────────

export async function getSession() {
  const { data, error } = await supabase().auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await supabase().auth.getUser();
  if (error) return null;
  return data.user;
}

export function onAuthStateChange(callback: (user: any) => void) {
  const { data: { subscription } } = supabase().auth.onAuthStateChange(
    (_event, session) => callback(session?.user ?? null)
  );
  return subscription;
}
