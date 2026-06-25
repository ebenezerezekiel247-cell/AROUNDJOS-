'use client';

import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';

interface Profile {
  id: string;
  email: string;
  display_name: string;
  photo_url: string | null;
  role: UserRole;
  phone: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
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
}

export function useAuth(): AuthState {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    const loadProfile = async (currentUser: User | null) => {
      setUser(currentUser);
      if (currentUser) {
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
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
  };
}

// ─── Guards ───────────────────────────────────────────────────────────────────

export function useRequireAdmin() {
  const auth = useAuth();
  return { ...auth, allowed: auth.isAdmin };
}

export function useRequireOwner() {
  const authState = useAuth();
  return { ...authState, allowed: authState.isOwner };
}
