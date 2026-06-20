import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Phone, MessageCircle, Globe, Clock, Star,
  Share2, Heart, BadgeCheck, Flag, ChevronRight, ExternalLink
} from 'lucide-react';
import { getListingBySlug, incrementViewCount } from '@/services/listings';
import { getReviewsByListing } from '@/services/reviews';
import { getCategoryBySlug } from '@/services/categories';
import {
  Badge, StarRating, Button, SectionHeader, Divider
} from '@/components/ui';
import { ReviewSection } from '@/components/reviews/ReviewSection';
import { ListingImageGallery } from '@/components/listings/ListingImageGallery';
import { ClaimBanner } from '@/components/listings/ClaimBanner';
import { getWhatsAppLink, getPhoneLink, formatNumber, getPriceLabel, isOpenNow, timeAgo } from '@/utils';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListingBySlug(params.slug).catch(() => null);
  if (!listing) return { title: 'Business Not Found' };

  return {
    title:       `${listing.businessName} – Jos`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title:       listing.businessName,
      description: listing.description.slice(0, 160),
      images:      listing.coverImage ? [{ url: listing.coverImage }] : [],
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const [listing, reviews] = await Promise.all([
    getListingBySlug(params.slug).catch(() => null),
    getReviewsByListing(params.slug, 20).catch(() => []),
  ]);

  if (!listing) notFound();

  // Fire-and-forget view count increment
  incrementViewCount(listing.id).catch(() => {});

  const category = getCategoryBySlug(listing.categorySlug);
  const openNow  = isOpenNow(listing.openingHours as Record<string, { open: boolean; from: string; to: string }>);
  const whatsappMsg = `Hello, I found ${listing.businessName} on AroundJos! I'd like to enquire about your services.`;

  return (
    <div className="page-top">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="container-app py-3">
        <nav className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400">
          <Link href="/" className="hover:text-brand-500">Home</Link>
          <ChevronRight className="w-3 h-3" />
          {category && (
            <>
              <Link href={`/category/${category.slug}`} className="hover:text-brand-500">{category.name}</Link>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span className="text-surface-700 dark:text-white truncate">{listing.businessName}</span>
        </nav>
      </div>

      {/* ─── Image Gallery ───────────────────────────────────────────── */}
      <ListingImageGallery images={listing.images} name={listing.businessName} />

      <div className="container-app">
        <div className="grid lg:grid-cols-3 gap-8 mt-6">

          {/* ─── Main Content ───────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {listing.featured  && <Badge variant="warning">⭐ Featured</Badge>}
                {listing.sponsored && <Badge variant="brand">👑 Sponsored</Badge>}
                {listing.verified  && <Badge variant="success"><BadgeCheck className="w-3 h-3" /> Verified</Badge>}
                {listing.claimed   && <Badge variant="info">🔑 Owner Managed</Badge>}
                {category && (
                  <Link href={`/category/${category.slug}`}>
                    <Badge>{category.icon} {category.name}</Badge>
                  </Link>
                )}
              </div>

              <h1 className="font-display font-black text-2xl sm:text-3xl text-surface-900 dark:text-white mb-2">
                {listing.businessName}
              </h1>

              {listing.tagline && (
                <p className="text-surface-500 dark:text-surface-400 italic mb-3">{listing.tagline}</p>
              )}

              {/* Rating summary */}
              {listing.reviewCount > 0 ? (
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={listing.ratingAverage} size="md" />
                    <span className="font-bold text-surface-900 dark:text-white">
                      {listing.ratingAverage.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-surface-500 text-sm">
                    ({formatNumber(listing.reviewCount)} reviews)
                  </span>
                </div>
              ) : (
                <p className="text-surface-400 text-sm mb-3">No reviews yet — be the first!</p>
              )}

              {/* Location */}
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-300 text-sm">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>{listing.address}, {listing.area}, Jos</span>
              </div>

              {/* Open/Closed status */}
              {openNow !== null && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${openNow ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className={openNow ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                    {openNow ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              )}
            </div>

            <Divider />

            {/* Quick Actions (Mobile) */}
            <div className="flex gap-3 lg:hidden">
              {listing.whatsapp && (
                <a href={getWhatsAppLink(listing.whatsapp, whatsappMsg)} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-2xl text-sm transition-colors">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                </a>
              )}
              {listing.phone && (
                <a href={getPhoneLink(listing.phone)} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-2xl text-sm transition-colors">
                    <Phone className="w-4 h-4" /> Call
                  </button>
                </a>
              )}
            </div>

            {/* About */}
            <div>
              <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white mb-3">About</h2>
              <p className="text-surface-600 dark:text-surface-300 leading-relaxed text-sm">{listing.description}</p>
            </div>

            {/* Services */}
            {listing.services.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white mb-3">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.services.map((s) => (
                    <span key={s} className="bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {listing.amenities.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white mb-3">Amenities</h2>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {listing.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opening Hours */}
            {listing.openingHours && (
              <div>
                <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Opening Hours
                </h2>
                <div className="bg-surface-50 dark:bg-dark-card2 rounded-2xl p-4 space-y-2">
                  {Object.entries(listing.openingHours).map(([day, hours]) => {
                    const h = hours as { open: boolean; from: string; to: string };
                    return (
                      <div key={day} className="flex items-center justify-between text-sm">
                        <span className="capitalize text-surface-600 dark:text-surface-400 font-medium w-28">{day}</span>
                        {h.open
                          ? <span className="text-surface-800 dark:text-white">{h.from} – {h.to}</span>
                          : <span className="text-red-500">Closed</span>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price range */}
            {listing.priceRange && (
              <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
                <span className="font-medium">Price Range:</span>
                <span className="text-brand-500 font-bold">{getPriceLabel(listing.priceRange)}</span>
              </div>
            )}

            {/* Unclaimed banner */}
            {!listing.claimed && <ClaimBanner listingId={listing.id} listingName={listing.businessName} />}

            <Divider />

            {/* Reviews */}
            <ReviewSection listingId={listing.id} initialReviews={reviews} listingName={listing.businessName} />
          </div>

          {/* ─── Sidebar (Desktop) ──────────────────────────────────── */}
          <div className="hidden lg:block space-y-4">
            <div className="sticky top-24 space-y-4">
              {/* Contact card */}
              <div className="card p-5 space-y-3">
                <h3 className="font-display font-bold text-surface-900 dark:text-white">Contact</h3>

                {listing.whatsapp && (
                  <a
                    href={getWhatsAppLink(listing.whatsapp, whatsappMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl text-sm transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <div>
                      <div>WhatsApp</div>
                      <div className="text-emerald-100 font-normal text-xs">{listing.whatsapp}</div>
                    </div>
                  </a>
                )}

                {listing.phone && (
                  <a
                    href={getPhoneLink(listing.phone)}
                    className="flex items-center gap-3 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold py-3 px-4 rounded-2xl text-sm transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <div>
                      <div>Call</div>
                      <div className="text-brand-400 font-normal text-xs">{listing.phone}</div>
                    </div>
                  </a>
                )}

                {listing.website && (
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-surface-600 dark:text-surface-300 hover:text-brand-500 py-2 px-1 text-sm transition-colors"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{listing.website.replace('https://', '')}</span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>
                )}

                <Divider />

                <div className="flex items-start gap-2 text-sm text-surface-500 dark:text-surface-400">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-500" />
                  <span>{listing.address}, {listing.area}, Jos</span>
                </div>
              </div>

              {/* Map preview placeholder */}
              <div className="card overflow-hidden">
                <div className="h-40 bg-surface-100 dark:bg-dark-card2 flex items-center justify-center">
                  <Link
                    href={`/map?listing=${listing.id}`}
                    className="flex flex-col items-center gap-2 text-surface-400 hover:text-brand-500 transition-colors"
                  >
                    <MapPin className="w-8 h-8" />
                    <span className="text-xs font-medium">View on Map</span>
                  </Link>
                </div>
              </div>

              {/* Share & actions */}
              <div className="card p-4 flex items-center justify-around">
                <button className="flex flex-col items-center gap-1 text-xs text-surface-500 hover:text-brand-500 transition-colors p-2">
                  <Heart className="w-5 h-5" />
                  Save
                </button>
                <button className="flex flex-col items-center gap-1 text-xs text-surface-500 hover:text-brand-500 transition-colors p-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button className="flex flex-col items-center gap-1 text-xs text-surface-500 hover:text-red-500 transition-colors p-2">
                  <Flag className="w-5 h-5" />
                  Report
                </button>
              </div>

              {/* Stats */}
              <div className="card p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-bold text-surface-900 dark:text-white">{formatNumber(listing.viewCount)}</div>
                    <div className="text-xs text-surface-400">Views</div>
                  </div>
                  <div>
                    <div className="font-bold text-surface-900 dark:text-white">{formatNumber(listing.saveCount)}</div>
                    <div className="text-xs text-surface-400">Saves</div>
                  </div>
                  <div>
                    <div className="font-bold text-surface-900 dark:text-white">{listing.reviewCount}</div>
                    <div className="text-xs text-surface-400">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-16 left-0 right-0 lg:hidden p-3 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md border-t border-surface-100 dark:border-dark-border z-40">
        <div className="flex gap-2 max-w-lg mx-auto">
          {listing.whatsapp && (
            <a href={getWhatsAppLink(listing.whatsapp, whatsappMsg)} target="_blank" rel="noopener noreferrer" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-3 rounded-2xl text-sm">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
            </a>
          )}
          {listing.phone && (
            <a href={getPhoneLink(listing.phone)} className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 bg-brand-500 text-white font-bold py-3 rounded-2xl text-sm">
                <Phone className="w-4 h-4" /> Call
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
