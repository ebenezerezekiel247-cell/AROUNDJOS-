'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Star } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/hooks/useAuth';
import { getListingById, updateListing } from '@/services/listings';
import type { Listing } from '@/services/listings';
import { useUpload } from '@/hooks/useUpload';
import { Button, Spinner } from '@/components/ui';
import { cn } from '@/utils';
import toast from 'react-hot-toast';

interface Props { params: Promise<{ id: string }> }

export default function PhotosPage({ params }: Props) {
  const { id } = use(params);
  const { isOwner, loading: authLoading } = useAuth();
  const router = useRouter();

  const [listing,  setListing]  = useState<Listing | null>(null);
  const [fetching, setFetching] = useState(true);
  const [images,   setImages]   = useState<string[]>([]);
  const [saving,   setSaving]   = useState(false);
  const { upload, uploading, progress } = useUpload({ type: 'listings', entityId: id });

  useEffect(() => {
    if (!authLoading && !isOwner) router.replace('/auth?from=/dashboard');
  }, [authLoading, isOwner, router]);

  useEffect(() => {
    if (id) {
      getListingById(id)
        .then(l => { if (l) { setListing(l); setImages(l.images || []); } })
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [id]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 8,
    onDrop: async (files) => {
      toast('Uploading photos…');
      const urls = await upload(files).catch(() => { toast.error('Upload failed'); return [] as string[]; });
      setImages(prev => [...prev, ...urls].slice(0, 12));
    },
  });

  const setCover = (url: string) => setImages(prev => [url, ...prev.filter(u => u !== url)]);
  const remove   = (url: string) => setImages(prev => prev.filter(u => u !== url));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateListing(id, { images, cover_image: images[0] || null });
      toast.success('Photos saved!');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to save photos');
    } finally { setSaving(false); }
  };

  if (authLoading || fetching) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="page-top min-h-screen bg-surface-50 dark:bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-brand-500 font-semibold mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="font-display font-black text-2xl text-surface-900 dark:text-white mb-2">Manage Photos</h1>
        {listing && <p className="text-surface-500 text-sm mb-6">{listing.businessName} · The first photo is your cover image</p>}

        {/* Upload zone */}
        <div {...getRootProps()} className={cn('border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-6',
          isDragActive ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'border-surface-200 dark:border-dark-border hover:border-brand-400 bg-white dark:bg-dark-card')}>
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-surface-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{isDragActive ? 'Drop photos here' : 'Drag & drop or tap to upload'}</p>
          <p className="text-xs text-surface-400 mt-1">JPG, PNG, WebP · Max 5MB · Up to 12 photos</p>
          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-surface-500 mb-1"><span>Uploading…</span><span>{progress}%</span></div>
              <div className="h-1.5 bg-surface-100 dark:bg-dark-border rounded-full">
                <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Photo grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {images.map((url, i) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden group bg-surface-100 dark:bg-dark-card2">
                <img src={url} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <div className="absolute top-2 left-2 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" /> Cover
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {i !== 0 && (
                    <button onClick={() => setCover(url)} className="bg-white text-surface-900 text-[10px] font-bold px-2 py-1 rounded-lg">Set Cover</button>
                  )}
                  <button onClick={() => remove(url)} className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleSave} loading={saving} disabled={uploading}>Save Photos</Button>
          <Link href="/dashboard"><Button variant="secondary">Cancel</Button></Link>
        </div>
      </div>
    </div>
  );
}
