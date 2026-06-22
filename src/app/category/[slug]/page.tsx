import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { getCategoryBySlug, CATEGORIES } from '@/services/categories';
import { getListingsByCategory } from '@/services/listings';
import { ListingCard } from '@/components/listings/ListingCard';
import { SectionHeader, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: 'Category Not Found' };
  return {
    title:       `${cat.name} in Jos — AroundJos`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const listings = await getListingsByCategory(slug, 24).catch(() => []);

  return (
    <div className="page-top">
      {/* ─── Header ───────────────────────────────────────────────── */}
      <div
        className="relative py-14 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${category.color}22 0%, ${category.color}08 100%)` }}
      >
        <div className="container-app">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400 mb-6">
            <Link href="/" className="hover:text-brand-500">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-surface-700 dark:text-white">{category.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0"
              style={{ backgroundColor: `${category.color}25` }}
            >
              {category.icon}
            </div>
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-surface-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{category.description}</p>
              <p className="text-xs text-surface-400 mt-1">{listings.length} listings in Jos</p>
            </div>
          </div>

          {/* Subcategory chips */}
          {category.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              <Link
                href={`/category/${category.slug}`}
                className="bg-white dark:bg-dark-card border-2 border-brand-500 text-brand-500 text-xs font-bold px-4 py-1.5 rounded-full"
              >
                All
              </Link>
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/category/${category.slug}?sub=${sub.slug}`}
                  className="bg-white dark:bg-dark-card border border-surface-200 dark:border-dark-border text-surface-600 dark:text-surface-300 hover:border-brand-400 hover:text-brand-500 text-xs font-medium px-4 py-1.5 rounded-full transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Listings ─────────────────────────────────────────────── */}
      <div className="container-app section">
        {listings.length === 0 ? (
          <EmptyState
            icon={category.icon}
            title={`No ${category.name} yet`}
            message="Be the first to add a business in this category!"
            action={
              <Link href="/add-listing">
                <Button>Add a Business</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Showing {listings.length} {category.name.toLowerCase()} in Jos
              </p>
              <Link href={`/search?category=${category.slug}`} className="text-sm text-brand-500 font-semibold flex items-center gap-1">
                Filter & Sort <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </>
        )}
      </div>

      {/* ─── Other Categories ─────────────────────────────────────── */}
      <div className="container-app pb-10">
        <SectionHeader title="Other Categories" />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== slug).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex items-center gap-2 bg-white dark:bg-dark-card border border-surface-100 dark:border-dark-border px-4 py-2 rounded-2xl text-sm text-surface-700 dark:text-surface-300 hover:border-brand-300 hover:text-brand-500 transition-colors"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
