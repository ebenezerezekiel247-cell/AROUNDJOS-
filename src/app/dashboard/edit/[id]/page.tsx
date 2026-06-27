'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getListingById, updateListing } from '@/services/listings';
import type { Listing } from '@/services/listings';
import { Button, Input, Textarea, Select, Spinner } from '@/components/ui';
import { JOS_AREAS } from '@/types';
import toast from 'react-hot-toast';

interface Props { params: Promise<{ id: string }> }

const PRICE_OPTIONS = [
  { value: 'budget',  label: '₦ Budget-friendly' },
  { value: 'mid',     label: '₦₦ Mid-range' },
  { value: 'premium', label: '₦₦₦ Premium' },
  { value: 'luxury',  label: '₦₦₦₦ Luxury' },
];

export default function EditListingPage({ params }: Props) {
  const { id } = use(params);
  const { user, isOwner, loading: authLoading } = useAuth();
  const router = useRouter();

  const [listing,  setListing]  = useState<Listing | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving,   setSaving]   = useState(false);

  const [form, setForm] = useState({
    business_name: '', tagline: '', description: '',
    address: '', area: '', phone: '', whatsapp: '',
    email: '', website: '', price_range: 'mid',
  });

  useEffect(() => {
    if (!authLoading && !isOwner) router.replace('/auth?from=/dashboard');
  }, [authLoading, isOwner, router]);

  useEffect(() => {
    if (id) {
      getListingById(id)
        .then(l => {
          if (!l) { toast.error('Listing not found'); router.push('/dashboard'); return; }
          setListing(l);
          setForm({
            business_name: l.businessName,
            tagline:       l.tagline || '',
            description:   l.description,
            address:       l.address,
            area:          l.area,
            phone:         l.phone,
            whatsapp:      l.whatsapp || '',
            email:         l.email || '',
            website:       l.website || '',
            price_range:   l.priceRange || 'mid',
          });
        })
        .catch(() => toast.error('Failed to load listing'))
        .finally(() => setFetching(false));
    }
  }, [id, router]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateListing(id, form);
      toast.success('Listing updated!');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || fetching) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!listing) return null;

  return (
    <div className="page-top min-h-screen bg-surface-50 dark:bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-brand-500 font-semibold mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="font-display font-black text-2xl text-surface-900 dark:text-white mb-6">Edit Listing</h1>

        <form onSubmit={handleSave} className="bg-white dark:bg-dark-card rounded-3xl border border-surface-100 dark:border-dark-border p-6 space-y-5">
          <Input label="Business Name *" value={form.business_name} onChange={e => set('business_name', e.target.value)} required />
          <Input label="Tagline" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Short catchy description" />
          <Textarea label="Description *" value={form.description} onChange={e => set('description', e.target.value)} rows={4} required />
          <Textarea label="Address *" value={form.address} onChange={e => set('address', e.target.value)} rows={2} required />
          <Select label="Area *" value={form.area} onChange={e => set('area', e.target.value)}
            options={JOS_AREAS.map(a => ({ value: a, label: a }))} />
          <Input label="Phone *" value={form.phone} onChange={e => set('phone', e.target.value)} type="tel" required />
          <Input label="WhatsApp" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} type="tel" />
          <Input label="Email" value={form.email} onChange={e => set('email', e.target.value)} type="email" />
          <Input label="Website" value={form.website} onChange={e => set('website', e.target.value)} type="url" />
          <Select label="Price Range" value={form.price_range} onChange={e => set('price_range', e.target.value)} options={PRICE_OPTIONS} />

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>Save Changes</Button>
            <Link href="/dashboard"><Button variant="secondary" type="button">Cancel</Button></Link>
          </div>
        </form>
      </div>
    </div>
  );
}
