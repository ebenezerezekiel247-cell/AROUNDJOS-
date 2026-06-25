'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Plus, Phone, Globe, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createListing } from '@/services/listings';
import { useUpload } from '@/hooks/useUpload';
import { CATEGORIES } from '@/services/categories';
import { JOS_AREAS } from '@/types';
import { Button, Input, Textarea, Select, RawCategoryIcon } from '@/components/ui';
import { cn } from '@/utils';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const PRICE_RANGES = [
  { value: 'budget', label: '₦ Budget-friendly' },
  { value: 'mid', label: '₦₦ Mid-range' },
  { value: 'premium', label: '₦₦₦ Premium' },
  { value: 'luxury', label: '₦₦₦₦ Luxury' },
];
const STEPS = ['Business Info', 'Location & Contact', 'Details', 'Photos'];

export default function AddListingPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const entityId = useState(() => uuidv4())[0];
  const { upload, uploading, progress } = useUpload({ type: 'listings', entityId });

  const [form, setForm] = useState({
    business_name: '', tagline: '', description: '', category_slug: '',
    subcategory_slug: '', address: '', area: '', phone: '', whatsapp: '',
    email: '', website: '', price_range: 'mid', amenities: [] as string[], services: [] as string[],
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }, maxFiles: 8,
    onDrop: (files) => {
      setImageFiles((p) => [...p, ...files].slice(0, 8));
      setImagePreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))].slice(0, 8));
    },
  });

  const addTag = (key: 'amenities' | 'services', val: string, clear: () => void) => {
    if (val.trim() && !(form[key] as string[]).includes(val.trim())) set(key, [...(form[key] as string[]), val.trim()]);
    clear();
  };

  const canNext = () => {
    if (step === 0) return form.business_name.trim() && form.description.trim() && form.category_slug;
    if (step === 1) return form.address.trim() && form.area && form.phone.trim();
    return true;
  };

  const handleSubmit = async () => {
    if (!user) { toast.error('Please sign in first'); return; }
    setSubmitting(true);
    try {
      let images: string[] = [];
      if (imageFiles.length > 0) {
        toast('Uploading images…');
        images = await upload(imageFiles);
      }
      await createListing({
        ...form,
        images,
        cover_image: images[0] || null,
        lat: null, lng: null,
        opening_hours: null,
        status: 'pending',
        verified: false, claimed: false, featured: false, sponsored: false,
      }, user.id);
      toast.success('Listing submitted! We\'ll review it within 24 hours 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create listing');
    } finally { setSubmitting(false); }
  };

  if (!isLoggedIn) {
    return (
      <div className="page-top min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-xl font-bold mb-4">Sign in to add a listing</p>
          <Button onClick={() => router.push('/auth?from=/add-listing')}>Sign In</Button>
        </div>
      </div>
    );
  }

  const selectedCategory = CATEGORIES.find((c) => c.slug === form.category_slug);

  return (
    <div className="page-top min-h-screen bg-surface-50 dark:bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-surface-900 dark:text-white mb-1">Add Your Business</h1>
          <p className="text-surface-500 text-sm">Get discovered by thousands in Jos</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors',
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-brand-500 text-white' : 'bg-surface-200 dark:bg-dark-border text-surface-500')}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={cn('text-xs font-medium truncate hidden sm:block', i === step ? 'text-brand-500' : 'text-surface-400')}>{label}</span>
              {i < STEPS.length - 1 && <div className={cn('flex-1 h-0.5', i < step ? 'bg-emerald-500' : 'bg-surface-200 dark:bg-dark-border')} />}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl border border-surface-100 dark:border-dark-border p-6 space-y-5">
          {step === 0 && (<>
            <Input label="Business Name *" value={form.business_name} onChange={(e) => set('business_name', e.target.value)} placeholder="e.g. Plateau Kitchen" />
            <Input label="Tagline (optional)" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="e.g. Best local food in Jos" />
            <Textarea label="Description *" value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} placeholder="Tell people about your business…" />
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat.slug} type="button" onClick={() => set('category_slug', cat.slug)}
                    className={cn('flex items-center gap-2 p-3 rounded-2xl border text-xs font-medium transition-all text-left',
                      form.category_slug === cat.slug ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'border-surface-200 dark:border-dark-border hover:border-brand-300 text-surface-600 dark:text-surface-300')}>
                    <RawCategoryIcon name={cat.icon} color={form.category_slug === cat.slug ? cat.color : '#6B7280'} size={16} /><span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {selectedCategory && selectedCategory.subcategories.length > 0 && (
              <Select label="Subcategory" value={form.subcategory_slug}
                onChange={(e) => set('subcategory_slug', e.target.value)}
                options={selectedCategory.subcategories.map((s) => ({ value: s.slug, label: s.name }))}
                placeholder="Select subcategory (optional)" />
            )}
            <Select label="Price Range" value={form.price_range} onChange={(e) => set('price_range', e.target.value)} options={PRICE_RANGES} />
          </>)}

          {step === 1 && (<>
            <Textarea label="Address *" value={form.address} onChange={(e) => set('address', e.target.value)} rows={2} placeholder="e.g. No. 14 Ahmadu Bello Way, Terminus" />
            <Select label="Area in Jos *" value={form.area} onChange={(e) => set('area', e.target.value)}
              options={JOS_AREAS.map((a) => ({ value: a, label: a }))} placeholder="Select area" />
            <Input label="Phone *" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+2348012345678" icon={<Phone className="w-4 h-4" />} />
            <Input label="WhatsApp" type="tel" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+2348012345678 (optional)" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="business@example.com" />
            <Input label="Website" type="url" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://yourwebsite.com" icon={<Globe className="w-4 h-4" />} />
          </>)}

          {step === 2 && (<>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Amenities</label>
              <div className="flex gap-2 mb-2">
                <input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('amenities', amenityInput, () => setAmenityInput('')))}
                  placeholder="e.g. Wi-Fi, Parking, AC…"
                  className="flex-1 bg-surface-50 dark:bg-dark-card border border-surface-200 dark:border-dark-border rounded-2xl px-4 py-2.5 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <Button size="sm" variant="secondary" type="button" onClick={() => addTag('amenities', amenityInput, () => setAmenityInput(''))}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    {a} <button type="button" onClick={() => set('amenities', form.amenities.filter((x) => x !== a))}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Services Offered</label>
              <div className="flex gap-2 mb-2">
                <input value={serviceInput} onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('services', serviceInput, () => setServiceInput('')))}
                  placeholder="e.g. Dine-In, Delivery…"
                  className="flex-1 bg-surface-50 dark:bg-dark-card border border-surface-200 dark:border-dark-border rounded-2xl px-4 py-2.5 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <Button size="sm" variant="secondary" type="button" onClick={() => addTag('services', serviceInput, () => setServiceInput(''))}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.services.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 bg-surface-100 dark:bg-dark-card2 text-surface-600 dark:text-surface-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    {s} <button type="button" onClick={() => set('services', form.services.filter((x) => x !== s))}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </>)}

          {step === 3 && (<>
            <div {...getRootProps()} className={cn('border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors',
              isDragActive ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'border-surface-300 dark:border-dark-border hover:border-brand-400')}>
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-surface-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{isDragActive ? 'Drop images here' : 'Drag & drop or tap to select'}</p>
              <p className="text-xs text-surface-400 mt-1">JPG, PNG, WebP · Max 5MB · Up to 8 images</p>
            </div>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {i === 0 && <span className="absolute top-1 left-1 bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Cover</span>}
                    <button type="button" onClick={() => { setImageFiles((f) => f.filter((_, idx) => idx !== i)); setImagePreviews((p) => p.filter((_, idx) => idx !== i)); }}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {uploading && (
              <div>
                <div className="flex justify-between text-xs text-surface-500 mb-1"><span>Uploading…</span><span>{progress}%</span></div>
                <div className="h-1.5 bg-surface-100 dark:bg-dark-border rounded-full"><div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
              </div>
            )}
          </>)}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="secondary" onClick={() => setStep((s) => s - 1)} disabled={step === 0 || submitting}>Back</Button>
          {step < STEPS.length - 1
            ? <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>Next</Button>
            : <Button onClick={handleSubmit} loading={submitting || uploading}>Submit Listing</Button>
          }
        </div>
        <p className="text-center text-xs text-surface-400 mt-4">Listings are reviewed within 24 hours before going live.</p>
      </div>
    </div>
  );
}
