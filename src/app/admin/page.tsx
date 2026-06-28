'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, ListChecks, MessageSquare, ShieldCheck,
  Clock, CheckCircle, XCircle, RefreshCw, Users, Star,
  Building2, Eye, Edit, Trash2, TrendingUp, FileText, Save,
  Crown, MapPin, Phone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getAdminListings, setListingStatus, deleteListing } from '@/services/listings';
import type { Listing } from '@/services/listings';
import { getAdminReviews, setReviewStatus } from '@/services/reviews';
import type { Review } from '@/services/reviews';
import { getPendingClaims, approveClaim, rejectClaim } from '@/services/claims';
import type { BusinessClaim } from '@/services/claims';
import { Button, Badge, Spinner } from '@/components/ui';
import { getSupabaseClient } from '@/lib/supabase/client';
import { timeAgo, formatNumber, cn } from '@/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

type AdminTab = 'overview' | 'pending' | 'listings' | 'reviews' | 'claims' | 'users' | 'content';

const db = () => getSupabaseClient() as any;

async function getUsers() { const { data } = await db().from('users').select('*').order('created_at', { ascending: false }).limit(100); return data || []; }
async function setUserRole(id: string, role: string) { const { error } = await db().from('users').update({ role }).eq('id', id); if (error) throw error; }
async function getSiteContent(key: string) { const { data } = await db().from('site_content').select('value').eq('key', key).single(); return data?.value || null; }
async function setSiteContent(key: string, value: any, userId: string) { const { error } = await db().from('site_content').upsert({ key, value, updated_at: new Date().toISOString(), updated_by: userId }, { onConflict: 'key' }); if (error) throw error; }

