'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, ListChecks, MessageSquare, ShieldCheck,
  Users, TrendingUp, Clock, CheckCircle, XCircle, Eye,
  RefreshCw, LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getAdminListings, setListingStatus } from '@/services/listings';
import { getAdminReviews, setReviewStatus } from '@/services/reviews';
import { getPendingClaims, approveClaim, rejectClaim } from '@/services/claims';
import { Button, Badge, Spinner, Divider } from '@/components/ui';
import { formatDate, timeAgo, cn } from '@/utils';
import type { Listing, Review, BusinessClaim } from '@/types';
import toast from 'react-hot-toast';

type AdminTab = 'overview' | 'listings' | 'reviews' | 'claims' | 'users';

export default function AdminPage() {
  const { isAdmin, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const [tab,       setTab]       = useState<AdminTab>('overview');
  const [listings,  setListings]  = useState<Listing[]>([]);
  const [reviews,   setReviews]   = useState<Review[]>([]);
  const [claims,    setClaims]    = useState<BusinessClaim[]>([]);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/');
  }, [isAdmin, authLoading]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [l, r, c] = await Promise.all([
        getAdminListings('pending'),
        getAdminReviews('active'),
        getPendingClaims(),
      ]);
      setListings(l);
      setReviews(r);
      setClaims(c);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdmin) loadData(); }, [isAdmin]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!isAdmin) return null;

  const handleApproveListing  = async (id: string) => {
    await setListingStatus(id, 'active');
    setListings((l) => l.filter((x) => x.id !== id));
    toast.success('Listing approved ✅');
  };
  const handleRejectListing   = async (id: string) => {
    await setListingStatus(id, 'rejected');
    setListings((l) => l.filter((x) => x.id !== id));
    toast.success('Listing rejected');
  };
  const handleHideReview      = async (id: string) => {
    await setReviewStatus(id, 'hidden');
    setReviews((r) => r.filter((x) => x.id !== id));
    toast.success('Review hidden');
  };
  const handleApproveClaim    = async (claim: BusinessClaim) => {
    await approveClaim(claim.id, claim.listingId, claim.userId, user!.uid);
    setClaims((c) => c.filter((x) => x.id !== claim.id));
    toast.success('Claim approved — business owner role granted ✅');
  };
  const handleRejectClaim     = async (id: string) => {
    await rejectClaim(id, user!.uid, 'Did not meet requirements');
    setClaims((c) => c.filter((x) => x.id !== id));
    toast.success('Claim rejected');
  };

  const TABS: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview',  icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'listings', label: 'Listings',  icon: <ListChecks      className="w-4 h-4" />, count: listings.length },
    { id: 'reviews',  label: 'Reviews',   icon: <MessageSquare   className="w-4 h-4" />, count: reviews.filter(r => r.reportCount > 0).length },
    { id: 'claims',   label: 'Claims',    icon: <ShieldCheck     className="w-4 h-4" />, count: claims.length },
  ];

  return (
    <div className="page-top min-h-screen bg-surface-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-black text-2xl text-surface-900 dark:text-white">Admin Panel</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400">AroundJos management dashboard</p>
          </div>
          <Button variant="secondary" size="sm" onClick={loadData} loading={loading} icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-dark-card p-1 rounded-2xl border border-surface-100 dark:border-dark-border mb-8 overflow-x-auto no-scrollbar">
          {TABS.map(({ id, label, icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors',
                tab === id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              )}
            >
              {icon} {label}
              {count != null && count > 0 && (
                <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-black', tab === id ? 'bg-white/20' : 'bg-red-500 text-white')}>{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ─── Overview ───────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Pending Listings', value: listings.length,           icon: <Clock className="w-5 h-5 text-amber-500" />,   color: 'amber' },
              { label: 'Pending Claims',   value: claims.length,             icon: <ShieldCheck className="w-5 h-5 text-blue-500" />, color: 'blue' },
              { label: 'Total Reviews',    value: reviews.length,            icon: <MessageSquare className="w-5 h-5 text-purple-500" />, color: 'purple' },
              { label: 'Reported Reviews', value: reviews.filter((r) => r.reportCount > 0).length, icon: <XCircle className="w-5 h-5 text-red-500" />, color: 'red' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-surface-50 dark:bg-dark-card2 rounded-xl flex items-center justify-center">
                    {icon}
                  </div>
                </div>
                <div className="font-display font-black text-3xl text-surface-900 dark:text-white">{value}</div>
                <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Pending Listings ───────────────────────────────────── */}
        {tab === 'listings' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white">Pending Approval ({listings.length})</h2>
            {listings.length === 0 ? (
              <div className="text-center py-16 text-surface-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                <p>All listings reviewed!</p>
              </div>
            ) : listings.map((l) => (
              <div key={l.id} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-surface-900 dark:text-white">{l.businessName}</h3>
                      <Badge>{l.categorySlug}</Badge>
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{l.address}, {l.area}</p>
                    <p className="text-sm text-surface-600 dark:text-surface-300 mt-2 line-clamp-2">{l.description}</p>
                    <p className="text-xs text-surface-400 mt-2">
                      Phone: {l.phone} · {l.images.length} image{l.images.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" onClick={() => handleApproveListing(l.id)} icon={<CheckCircle className="w-3.5 h-3.5" />}>
                      Approve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleRejectListing(l.id)} icon={<XCircle className="w-3.5 h-3.5" />}>
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Reviews ────────────────────────────────────────────── */}
        {tab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white">Reported Reviews</h2>
            {reviews.filter((r) => r.reportCount > 0).length === 0 ? (
              <div className="text-center py-16 text-surface-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                <p>No reported reviews</p>
              </div>
            ) : reviews.filter((r) => r.reportCount > 0).map((r) => (
              <div key={r.id} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-surface-900 dark:text-white">{r.authorName}</span>
                      <Badge variant="danger">{r.reportCount} report{r.reportCount !== 1 ? 's' : ''}</Badge>
                      <span className="text-xs text-surface-400">{r.rating}★</span>
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-300">{r.body}</p>
                    <p className="text-xs text-surface-400 mt-1">{timeAgo(r.createdAt)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="xs" variant="danger" onClick={() => handleHideReview(r.id)}>Hide</Button>
                    <Button size="xs" variant="ghost" onClick={() => setReviews(reviews.filter((x) => x.id !== r.id))}>Dismiss</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Claims ─────────────────────────────────────────────── */}
        {tab === 'claims' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white">Business Claims ({claims.length})</h2>
            {claims.length === 0 ? (
              <div className="text-center py-16 text-surface-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                <p>No pending claims</p>
              </div>
            ) : claims.map((c) => (
              <div key={c.id} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-surface-900 dark:text-white mb-1">{c.listingName}</h3>
                    <p className="text-sm text-surface-600 dark:text-surface-300">
                      <span className="font-medium">{c.userName}</span> ({c.userEmail}) — {c.position}
                    </p>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5 italic">"{c.message}"</p>
                    <p className="text-xs text-surface-400 mt-1.5">Phone: {c.phone} · {c.proofDocuments.length} document{c.proofDocuments.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => handleApproveClaim(c)} icon={<CheckCircle className="w-3.5 h-3.5" />}>
                      Approve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleRejectClaim(c.id)} icon={<XCircle className="w-3.5 h-3.5" />}>
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
