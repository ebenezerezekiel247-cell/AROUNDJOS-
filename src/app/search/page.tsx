'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { searchListings } from '@/services/listings';
import type { Listing } from '@/services/listings';
import { CATEGORIES } from '@/services/categories';
import { JOS_AREAS } from '@/types';
import type { SearchFilters } from '@/types';
import { ListingCard } from '@/components/listings/ListingCard';
import { CardSkeleton, EmptyState, Badge, Button } from '@/components/ui';
import { cn } from '@/utils';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [results,       setResults]       = useState<Listing[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [filtersOpen,   setFiltersOpen]   = useState(false);
  const [query,         setQuery]         = useState(searchParams.get('q') || '');
  const [category,      setCategory]      = useState(searchParams.get('category') || '');
  const [area,          setArea]          = useState(searchParams.get('area') || '');
  const [minRating,     setMinRating]     = useState<number>(0);
  const [verifiedOnly,  setVerifiedOnly]  = useState(false);

  const doSearch = useCallback(async () => {
    setLoading(true);
    const filters: SearchFilters = {
      query:    query || undefined,
      category: category || undefined,
      area:     area || undefined,
      rating:   minRating || undefined,
      verified: verifiedOnly || undefined,
    };
    try {
      const data = await searchListings(filters);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, area, minRating, verifiedOnly]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  const updateURL = () => {
    const params = new URLSearchParams();
    if (query)    params.set('q', query);
    if (category) params.set('category', category);
    if (area)     params.set('area', area);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
    doSearch();
  };

  const clearFilters = () => {
    setCategory('');
    setArea('');
    setMinRating(0);
    setVerifiedOnly(false);
  };

  const activeFilterCount = [category, area, minRating > 0, verifiedOnly].filter(Boolean).length;

  return (
    <div className="page-top">
      <div className="container-app py-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search businesses in Jos..."
                className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-dark-card border border-surface-200 dark:border-dark-border rounded-2xl text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-colors shadow-sm',
                filtersOpen || activeFilterCount > 0
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white dark:bg-dark-card text-surface-700 dark:text-surface-300 border-surface-200 dark:border-dark-border'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-brand-500 rounded-full text-[10px] font-black flex items-center justify-center shadow">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </form>

        {filtersOpen && (
          <div className="mb-6 p-5 bg-white dark:bg-dark-card rounded-3xl border border-surface-100 dark:border-dark-border shadow-card animate-slide-down space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-surface-900 dark:text-white">Filters</h3>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium">
                    Clear all
                  </button>
                )}
                <button onClick={() => setFiltersOpen(false)} className="text-surface-400 hover:text-surface-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl px-3 py-2.5 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wider">Area</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl px-3 py-2.5 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">All Areas</option>
                  {JOS_AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wider">Min Rating</label>
                <div className="flex gap-1">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setMinRating(r)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-xs font-semibold transition-colors',
                        minRating === r
                          ? 'bg-brand-500 text-white'
                          : 'bg-surface-100 dark:bg-dark-card2 text-surface-600 dark:text-surface-400 hover:bg-surface-200'
                      )}
                    >
                      {r === 0 ? 'Any' : `${r}★`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={cn(
                  'relative w-10 h-5.5 rounded-full transition-colors',
                  verifiedOnly ? 'bg-brand-500' : 'bg-surface-200 dark:bg-dark-border'
                )}
              >
                <div className={cn(
                  'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                  verifiedOnly ? 'translate-x-5' : 'translate-x-0.5'
                )} />
              </div>
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Verified businesses only</span>
            </label>

            <Button onClick={() => { doSearch(); setFiltersOpen(false); }} fullWidth>
              Apply Filters
            </Button>
          </div>
        )}

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {category && (
              <Badge variant="brand">
                {CATEGORIES.find((c) => c.slug === category)?.name}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setCategory('')} />
              </Badge>
            )}
            {area && (
              <Badge variant="brand">
                <MapPin className="w-3 h-3" /> {area}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setArea('')} />
              </Badge>
            )}
            {minRating > 0 && (
              <Badge variant="brand">
                {minRating}★+
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setMinRating(0)} />
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {loading ? 'Searching…' : `${results.length} result${results.length !== 1 ? 's' : ''}${query ? ` for "${query}"` : ''}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No results found"
            message={query ? `We couldn't find anything for "${query}" in Jos. Try a different search.` : 'Try searching for a business name, category, or area.'}
            action={
              activeFilterCount > 0 ? (
                <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}