export default function AdminPage() {
  const { isAdmin, loading: authLoading, user } = useAuth();
  const router = useRouter();

  const [tab,      setTab]      = useState<AdminTab>('overview');
  const [listings, setListings] = useState<Listing[]>([]);
  const [pending,  setPending]  = useState<Listing[]>([]);
  const [reviews,  setReviews]  = useState<Review[]>([]);
  const [claims,   setClaims]   = useState<BusinessClaim[]>([]);
  const [users,    setUsers]    = useState<any[]>([]);
  const [loading,  setLoading]  = useState(false);

  // Content editing state
  const [aboutContent,   setAboutContent]   = useState<any>(null);
  const [contactContent, setContactContent] = useState<any>(null);
  const [savingContent,  setSavingContent]  = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) { toast.error('Admin access required'); router.push('/'); }
  }, [isAdmin, authLoading, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [all, pend, rev, cl, usr, about, contact] = await Promise.all([
        getAdminListings(), getAdminListings('pending'), getAdminReviews(),
        getPendingClaims(), getUsers(), getSiteContent('about'), getSiteContent('contact'),
      ]);
      setListings(all); setPending(pend); setReviews(rev);
      setClaims(cl); setUsers(usr);
      setAboutContent(about); setContactContent(contact);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isAdmin) loadData(); }, [isAdmin]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!isAdmin) return null;

  // ─── Listing Actions ────────────────────────────────────────────────────────
  const approveListing = async (id: string) => {
    await setListingStatus(id, 'active');
    setPending(p => p.filter(x => x.id !== id));
    setListings(l => l.map(x => x.id === id ? { ...x, status: 'active' as const } : x));
    toast.success('✅ Listing approved — now live!');
  };
  const rejectListing = async (id: string) => {
    await setListingStatus(id, 'rejected');
    setPending(p => p.filter(x => x.id !== id));
    setListings(l => l.map(x => x.id === id ? { ...x, status: 'rejected' as const } : x));
    toast.success('Listing rejected');
  };
  const removeListing = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" permanently? This cannot be undone.`)) return;
    await deleteListing(id);
    setListings(l => l.filter(x => x.id !== id));
    setPending(p => p.filter(x => x.id !== id));
    toast.success('Listing deleted');
  };
  const featureListing = async (id: string, featured: boolean) => {
    await db().from('listings').update({ featured: !featured }).eq('id', id);
    setListings(l => l.map(x => x.id === id ? { ...x, featured: !featured } : x));
    toast.success(featured ? 'Removed from featured' : '⭐ Added to featured');
  };
  const sponsorListing = async (id: string, sponsored: boolean) => {
    await db().from('listings').update({ sponsored: !sponsored }).eq('id', id);
    setListings(l => l.map(x => x.id === id ? { ...x, sponsored: !sponsored } : x));
    toast.success(sponsored ? 'Removed sponsorship' : '👑 Marked as sponsored');
  };
  const toggleVerify = async (id: string, verified: boolean) => {
    await db().from('listings').update({ verified: !verified }).eq('id', id);
    setListings(l => l.map(x => x.id === id ? { ...x, verified: !verified } : x));
    toast.success(verified ? 'Verification removed' : '✓ Listing verified');
  };

  // ─── Review Actions ─────────────────────────────────────────────────────────
  const hideReview = async (id: string) => {
    await setReviewStatus(id, 'hidden');
    setReviews(r => r.filter(x => x.id !== id));
    toast.success('Review hidden');
  };

  // ─── Claim Actions ──────────────────────────────────────────────────────────
  const approveClaimFn = async (claim: BusinessClaim) => {
    if (!user) return;
    await approveClaim(claim.id, claim.listingId, claim.userId, user.id);
    setClaims(c => c.filter(x => x.id !== claim.id));
    toast.success('✅ Claim approved — owner role granted!');
  };
  const rejectClaimFn = async (id: string) => {
    if (!user) return;
    await rejectClaim(id, user.id, 'Did not meet requirements');
    setClaims(c => c.filter(x => x.id !== id));
    toast.success('Claim rejected');
  };

  // ─── User Actions ────────────────────────────────────────────────────────────
  const changeRole = async (userId: string, role: string) => {
    await setUserRole(userId, role);
    setUsers(u => u.map(x => x.id === userId ? { ...x, role } : x));
    toast.success(`Role updated to ${role}`);
  };

  // ─── Content Actions ─────────────────────────────────────────────────────────
  const saveAbout = async () => {
    if (!user || !aboutContent) return;
    setSavingContent(true);
    try { await setSiteContent('about', aboutContent, user.id); toast.success('About page saved! ✅'); }
    catch { toast.error('Failed to save'); }
    finally { setSavingContent(false); }
  };
  const saveContact = async () => {
    if (!user || !contactContent) return;
    setSavingContent(true);
    try { await setSiteContent('contact', contactContent, user.id); toast.success('Contact info saved! ✅'); }
    catch { toast.error('Failed to save'); }
    finally { setSavingContent(false); }
  };

  const TABS: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview',  label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'pending',   label: 'Pending',  icon: <Clock className="w-4 h-4" />, count: pending.length },
    { id: 'listings',  label: 'Listings', icon: <ListChecks className="w-4 h-4" /> },
    { id: 'reviews',   label: 'Reviews',  icon: <MessageSquare className="w-4 h-4" />, count: reviews.filter(r => r.reportCount > 0).length },
    { id: 'claims',    label: 'Claims',   icon: <ShieldCheck className="w-4 h-4" />, count: claims.length },
    { id: 'users',     label: 'Users',    icon: <Users className="w-4 h-4" /> },
    { id: 'content',   label: 'Content',  icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="page-top min-h-screen bg-surface-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-black text-2xl text-surface-900 dark:text-white">Admin Panel</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400">AroundJos management dashboard</p>
          </div>
          <Button variant="secondary" size="sm" onClick={loadData} loading={loading} icon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-dark-card p-1 rounded-2xl border border-surface-100 dark:border-dark-border mb-6 overflow-x-auto no-scrollbar">
          {TABS.map(({ id, label, icon, count }) => (
            <button key={id} onClick={() => setTab(id)} className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0',
              tab === id ? 'bg-brand-500 text-white' : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
            )}>
              {icon} {label}
              {count != null && count > 0 && (
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-black', tab === id ? 'bg-white/20' : 'bg-red-500 text-white')}>{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW ──────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Listings',   value: listings.length,                                     icon: <Building2 className="w-5 h-5 text-brand-500" /> },
              { label: 'Pending Review',   value: pending.length,                                      icon: <Clock className="w-5 h-5 text-amber-500" /> },
              { label: 'Active Listings',  value: listings.filter(l => l.status === 'active').length,  icon: <CheckCircle className="w-5 h-5 text-emerald-500" /> },
              { label: 'Featured',         value: listings.filter(l => l.featured).length,             icon: <Star className="w-5 h-5 text-amber-400" /> },
              { label: 'Total Users',      value: users.length,                                        icon: <Users className="w-5 h-5 text-blue-500" /> },
              { label: 'Pending Claims',   value: claims.length,                                       icon: <ShieldCheck className="w-5 h-5 text-purple-500" /> },
              { label: 'Reported Reviews', value: reviews.filter(r => r.reportCount > 0).length,       icon: <MessageSquare className="w-5 h-5 text-red-500" /> },
              { label: 'Total Reviews',    value: reviews.length,                                      icon: <TrendingUp className="w-5 h-5 text-green-500" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-4">
                <div className="w-10 h-10 bg-surface-50 dark:bg-dark-card2 rounded-xl flex items-center justify-center mb-3">{icon}</div>
                <div className="font-display font-black text-2xl text-surface-900 dark:text-white">{value}</div>
                <div className="text-xs text-surface-500 dark:text-surface-400">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ─── PENDING APPROVAL ───────────────────────────────────────── */}
        {tab === 'pending' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white">
              Pending Approval ({pending.length})
            </h2>
            {pending.length === 0 ? (
              <div className="text-center py-16 text-surface-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                <p>All caught up! No listings waiting for review.</p>
              </div>
            ) : pending.map((l) => (
              <div key={l.id} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-5">
                <div className="flex items-start gap-4">
                  {l.coverImage && <img src={l.coverImage} alt={l.businessName} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-surface-900 dark:text-white">{l.businessName}</h3>
                      <Badge size="sm">{l.categorySlug}</Badge>
                    </div>
                    <p className="text-sm text-surface-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {l.address}, {l.area}</p>
                    <p className="text-sm text-surface-600 dark:text-surface-300 mt-1 line-clamp-2">{l.description}</p>
                    <p className="text-xs text-surface-400 mt-1">
                      <Phone className="w-3 h-3 inline mr-1" />{l.phone} · {l.images.length} photo{l.images.length !== 1 ? 's' : ''} · submitted {timeAgo(l.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-surface-100 dark:border-dark-border">
                  <Link href={`/listing/${l.slug}`} target="_blank"><Button size="xs" variant="secondary" icon={<Eye className="w-3 h-3" />}>Preview</Button></Link>
                  <Button size="xs" onClick={() => approveListing(l.id)} icon={<CheckCircle className="w-3 h-3" />}>Approve</Button>
                  <Button size="xs" variant="danger" onClick={() => rejectListing(l.id)} icon={<XCircle className="w-3 h-3" />}>Reject</Button>
                  <Button size="xs" variant="danger" onClick={() => removeListing(l.id, l.businessName)} icon={<Trash2 className="w-3 h-3" />}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── ALL LISTINGS ───────────────────────────────────────────── */}
        {tab === 'listings' && (
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white">All Listings ({listings.length})</h2>
            {listings.map((l) => (
              <div key={l.id} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-4">
                <div className="flex items-start gap-3">
                  {l.coverImage && <img src={l.coverImage} alt={l.businessName} className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-sm text-surface-900 dark:text-white">{l.businessName}</span>
                      <Badge variant={l.status === 'active' ? 'success' : l.status === 'pending' ? 'warning' : 'danger'} size="sm">{l.status}</Badge>
                      {l.featured  && <Badge variant="warning" size="sm">⭐</Badge>}
                      {l.sponsored && <Badge variant="brand"   size="sm">👑</Badge>}
                      {l.verified  && <Badge variant="success" size="sm">✓</Badge>}
                    </div>
                    <p className="text-xs text-surface-500">{l.area} · {formatNumber(l.viewCount)} views · {l.reviewCount} reviews · {l.ratingAverage.toFixed(1)}★</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-surface-100 dark:border-dark-border">
                  <Link href={`/listing/${l.slug}`} target="_blank"><Button size="xs" variant="secondary" icon={<Eye className="w-3 h-3" />}>View</Button></Link>
                  <Link href={`/dashboard/edit/${l.id}`}><Button size="xs" variant="ghost" icon={<Edit className="w-3 h-3" />}>Edit</Button></Link>
                  {l.status !== 'active'    && <Button size="xs" onClick={() => approveListing(l.id)}>Activate</Button>}
                  {l.status === 'active'    && <Button size="xs" variant="ghost" onClick={() => rejectListing(l.id)}>Suspend</Button>}
                  <Button size="xs" variant="ghost" onClick={() => featureListing(l.id, l.featured)} icon={<Star className="w-3 h-3" />}>{l.featured ? 'Unfeature' : 'Feature'}</Button>
                  <Button size="xs" variant="ghost" onClick={() => sponsorListing(l.id, l.sponsored)} icon={<Crown className="w-3 h-3" />}>{l.sponsored ? 'Unsponsor' : 'Sponsor'}</Button>
                  <Button size="xs" variant="ghost" onClick={() => toggleVerify(l.id, l.verified)} icon={<CheckCircle className="w-3 h-3" />}>{l.verified ? 'Unverify' : 'Verify'}</Button>
                  <Button size="xs" variant="danger" onClick={() => removeListing(l.id, l.businessName)} icon={<Trash2 className="w-3 h-3" />}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── REVIEWS ────────────────────────────────────────────────── */}
        {tab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white">Reported Reviews ({reviews.filter(r => r.reportCount > 0).length})</h2>
            {reviews.filter(r => r.reportCount > 0).length === 0 ? (
              <div className="text-center py-16 text-surface-400"><CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" /><p>No reported reviews</p></div>
            ) : reviews.filter(r => r.reportCount > 0).map((r) => (
              <div key={r.id} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-surface-900 dark:text-white">{r.authorName}</span>
                      <Badge variant="danger" size="sm">{r.reportCount} report{r.reportCount !== 1 ? 's' : ''}</Badge>
                      <span className="text-xs text-surface-400">{r.rating}★ · {timeAgo(r.createdAt)}</span>
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-300">{r.body}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="xs" variant="danger" onClick={() => hideReview(r.id)}>Hide</Button>
                    <Button size="xs" variant="ghost" onClick={() => setReviews(reviews.filter(x => x.id !== r.id))}>Dismiss</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── CLAIMS ─────────────────────────────────────────────────── */}
        {tab === 'claims' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white">Business Claims ({claims.length})</h2>
            {claims.length === 0 ? (
              <div className="text-center py-16 text-surface-400"><CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" /><p>No pending claims</p></div>
            ) : claims.map((c) => (
              <div key={c.id} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-surface-900 dark:text-white mb-1">{c.listingName}</h3>
                    <p className="text-sm text-surface-600 dark:text-surface-300"><span className="font-medium">{c.userName}</span> ({c.userEmail}) — {c.position}</p>
                    <p className="text-sm text-surface-500 mt-1 italic">"{c.message}"</p>
                    <p className="text-xs text-surface-400 mt-1">📞 {c.phone} · {c.proofDocuments.length} doc{c.proofDocuments.length !== 1 ? 's' : ''} · {timeAgo(c.createdAt)}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" onClick={() => approveClaimFn(c)} icon={<CheckCircle className="w-3.5 h-3.5" />}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => rejectClaimFn(c.id)} icon={<XCircle className="w-3.5 h-3.5" />}>Reject</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── USERS ──────────────────────────────────────────────────── */}
        {tab === 'users' && (
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white">All Users ({users.length})</h2>
            {users.map((u) => (
              <div key={u.id} className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center font-bold text-brand-600 text-sm flex-shrink-0">
                  {(u.display_name || u.email || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">{u.display_name || 'No name'}</p>
                  <p className="text-xs text-surface-500 truncate">{u.email}</p>
                  <p className="text-xs text-surface-400">{timeAgo(u.created_at)}</p>
                </div>
                <select
                  value={u.role || 'visitor'}
                  onChange={e => changeRole(u.id, e.target.value)}
                  disabled={u.id === user?.id}
                  className="text-xs bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-lg px-2 py-1.5 text-surface-700 dark:text-surface-300 focus:outline-none disabled:opacity-40"
                >
                  <option value="visitor">Visitor</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* ─── CONTENT EDITOR ─────────────────────────────────────────── */}
        {tab === 'content' && (
          <div className="space-y-6">
            <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white">Edit Site Content</h2>

            {/* About Page Editor */}
            {aboutContent && (
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-6">
                <h3 className="font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                  📖 About Page
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 mb-1.5">Headline</label>
                    <input
                      value={aboutContent.headline || ''}
                      onChange={e => setAboutContent({ ...aboutContent, headline: e.target.value })}
                      className="w-full bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 mb-1.5">Tagline</label>
                    <input
                      value={aboutContent.tagline || ''}
                      onChange={e => setAboutContent({ ...aboutContent, tagline: e.target.value })}
                      className="w-full bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 mb-1.5">Story (supports line breaks)</label>
                    <textarea
                      value={aboutContent.story || ''}
                      onChange={e => setAboutContent({ ...aboutContent, story: e.target.value })}
                      rows={6}
                      className="w-full bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-500 mb-2">Stats</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(aboutContent.stats || []).map((stat: any, i: number) => (
                        <div key={i} className="space-y-1.5">
                          <input
                            value={stat.value}
                            onChange={e => {
                              const stats = [...aboutContent.stats];
                              stats[i] = { ...stats[i], value: e.target.value };
                              setAboutContent({ ...aboutContent, stats });
                            }}
                            placeholder="500+"
                            className="w-full bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl px-3 py-2 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                          />
                          <input
                            value={stat.label}
                            onChange={e => {
                              const stats = [...aboutContent.stats];
                              stats[i] = { ...stats[i], label: e.target.value };
                              setAboutContent({ ...aboutContent, stats });
                            }}
                            placeholder="Businesses"
                            className="w-full bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl px-3 py-2 text-xs text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={saveAbout} loading={savingContent} icon={<Save className="w-4 h-4" />} className="mt-5">
                  Save About Page
                </Button>
              </div>
            )}

            {/* Contact Info Editor */}
            {contactContent && (
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border p-6">
                <h3 className="font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                  📞 Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '+2348031234567' },
                    { key: 'email',    label: 'Email Address',   placeholder: 'hello@aroundjos.com' },
                    { key: 'address',  label: 'Address',         placeholder: 'Jos, Plateau State, Nigeria' },
                    { key: 'hours',    label: 'Business Hours',  placeholder: 'Mon – Fri: 9am – 6pm' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-surface-500 mb-1.5">{label}</label>
                      <input
                        value={contactContent[key] || ''}
                        onChange={e => setContactContent({ ...contactContent, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={saveContact} loading={savingContent} icon={<Save className="w-4 h-4" />} className="mt-5">
                  Save Contact Info
                </Button>
              </div>
            )}

            {/* Note about content not yet set up */}
            {!aboutContent && !contactContent && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/20 rounded-2xl p-6 text-center">
                <p className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Content tables not set up yet</p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">Run the SQL migration to enable content editing:</p>
                <code className="text-xs bg-amber-100 dark:bg-amber-900/20 px-3 py-1 rounded-lg text-amber-800 dark:text-amber-300">
                  supabase/migrations/003_site_content.sql
                </code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
