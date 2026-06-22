import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ChevronRight } from 'lucide-react';
import { getListingsByArea } from '@/services/listings';
import { JOS_AREAS } from '@/types';
import { ListingCard } from '@/components/listings/ListingCard';
import { EmptyState, Button } from '@/components/ui';

interface Props { params: Promise<{ slug: string }> }

function slugToArea(slug: string): string {
  return JOS_AREAS.find(
    (a) => a.toLowerCase().replace(/\s+/g, '-') === slug
  ) || '';
}

export async function generateStaticParams() {
  return JOS_AREAS.map((a) => ({ slug: a.toLowerCase().replace(/\s+/g, '-') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = slugToArea(slug);
  if (!area) return { title: 'Area Not Found' };
  return {
    title:       `Businesses in ${area}, Jos — AroundJos`,
    description: `Discover hotels, restaurants, shops and services in ${area}, Jos, Plateau State.`,
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = slugToArea(slug);
  if (!area) notFound();

  const listings = await getListingsByArea(area, 24).catch(() => []);

  return (
    <div className="page-top">
      {/* Header */}
      <div className="bg-gradient-to-br from-plateau-900 via-plateau-800 to-plateau-700 py-14">
        <div className="container-app">
          <nav className="flex items-center gap-1 text-xs text-white/50 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{area}</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white">{area}</h1>
              <p className="text-white/60 text-sm mt-1">Jos, Plateau State · {listings.length} businesses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="container-app section">
        {listings.length === 0 ? (
          <EmptyState icon="📍" title={`Nothing in ${area} yet`} message="Be the first to add a business here!"
            action={<Link href="/add-listing"><Button>Add a Business</Button></Link>} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>

      {/* Other areas */}
      <div className="container-app pb-10">
        <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white mb-4">Other Areas in Jos</h2>
        <div className="flex flex-wrap gap-2">
          {JOS_AREAS.filter((a) => a !== area && a !== 'Other').map((a) => (
            <Link key={a} href={`/area/${a.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center gap-1.5 bg-white dark:bg-dark-card border border-surface-100 dark:border-dark-border px-3 py-1.5 rounded-full text-sm text-surface-600 dark:text-surface-300 hover:border-brand-400 hover:text-brand-500 transition-colors">
              <MapPin className="w-3 h-3" />{a}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
