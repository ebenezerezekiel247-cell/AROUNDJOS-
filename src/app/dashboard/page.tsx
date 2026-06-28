'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, PlusCircle, Eye, Star, MessageSquare,
  Edit, BarChart3, Image as ImageIcon, CheckCircle, Clock,
  XCircle, ArrowRight, Building2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getOwnerListings } from '@/services/listings';
import type { Listing } from '@/services/listings';
import { Button, Badge, Spinner, EmptyState } from '@/components/ui';
import { formatNumber, cn } from '@/utils';
import toast from 'react-hot-toast';

type Tab = 'listings' | 'analytics' | 'profile';

export default function DashboardPage() {
  const { profile, isLoggedIn, isOwner, isAdmin, loading, user } = useAuth();
  const router  = useRouter();
  const [tab,      setTab]      = useState<Tab>('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [fetching, setFetching] = useState(false);

  // Only redirect if definitely not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) router.push('/auth?from=/dashboard');
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    if (user?.id && (isOwner || isAdmin)) {
      setFetching(true);
      getOwnerListings(user.id)
        .then(setListings)
        .catch(() => toast.error('Could not load listings'))
        .finally(() => setFetching(false));
    }
  }, [user?.id, isOwner, isAdmin]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!isLoggedIn) return null;

  // Visitor (not yet a business owner) — show upgrade prompt
  if (!isOwner && !isAdmin) {
    return (
      <div className="page-top min-h-screen bg-surface-50 dark:bg-dark-bg">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-brand-500" />
          </div>
          <h1 className="font-display font-black text-2xl text-surface-900 dark:text-white mb-3">
            Welcome, {profile?.display_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mb-8">
            You don&apos;t have a business listing yet. Add your first business to unlock the owner dashboard with analytics, photo management, and review responses.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/add-listing">
              <Button fullWidth size="lg" icon={<PlusCircle className="w-5 h-5" />}>
                Add Your Business — Free
              </Button>
            </Link>
            <Link href="/search">
              <Button fullWidth variant="secondary">Browse Listings</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'listings',  label: 'My Listings',  icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics',    icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'profile',   label: 'Profile',      icon: <Edit className="w-4 h-4" /> },
  ];

  const totalViews   = listings.reduce((s, l) => s + l.viewCount,   0);
  const totalReviews = listings.reduce((s, l) => s + l.reviewCount, 0);
  const avgRating    = listings.length
    ? (listings.reduce((s, l) => s + l.ratingAverage, 0) / listings.length).toFixed(1)
    : '—';

  return (
    <div className="page-top min-h-screen bg-surface-50 dark:bg-dark-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-black text-2xl text-surface-900 dark:text-white">
              Business Dashboard
            </h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
              Welcome back, {profile?.display_name?.split(' ')[0] || 'there'} 👋
            </p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Link href="/admin">
                <Button variant="secondary" size="sm">Admin Panel</Button>
              </Link>
            )}
            <Link href="/add-listing">
              <Button icon={<PlusCircle className="w-4 h-4" />} size="sm">Add Listing</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Views',  value: formatNumber(totalViews),  icon: <Eye className="w-5 h-5 text-blue-500" /> },
            { label: 'Reviews',      value: totalReviews,               icon: <MessageSquare className="w-5 h-5 text-purple-500" /> },
            { label: 'Avg. Rating',  value: avgRating,                  icon: <Star className="w-5 h-5 text-amber-500" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-4 text-center">
              <div className="flex justify-center mb-2">{icon}</div>
              <div className="font-display font-black text-2xl text-surface-900 dark:text-white">{value}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-dark-card p-1 rounded-2xl border border-surface-100 dark:border-dark-border mb-6">
          {TABS.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)} className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              tab === id ? 'bg-brand-500 text-white shadow-sm' : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
            )}>
              {icon}<span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {tab === 'listings' && (
          <div className="space-y-4">
            {fetching ? (
              <div className="text-center py-12"><Spinner /></div>
            ) : listings.length === 0 ? (
              <EmptyState icon="🏢" title="No listings yet"
                message="Add your first business listing to get discovered by people in Jos."
                action={<Link href="/add-listing"><Button>Add Your Business</Button></Link>} />
            ) : listings.map((l) => (
              <div key={l.id} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border overflow-hidden">
                <div className="flex items-start gap-4 p-4">
                  {l.coverImage && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={l.coverImage} alt={l.businessName} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-surface-900 dark:text-white">{l.businessName}</h3>
                      <StatusBadge status={l.status} />
                    </div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mb-2">{l.area}, Jos</p>
                    <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatNumber(l.viewCount)}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {l.reviewCount}</span>
                      {l.ratingAverage > 0 && (
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {l.ratingAverage.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-t border-surface-100 dark:border-dark-border px-4 py-3 flex items-center gap-2">
                  <Link href={`/listing/${l.slug}`}><Button size="xs" variant="secondary" icon={<Eye className="w-3 h-3" />}>View</Button></Link>
                  <Link href={`/dashboard/edit/${l.id}`}><Button size="xs" variant="ghost" icon={<Edit className="w-3 h-3" />}>Edit</Button></Link>
                  <Link href={`/dashboard/photos/${l.id}`}><Button size="xs" variant="ghost" icon={<ImageIcon className="w-3 h-3" />}>Photos</Button></Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'analytics' && (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-8 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-brand-500 opacity-50" />
            <h3 className="font-display font-bold text-xl text-surface-900 dark:text-white mb-2">Analytics Coming Soon</h3>
            <p className="text-surface-500 dark:text-surface-400 text-sm max-w-sm mx-auto">
              Views over time, WhatsApp click-throughs, and search impressions — coming in the next update.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {[['Total Views', formatNumber(totalViews)], ['Total Saves', listings.reduce((s,l) => s+l.saveCount, 0)], ['Reviews', totalReviews], ['Avg Rating', avgRating]].map(([label, value]) => (
                <div key={label} className="bg-surface-50 dark:bg-dark-card2 rounded-xl p-3 text-left">
                  <div className="font-bold text-xl text-surface-900 dark:text-white">{value}</div>
                  <div className="text-xs text-surface-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-surface-900 dark:text-white">Account Details</h3>
            {[
              ['Name',     profile?.display_name],
              ['Email',    profile?.email || user?.email],
              ['Role',     profile?.role],
              ['Listings', listings.length],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-dark-border last:border-0">
                <span className="text-sm text-surface-500">{label}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white capitalize">{String(value)}</span>
              </div>
            ))}
            <Link href="/profile"><Button variant="secondary" fullWidth icon={<ArrowRight className="w-4 h-4" />}>Go to Profile</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs = {
    active:    { variant: 'success' as const, icon: <CheckCircle className="w-3 h-3" />, label: 'Active' },
    pending:   { variant: 'warning' as const, icon: <Clock className="w-3 h-3" />,       label: 'Pending Review' },
    rejected:  { variant: 'danger'  as const, icon: <XCircle className="w-3 h-3" />,    label: 'Rejected' },
    suspended: { variant: 'danger'  as const, icon: <XCircle className="w-3 h-3" />,    label: 'Suspended' },
    draft:     { variant: 'default' as const, icon: <Edit className="w-3 h-3" />,        label: 'Draft' },
  };
  const cfg = configs[status as keyof typeof configs] || configs.draft;
  return <Badge variant={cfg.variant} size="sm">{cfg.icon} {cfg.label}</Badge>;
}
