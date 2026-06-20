import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

// ─── Class Names ──────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function toDate(ts: Timestamp | Date | undefined): Date | undefined {
  if (!ts) return undefined;
  if (ts instanceof Date) return ts;
  if ('toDate' in ts) return ts.toDate();
  return undefined;
}

export function timeAgo(ts: Timestamp | Date | undefined): string {
  const date = toDate(ts);
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatDate(ts: Timestamp | Date | undefined, fmt = 'MMM d, yyyy'): string {
  const date = toDate(ts);
  if (!date) return '';
  return format(date, fmt);
}

// ─── Rating Helpers ───────────────────────────────────────────────────────────

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-emerald-500';
  if (rating >= 4.0) return 'text-green-500';
  if (rating >= 3.5) return 'text-yellow-500';
  if (rating >= 3.0) return 'text-orange-500';
  return 'text-red-500';
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  if (rating >= 3.0) return 'Fair';
  return 'Poor';
}

// ─── Number Formatters ────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

// ─── Price Range ──────────────────────────────────────────────────────────────

export function getPriceLabel(range?: string): string {
  const map: Record<string, string> = {
    budget:  '₦ Budget-friendly',
    mid:     '₦₦ Mid-range',
    premium: '₦₦₦ Premium',
    luxury:  '₦₦₦₦ Luxury',
  };
  return range ? (map[range] || range) : '';
}

export function getPriceSymbol(range?: string): string {
  const map: Record<string, string> = {
    budget:  '₦',
    mid:     '₦₦',
    premium: '₦₦₦',
    luxury:  '₦₦₦₦',
  };
  return range ? (map[range] || '') : '';
}

// ─── WhatsApp Link ────────────────────────────────────────────────────────────

export function getWhatsAppLink(number: string, message?: string): string {
  const clean = number.replace(/\D/g, '').replace(/^0/, '234');
  const msg   = encodeURIComponent(message || 'Hello, I found your business on AroundJos!');
  return `https://wa.me/${clean}?text=${msg}`;
}

export function getPhoneLink(number: string): string {
  return `tel:${number}`;
}

// ─── Share ────────────────────────────────────────────────────────────────────

export async function shareListing(name: string, slug: string): Promise<void> {
  const url = `${window.location.origin}/listing/${slug}`;
  if (navigator.share) {
    await navigator.share({ title: name, url });
  } else {
    await navigator.clipboard.writeText(url);
  }
}

// ─── Image Placeholder ────────────────────────────────────────────────────────

export function getPlaceholderImage(categorySlug: string): string {
  const placeholders: Record<string, string> = {
    'hotels-lodges':        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    'restaurants-food':     'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600',
    'lounges-nightlife':    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600',
    'shortlets-apartments': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
    'phones-gadgets':       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
    'fashion-clothing':     'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
    'beauty-wellness':      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600',
    'health-medical':       'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600',
    'automotive':           'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600',
    'events-tourism':       'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
    'local-services':       'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
  };
  return placeholders[categorySlug] || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600';
}

// ─── Truncate ─────────────────────────────────────────────────────────────────

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return `${str.slice(0, len)}…`;
}

// ─── Opening Hours ────────────────────────────────────────────────────────────

export function isOpenNow(hours?: Partial<Record<string, { open: boolean; from: string; to: string }>>): boolean | null {
  if (!hours) return null;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now  = new Date();
  const day  = days[now.getDay()];
  const todayHours = hours[day];

  if (!todayHours || !todayHours.open) return false;

  const [fromH, fromM] = todayHours.from.split(':').map(Number);
  const [toH,   toM]   = todayHours.to.split(':').map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  const from    = fromH * 60 + fromM;
  const to      = toH   * 60 + toM;

  return current >= from && current <= to;
}
