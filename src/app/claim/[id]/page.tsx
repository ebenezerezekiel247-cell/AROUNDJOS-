'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getListingById } from '@/services/listings';
import { submitClaim } from '@/services/claims';
import { Button, Input, Textarea, Spinner } from '@/components/ui';
import toast from 'react-hot-toast';

interface Props { params: Promise<{ id: string }> }

export default function ClaimPage({ params }: Props) {
  const { id } = use(params);
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();

  const [listingName, setListingName] = useState('');
  const [position,    setPosition]    = useState('');
  const [phone,       setPhone]       = useState('');
  const [message,     setMessage]     = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace(`/auth?from=/claim/${id}`);
    if (id) getListingById(id).then(l => { if (l) setListingName(l.businessName); }).catch(() => {});
  }, [id, isLoggedIn, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!position.trim() || !phone.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await submitClaim(id, listingName, user.id, user.email!, user.email!.split('@')[0], phone, position, message);
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || 'Claim submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!isLoggedIn) return null;

  if (submitted) return (
    <div className="page-top min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="font-display font-black text-2xl text-surface-900 dark:text-white mb-2">Claim Submitted!</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mb-6">
          We will review your claim within 48 hours and notify you by email once approved.
        </p>
        <Link href={`/listing/${id}`}><Button>Back to Listing</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="page-top min-h-screen bg-surface-50 dark:bg-dark-bg">
      <div className="max-w-lg mx-auto px-4 py-8">
        <Link href={`/listing/${id}`} className="flex items-center gap-2 text-sm text-brand-500 font-semibold mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to listing
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-brand-500" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl text-surface-900 dark:text-white">Claim This Business</h1>
            {listingName && <p className="text-sm text-surface-500">{listingName}</p>}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-4 mb-6">
          <p className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2">What you get after claiming</p>
          <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
            <li>✓ Edit your business details and opening hours</li>
            <li>✓ Reply to customer reviews</li>
            <li>✓ Upload professional photos</li>
            <li>✓ Get a Verified badge on your listing</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-3xl border border-surface-100 dark:border-dark-border p-6 space-y-5">
          <Input label="Your Role / Position *" value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. Owner, Manager, Director" required />
          <Input label="Business Phone *" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+2348012345678" required />
          <Textarea label="How are you connected to this business? *" value={message} onChange={e => setMessage(e.target.value)} rows={4}
            placeholder="Briefly explain your relationship to this business..." required />
          <div className="border-2 border-dashed border-surface-200 dark:border-dark-border rounded-2xl p-5 text-center cursor-pointer hover:border-brand-400 transition-colors">
            <Upload className="w-6 h-6 text-surface-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-surface-600 dark:text-surface-300">Upload proof (optional)</p>
            <p className="text-xs text-surface-400 mt-1">Business registration, ID, or any document linking you to this business</p>
          </div>
          <Button type="submit" fullWidth loading={submitting}>Submit Claim Request</Button>
        </form>
      </div>
    </div>
  );
}
