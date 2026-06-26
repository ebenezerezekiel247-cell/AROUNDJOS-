'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Heart, Phone, MessageCircle, Flame, Crown } from 'lucide-react';
import { cn, getWhatsAppLink, getPhoneLink, getPriceSymbol } from '@/utils';
import { Badge, StarRating, VerifiedBadge, CategoryIcon } from '@/components/ui';
import type { Listing } from '@/services/listings';
import type { Category } from '@/types';

interface ListingCardProps {
  listing:      Listing;
  isFavorited?: boolean;
  onFavorite?:  () => void;
  variant?:     'default' | 'compact' | 'horizontal';
  className?:   string;
}

export function ListingCard({ listing, isFavorited = false, onFavorite, variant = 'default', className }: ListingCardProps) {
  if (variant === 'horizontal') return <HorizontalListingCard listing={listing} isFavorited={isFavorited} onFavorite={onFavorite} className={className} />;
  if (variant === 'compact')    return <CompactListingCard listing={listing} className={className} />;

  return (
    <div className={cn('group relative bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-surface-100 dark:border-dark-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1', className)}>
      <Link href={`/listing/${listing.slug}`} className="block relative overflow-hidden aspect-[4/3]">
        <Image src={listing.coverImage || '/placeholder.jpg'} alt={listing.businessName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {listing.sponsored && <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Crown className="w-2.5 h-2.5" /> Sponsored</span>}
          {listing.featured && !listing.sponsored && <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Flame className="w-2.5 h-2.5" /> Featured</span>}
        </div>
        {onFavorite && (
          <button onClick={(e) => { e.preventDefault(); onFavorite(); }} className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
            <Heart className={cn('w-4 h-4 transition-colors', isFavorited ? 'fill-red-500 text-red-500' : 'text-surface-600 dark:text-white')} />
          </button>
        )}
        {listing.priceRange && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/50 text-white text-xs font-medium px-2 py-0.5 rounded-lg backdrop-blur-sm">{getPriceSymbol(listing.priceRange)}</span>
          </div>
        )}
      </Link>
      <Link href={`/listing/${listing.slug}`} className="block p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-surface-900 dark:text-white text-sm leading-tight line-clamp-1 font-display">{listing.businessName}</h3>
          {listing.verified && <VerifiedBadge />}
        </div>
        <div className="flex items-center gap-1 text-surface-500 dark:text-surface-400 text-xs mb-2.5">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="line-clamp-1">{listing.area} · Jos</span>
        </div>
        {listing.reviewCount > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <StarRating rating={listing.ratingAverage} size="sm" />
            <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">{listing.ratingAverage.toFixed(1)}</span>
            <span className="text-xs text-surface-400">({listing.reviewCount})</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-100 dark:border-dark-border">
          {listing.whatsapp && (
            <a href={getWhatsAppLink(listing.whatsapp)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold py-2 rounded-xl hover:bg-emerald-100 transition-colors">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          )}
          {listing.phone && (
            <a href={getPhoneLink(listing.phone)} onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs font-semibold py-2 rounded-xl hover:bg-brand-100 transition-colors">
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
          )}
        </div>
      </Link>
    </div>
  );
}

function HorizontalListingCard({ listing, isFavorited, onFavorite, className }: { listing: Listing; isFavorited?: boolean; onFavorite?: () => void; className?: string }) {
  return (
    <div className={cn('group bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-surface-100 dark:border-dark-border flex', className)}>
      <Link href={`/listing/${listing.slug}`} className="relative w-28 flex-shrink-0 overflow-hidden">
        <Image src={listing.coverImage || '/placeholder.jpg'} alt={listing.businessName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="112px" />
      </Link>
      <Link href={`/listing/${listing.slug}`} className="flex-1 p-3 min-w-0">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h3 className="font-bold text-sm text-surface-900 dark:text-white line-clamp-1 font-display">{listing.businessName}</h3>
          {onFavorite && <button onClick={(e) => { e.preventDefault(); onFavorite(); }} className="flex-shrink-0"><Heart className={cn('w-4 h-4', isFavorited ? 'fill-red-500 text-red-500' : 'text-surface-400')} /></button>}
        </div>
        <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1 mb-1.5"><MapPin className="w-3 h-3" /> {listing.area}</p>
        {listing.reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">{listing.ratingAverage.toFixed(1)}</span>
            <span className="text-xs text-surface-400">({listing.reviewCount})</span>
          </div>
        )}
      </Link>
    </div>
  );
}

function CompactListingCard({ listing, className }: { listing: Listing; className?: string }) {
  return (
    <Link href={`/listing/${listing.slug}`} className={cn('group flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-50 dark:hover:bg-dark-card transition-colors', className)}>
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
        <Image src={listing.coverImage || '/placeholder.jpg'} alt={listing.businessName} fill className="object-cover" sizes="56px" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-surface-900 dark:text-white line-clamp-1">{listing.businessName}</p>
        <p className="text-xs text-surface-500 dark:text-surface-400">{listing.area}</p>
        {listing.reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-surface-600 dark:text-surface-300">{listing.ratingAverage.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

interface CategoryCardProps { category: Category; className?: string; }

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        'group flex flex-col items-center gap-2.5 p-4 rounded-3xl border border-surface-100 dark:border-dark-border',
        'bg-white dark:bg-dark-card hover:border-brand-300 dark:hover:border-brand-700',
        'hover:shadow-card transition-all duration-200 hover:-translate-y-0.5',
        className
      )}
    >
      <CategoryIcon name={category.icon} color={category.color} size={22} />
      <span className="text-xs font-semibold text-surface-700 dark:text-surface-300 text-center leading-tight">{category.name}</span>
    </Link>
  );
}

export function FeaturedListingCard({ listing, className }: { listing: Listing; className?: string }) {
  return (
    <Link href={`/listing/${listing.slug}`} className={cn('group relative block overflow-hidden rounded-3xl aspect-[3/4] sm:aspect-[4/5]', className)}>
      <Image src={listing.coverImage || '/placeholder.jpg'} alt={listing.businessName} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width:640px) 50vw,25vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {listing.featured && <Badge variant="warning" className="mb-2">Featured</Badge>}
        <h3 className="font-bold text-white text-sm leading-tight mb-1 font-display">{listing.businessName}</h3>
        <p className="text-white/70 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> {listing.area}</p>
        {listing.reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-white text-xs font-semibold">{listing.ratingAverage.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
