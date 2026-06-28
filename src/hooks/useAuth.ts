'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';

export interface Profile {
  id:           string;
  email:        string;
  display_name: string;
  photo_url:    string | null;
  role:         UserRole;
  phone:        string | null;
  bio:          string | null;
  created_at:   string;
  updated_at:   string;
}

interface AuthState {
  user:        User | null;
  profile:     Profile | null;
  role:        UserRole;
  loading:     boolean;
  isAdmin:     boolean;
  isModerator: boolean;
  isOwner:     boolean;
  isLoggedIn:  boolean;
  refresh:     () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (currentUser: User | null) => {
    setUser(currentUser);
    if (currentUser) {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      setProfile(data as Profile | null);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    await loadProfile(session?.user ?? null);
  }, [loadProfile]);

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session?.user ?? null);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Small delay on sign-in to let the DB trigger create the user row
        if (event === 'SIGNED_IN') {
          await new Promise(r => setTimeout(r, 500));
        }
        await loadProfile(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const role: UserRole = profile?.role || 'visitor';

  return {
    user,
    profile,
    role,
    loading,
    isAdmin:     role === 'admin',
    isModerator: role === 'admin' || role === 'moderator',
    isOwner:     role === 'admin' || role === 'business_owner',
    isLoggedIn:  !!user,
    refresh,
  };
}

export function useRequireAdmin()  { const a = useAuth(); return { ...a, allowed: a.isAdmin }; }
export function useRequireOwner()  { const a = useAuth(); return { ...a, allowed: a.isOwner }; }
