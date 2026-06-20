'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, PlusCircle, Eye, Star, MessageSquare,
  Edit, Trash2, BarChart3, Image, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getOwnerListings } from '@/services/listings';
import { Button, Badge, Spinner, EmptyState } from '@/components/ui';
import { formatNumber, timeAgo, cn } from '@/utils';
import type { Listing } from '@/types';
import toast from 'react-hot-toast';

type Tab = 'listings' | 'analytics' | 'profile';

export default function DashboardPage() {
  const { appUser, isOwner, loading: authLoading, user } = useAuth();
  const router  = useRouter();
  const [tab,      setTab]      = useState<Tab>('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!authLoading && !isOwner) router.push('/auth?from=/dashboard');
  }, [isOwner, authLoading]);

  useEffect(() => {
    if (user?.uid) {
      setLoading(true);
      getOwnerListings(user.uid)
        .then(setListings)
        .catch(() => toast.error('Could not load listings'))
        .finally(() => setLoading(false));
    }
  }, [user?.uid]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!isOwner) return null;

  const TABS = [
    { id: 'listings'  as Tab, label: 'My Listings',  icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analytics' as Tab, label: 'Analytics',    icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'profile'   as Tab, label: 'Profile',      icon: <Edit className="w-4 h-4" /> },
  ];

  const totalViews   = listings.reduce((s, l) => s + l.viewCount, 0);
  const totalReviews = listings.reduce((s, l) => s + l.reviewCount, 0);
  const avgRating    = listings.length
    ? (listings.reduce((s, l) => s + l.ratingAverage, 0) / listings.length).toFixed(1)
    : '—';

  return (
    <div className="page-top min-h-screen bg-surface-50 dark:bg-dark-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-black text-2xl text-surface-900 dark:text-white">
              Business Dashboard
            </h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
              Welcome back, {appUser?.displayName?.split(' ')[0]} 👋
            </p>
          </div>
          <Link href="/add-listing">
            <Button icon={<PlusCircle className="w-4 h-4" />}>
              Add Listing
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Views',    value: formatNumber(totalViews),   icon: <Eye className="w-5 h-5 text-blue-500" /> },
            { label: 'Reviews',        value: totalReviews,               icon: <MessageSquare className="w-5 h-5 text-purple-500" /> },
            { label: 'Avg. Rating',    value: avgRating,                  icon: <Star className="w-5 h-5 text-amber-500" /> },
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
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                tab === id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              )}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ─── Listings tab ───────────────────────────────────────── */}
        {tab === 'listings' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12"><Spinner /></div>
            ) : listings.length === 0 ? (
              <EmptyState
                icon="🏢"
                title="No listings yet"
                message="Add your first business listing to get discovered by people in Jos."
                action={<Link href="/add-listing"><Button>Add Your Business</Button></Link>}
              />
            ) : listings.map((l) => (
              <div key={l.id} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border overflow-hidden">
                <div className="flex items-start gap-4 p-4">
                  {/* Image */}
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
                  <Link href={`/listing/${l.slug}`}>
                    <Button size="xs" variant="secondary" icon={<Eye className="w-3 h-3" />}>View</Button>
                  </Link>
                  <Link href={`/dashboard/edit/${l.id}`}>
                    <Button size="xs" variant="ghost" icon={<Edit className="w-3 h-3" />}>Edit</Button>
                  </Link>
                  <Link href={`/dashboard/photos/${l.id}`}>
                    <Button size="xs" variant="ghost" icon={<Image className="w-3 h-3" />}>Photos</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Analytics tab ──────────────────────────────────────── */}
        {tab === 'analytics' && (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-8 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-brand-500 opacity-50" />
            <h3 className="font-display font-bold text-xl text-surface-900 dark:text-white mb-2">Analytics Coming Soon</h3>
            <p className="text-surface-500 dark:text-surface-400 text-sm max-w-sm mx-auto">
              Detailed analytics including views over time, WhatsApp click-throughs, and search impressions are being built.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {[
                { label: 'Total Views',       value: formatNumber(totalViews) },
                { label: 'Total Saves',       value: listings.reduce((s, l) => s + l.saveCount, 0) },
                { label: 'Review Count',      value: totalReviews },
                { label: 'Average Rating',    value: avgRating },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface-50 dark:bg-dark-card2 rounded-xl p-3 text-left">
                  <div className="font-bold text-xl text-surface-900 dark:text-white">{value}</div>
                  <div className="text-xs text-surface-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Profile tab ────────────────────────────────────────── */}
        {tab === 'profile' && (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-6 space-y-5">
            <h3 className="font-display font-bold text-lg text-surface-900 dark:text-white">Account Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-dark-border">
                <span className="text-sm text-surface-500">Name</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{appUser?.displayName}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-dark-border">
                <span className="text-sm text-surface-500">Email</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{appUser?.email}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-dark-border">
                <span className="text-sm text-surface-500">Role</span>
                <Badge variant="success">{appUser?.role}</Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-surface-500">Listings</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{listings.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs = {
    active:    { variant: 'success' as const, icon: <CheckCircle className="w-3 h-3" />, label: 'Active' },
    pending:   { variant: 'warning' as const, icon: <Clock className="w-3 h-3" />,       label: 'Pending' },
    rejected:  { variant: 'danger'  as const, icon: <XCircle className="w-3 h-3" />,    label: 'Rejected' },
    suspended: { variant: 'danger'  as const, icon: <XCircle className="w-3 h-3" />,    label: 'Suspended' },
    draft:     { variant: 'default' as const, icon: <Edit className="w-3 h-3" />,        label: 'Draft' },
  };
  const cfg = configs[status as keyof typeof configs] || configs.draft;
  return (
    <Badge variant={cfg.variant} size="sm">
      {cfg.icon} {cfg.label}
    </Badge>
  );
}
