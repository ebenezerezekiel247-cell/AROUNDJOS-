'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, Settings, LogOut, MapPin, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/supabase/auth';
import { getUserFavorites } from '@/services/listings';
import type { Listing } from '@/services/listings';
import { Spinner, EmptyState, Button, Avatar } from '@/components/ui';
import { cn } from '@/utils';
import toast from 'react-hot-toast';

type Tab = 'saved' | 'reviews';

export default function ProfilePage() {
  const { user, profile, isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [tab,       setTab]       = useState<Tab>('saved');
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [fetching,  setFetching]  = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) router.replace('/auth?from=/profile');
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    if (user?.id) {
      setFetching(true);
      getUserFavorites(user.id).then(setFavorites).catch(() => {}).finally(() => setFetching(false));
    }
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (!isLoggedIn) return null;

  return (
    <div className="page-top min-h-screen bg-surface-50 dark:bg-dark-bg">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Profile header */}
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-surface-100 dark:border-dark-border p-6 mb-6">
          <div className="flex items-center gap-4">
            <Avatar src={profile?.photo_url || undefined} name={profile?.display_name || 'User'} size="lg" />
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-black text-xl text-surface-900 dark:text-white truncate">
                {profile?.display_name || 'Anonymous User'}
              </h1>
              <p className="text-sm text-surface-500 truncate">{user?.email}</p>
              <span className="inline-flex items-center mt-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                {profile?.role || 'visitor'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-surface-100 dark:border-dark-border">
            <Link href="/dashboard">
              <Button variant="secondary" fullWidth>
                <Settings className="w-4 h-4" /> Dashboard
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleSignOut} fullWidth>
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-dark-card p-1 rounded-2xl border border-surface-100 dark:border-dark-border mb-5">
          {([
            { id: 'saved'   as Tab, label: `❤️ Saved (${favorites.length})` },
            { id: 'reviews' as Tab, label: '⭐ Reviews' },
          ]).map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)} className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              tab === id ? 'bg-brand-500 text-white' : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
            )}>
              {label}
            </button>
          ))}
        </div>

        {/* Saved */}
        {tab === 'saved' && (
          fetching ? (
            <div className="text-center py-12"><Spinner /></div>
          ) : favorites.length === 0 ? (
            <EmptyState
              icon="❤️"
              title="No saved places"
              message="Tap the heart on any listing to save it here."
              action={<Link href="/search"><Button variant="secondary">Explore Listings</Button></Link>}
            />
          ) : (
            <div className="space-y-3">
              {favorites.map((l) => (
                <Link key={l.id} href={`/listing/${l.slug}`}
                  className="flex items-center gap-3 bg-white dark:bg-dark-card border border-surface-100 dark:border-dark-border rounded-2xl overflow-hidden hover:border-brand-300 transition-colors">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image src={l.coverImage || '/placeholder.jpg'} alt={l.businessName} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0 py-3 pr-3">
                    <h3 className="font-bold text-sm text-surface-900 dark:text-white line-clamp-1">{l.businessName}</h3>
                    <p className="text-xs text-surface-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{l.area}</p>
                    {l.reviewCount > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">{l.ratingAverage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-400 mr-3 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )
        )}

        {/* Reviews */}
        {tab === 'reviews' && (
          <EmptyState icon="💬" title="No reviews yet" message="Start exploring and share your experience at Jos businesses." action={<Link href="/search"><Button variant="secondary">Find Businesses</Button></Link>} />
        )}

        {/* Add business promo */}
        <div className="mt-6 bg-gradient-to-r from-brand-500 to-earth-500 rounded-2xl p-5 text-center">
          <p className="font-bold text-white mb-1">Own a Business in Jos?</p>
          <p className="text-white/80 text-sm mb-3">List it free and get discovered by thousands.</p>
          <Link href="/add-listing">
            <Button variant="secondary" size="sm">Add Your Business</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
