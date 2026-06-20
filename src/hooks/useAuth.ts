'use client';

import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';
import { onAuthStateChange } from '@/lib/supabase/auth';
import type { DbUser } from '@/types/database';

type UserRole = 'visitor' | 'business_owner' | 'moderator' | 'admin';

interface AuthState {
  user:        User | null;
  profile:     DbUser | null;
  role:        UserRole;
  loading:     boolean;
  isAdmin:     boolean;
  isModerator: boolean;
  isOwner:     boolean;
  isLoggedIn:  boolean;
}

export function useAuth(): AuthState {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) fetchProfile(data.user.id);
      else setLoading(false);
    });

    // Listen for changes
    const sub = onAuthStateChange(async (u) => {
      setUser(u);
      if (u) await fetchProfile(u.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => sub.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await getSupabaseClient()
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data ?? null);
    setLoading(false);
  };

  const role: UserRole = (profile?.role as UserRole) || 'visitor';

  return {
    user, profile, role, loading,
    isAdmin:     role === 'admin',
    isModerator: role === 'admin' || role === 'moderator',
    isOwner:     role === 'admin' || role === 'business_owner',
    isLoggedIn:  !!user,
  };
}

export function useRequireAdmin() {
  const auth = useAuth();
  return { ...auth, allowed: auth.isAdmin };
}

export function useRequireOwner() {
  const auth = useAuth();
  return { ...auth, allowed: auth.isOwner };
}
