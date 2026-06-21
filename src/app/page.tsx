import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getFeaturedListings, getTrendingListings, getRecentListings } from '@/services/listings';
import { FEATURED_CATEGORIES } from '@/services/categories';
import { SEED_AREAS } from '@/data/seed';
import { ListingCard, CategoryCard } from '@/components/listings/ListingCard';
import { CardSkeleton, SectionHeader } from '@/components/ui';
import { HeroSearch } from '@/components/search/HeroSearch';
import { AreaCard, SponsoredBanner } from '@/components/listings/AreaCard';

export const metadata: Metadata = {
  title: 'AroundJos – Discover Everything Around Jos',
  description: 'Find hotels, restaurants, shops, lounges, and local services in Jos, Plateau State Nigeria.',
};

export const revalidate = 300;

async function FeaturedSection() {
  const listings = await getFeaturedListings(8).catch(() => []);
  if (!listings.length) return null;
  return (
    <section className="section container-app">
      <SectionHeader
        title="Featured Places"
        subtitle="Handpicked top spots in Jos"
        action={
          <Link href="/search?featured=true" className="text-sm text-brand-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
    </section>
  );
}

async function TrendingSection() {
  const listings = await getTrendingListings(6).catch(() => []);
  if (!listings.length) return null;
  return (
    <section className="section container-app">
      <SectionHeader
        title="Trending Now"
        subtitle="Most visited places this week"
        action={
          <Link href="/search?sort=trending" className="text-sm text-brand-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
    </section>
  );
}

async function RecentSection() {
  const listings = await getRecentListings(8).catch(() => []);
  if (!listings.length) return null;
  return (
    <section className="section container-app">
      <SectionHeader
        title="Recently Added"
        subtitle="New businesses just listed on AroundJos"
        action={
          <Link href="/search?sort=recent" className="text-sm text-brand-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="page-top">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-earth-950 dark:from-dark-bg dark:via-dark-card dark:to-earth-950" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-earth-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 container-app text-center w-full">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-full px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in">
            📍 Jos, Plateau State, Nigeria
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-tight tracking-tight mb-4 animate-slide-up">
            Discover Everything
            <br />
            <span className="text-brand-500">Around Jos</span>
          </h1>

          <p className="text-surface-300 text-base sm:text-lg max-w-xl mx-auto mb-10 animate-slide-up">
            Find hotels, restaurants, shops, lounges, and services in Jos, Plateau State — all in one place.
          </p>

          <HeroSearch />

          <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-in">
            {FEATURED_CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors backdrop-blur-sm"
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-50 dark:from-dark-bg to-transparent" />
      </section>

      <div className="bg-white dark:bg-dark-card border-y border-surface-100 dark:border-dark-border">
        <div className="container-app">
          <div className="grid grid-cols-3 divide-x divide-surface-100 dark:divide-dark-border py-5">
            {[
              { value: '500+', label: 'Businesses' },
              { value: '25+', label: 'Areas in Jos' },
              { value: '1K+', label: 'Reviews' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-0.5 px-4">
                <span className="font-display font-black text-2xl text-brand-500">{value}</span>
                <span className="text-xs text-surface-500 dark:text-surface-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <section className="section">
          <SectionHeader
            title="Browse by Category"
            subtitle="What are you looking for?"
            action={
              <Link href="/search" className="text-sm text-brand-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                All <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-6 gap-3">
            {FEATURED_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        <div className="mb-8">
          <SponsoredBanner />
        </div>
      </div>

      <Suspense fallback={
        <section className="section container-app">
          <SectionHeader title="Featured Places" subtitle="Loading..." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </section>
      }>
        <FeaturedSection />
      </Suspense>

      <section className="section bg-surface-100 dark:bg-dark-card">
        <div className="container-app">
          <SectionHeader
            title="Explore by Area"
            subtitle="Discover businesses in your neighbourhood"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SEED_AREAS.slice(0, 8).map((area) => (
              <AreaCard key={area.name} name={area.name} count={area.count} image={area.image} />
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={
        <section className="section container-app">
          <SectionHeader title="Trending Now" subtitle="Loading..." />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </section>
      }>
        <TrendingSection />
      </Suspense>

      <section className="section container-app">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-earth-600 p-8 sm:p-12 text-center">
          <div className="relative z-10">
            <div className="text-4xl mb-4">🏢</div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-3">
              Own a Business in Jos?
            </h2>
            <p className="text-white/80 text-base max-w-md mx-auto mb-6">
              List your business on AroundJos and reach thousands of locals and visitors looking for services like yours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/add-listing"
                className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-6 py-3 rounded-2xl hover:bg-brand-50 transition-colors shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                Add Your Business — Free
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-2xl border border-white/20 transition-colors"
              >
                Sign In First
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={
        <section className="section container-app">
          <SectionHeader title="Recently Added" subtitle="Loading..." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </section>
      }>
        <RecentSection />
      </Suspense>

      <footer className="bg-surface-900 dark:bg-dark-card border-t border-surface-800 dark:border-dark-border">
        <div className="container-app py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-white font-black text-sm">AJ</div>
                <span className="font-display font-black text-white text-lg">AroundJos</span>
              </div>
              <p className="text-surface-400 text-sm leading-relaxed">
                Discover everything around Jos, Plateau State, Nigeria.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-3">Discover</h4>
              <ul className="space-y-2">
                {['Hotels', 'Restaurants', 'Lounges', 'Phones & Gadgets', 'Fashion'].map((item) => (
                  <li key={item}><Link href={`/search?q=${item}`} className="text-surface-400 hover:text-white text-sm transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-3">Company</h4>
              <ul className="space-y-2">
                {[
                  { label: 'About Us',      href: '/about' },
                  { label: 'Add Business',  href: '/add-listing' },
                  { label: 'Advertise',     href: '/advertise' },
                  { label: 'Contact',       href: '/contact' },
                ].map(({ label, href }) => (
                  <li key={label}><Link href={href} className="text-surface-400 hover:text-white text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-3">Areas in Jos</h4>
              <ul className="space-y-2">
                {['GRA', 'Terminus', 'Rayfield', 'Bukuru', 'Farin Gada'].map((area) => (
                  <li key={area}><Link href={`/area/${area.toLowerCase().replace(/\s+/g, '-')}`} className="text-surface-400 hover:text-white text-sm transition-colors">{area}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-surface-500 text-sm">© 2025 AroundJos. Made with ❤️ for Jos.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-surface-500 hover:text-white text-sm transition-colors">Privacy</Link>
              <Link href="/terms" className="text-surface-500 hover:text-white text-sm transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
