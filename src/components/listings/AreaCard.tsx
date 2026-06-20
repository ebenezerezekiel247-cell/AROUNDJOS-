'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/utils';

// ─── Area Card ────────────────────────────────────────────────────────────────

interface AreaCardProps {
  name:      string;
  count:     number;
  image:     string;
  className?: string;
}

export function AreaCard({ name, count, image, className }: AreaCardProps) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link
      href={`/area/${slug}`}
      className={cn(
        'group relative overflow-hidden rounded-2xl aspect-square block',
        className
      )}
    >
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        sizes="(max-width: 640px) 50vw, 25vw"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="font-display font-bold text-white text-sm leading-tight">{name}</p>
        <p className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
          <MapPin className="w-2.5 h-2.5" />
          {count} places
        </p>
      </div>
    </Link>
  );
}

// ─── Sponsored Banner ─────────────────────────────────────────────────────────

export function SponsoredBanner() {
  // In production, fetch from Firestore /ads collection
  // Placeholder for now
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-plateau-900 via-plateau-800 to-plateau-700 p-6 sm:p-8">
      <div className="absolute top-0 right-0 w-48 h-48 bg-plateau-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/70 text-[10px] font-medium px-2 py-0.5 rounded-full mb-2">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            Sponsored
          </div>
          <h3 className="font-display font-bold text-white text-lg sm:text-xl mb-1">
            Advertise Your Business Here
          </h3>
          <p className="text-white/60 text-sm max-w-xs">
            Reach thousands of Jos residents and visitors with a sponsored listing or banner ad.
          </p>
        </div>
        <Link
          href="/advertise"
          className="flex-shrink-0 flex items-center gap-2 bg-white text-plateau-800 font-bold px-5 py-2.5 rounded-2xl hover:bg-plateau-50 transition-colors text-sm"
        >
          Get Started <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
