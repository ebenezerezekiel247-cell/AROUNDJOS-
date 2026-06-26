import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { getCategoryBySlug, CATEGORIES } from '@/services/categories';
import { getListingsByCategory } from '@/services/listings';
import { ListingCard, CategoryCard } from '@/components/listings/ListingCard';
import { SectionHeader, EmptyState, Badge, CategoryIcon, RawCategoryIcon } from '@/components/ui';
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
    description: cat.description || `Discover the best ${cat.name} in Jos, Plateau State.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const listings = await getListingsByCategory(slug, 24).catch(() => []);

  return (
    <div className="page-top">
      {/* Header */}
      <div className="py-14" style={{ background: `linear-gradient(135deg, ${category.color}15, ${category.color}05)` }}>
        <div className="container-app">
          <nav className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400 mb-6">
            <Link href="/" className="hover:text-brand-500">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-surface-700 dark:text-white">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <CategoryIcon name={category.icon} color={category.color} size={28} />
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-surface-900 dark:text-white">{category.name}</h1>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
                {category.description} · {listings.length} {listings.length === 1 ? 'business' : 'businesses'} in Jos
              </p>
            </div>
          </div>

          {/* Subcategory pills */}
          {category.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              <Link href={`/category/${category.slug}`}>
                <Badge variant="brand">All</Badge>
              </Link>
              {category.subcategories.map((sub) => (
                <Link key={sub.slug} href={`/category/${category.slug}?sub=${sub.slug}`}>
                  <Badge>{sub.name}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Listings */}
      <div className="container-app section">
        {listings.length === 0 ? (
          <EmptyState
            icon="📂"
            title={`No ${category.name} listed yet`}
            message={`Be the first to add a ${category.name.toLowerCase()} in Jos!`}
            action={
              <Link href="/add-listing">
                <Button>Add a Business</Button>
              </Link>
            }
          />
        ) : (
          <>
            <SectionHeader
              title={`${category.name} in Jos`}
              subtitle={`${listings.length} businesses found`}
              action={
                <Link href={`/search?category=${category.slug}`} className="text-sm text-brand-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Filter <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </>
        )}
      </div>

      {/* Add Business CTA */}
      <div className="container-app pb-10">
        <div className="rounded-2xl p-6 text-center" style={{ background: `${category.color}10`, border: `1px solid ${category.color}30` }}>
          <p className="font-bold text-surface-900 dark:text-white mb-1">Own a {category.name} in Jos?</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">List it free and get discovered by thousands.</p>
          <Link href="/add-listing">
            <Button>Add Your Business — Free</Button>
          </Link>
        </div>
      </div>

      {/* Other categories */}
      <div className="container-app pb-10">
        <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white mb-4">Other Categories</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.filter((c) => c.slug !== slug).slice(0, 6).map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}
