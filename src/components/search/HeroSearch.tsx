'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { JOS_AREAS } from '@/types';
import { cn } from '@/utils';

export function HeroSearch() {
  const [query,    setQuery]    = useState('');
  const [area,     setArea]     = useState('');
  const [areaOpen, setAreaOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q',    query.trim());
    if (area)         params.set('area', area);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-2xl mx-auto animate-slide-up"
    >
      <div className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-dark-card p-2 rounded-3xl shadow-2xl border border-surface-100 dark:border-dark-border">
        {/* Search input */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2">
          <Search className="w-5 h-5 text-surface-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hotels, restaurants, phones..."
            className="flex-1 bg-transparent text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 text-sm focus:outline-none"
          />
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px bg-surface-100 dark:bg-dark-border my-2" />

        {/* Area picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAreaOpen(!areaOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white w-full sm:w-auto"
          >
            <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <span className="flex-1 text-left truncate max-w-[120px]">
              {area || 'Any Area'}
            </span>
            <ChevronDown className={cn('w-4 h-4 transition-transform flex-shrink-0', areaOpen && 'rotate-180')} />
          </button>

          {areaOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAreaOpen(false)} />
              <div className="absolute bottom-full sm:bottom-auto sm:top-full left-0 right-0 sm:right-auto sm:min-w-[200px] mb-2 sm:mb-0 sm:mt-2 bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border shadow-xl z-20 overflow-hidden">
                <div className="max-h-60 overflow-y-auto py-1">
                  <button
                    type="button"
                    onClick={() => { setArea(''); setAreaOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-dark-card2 transition-colors font-medium"
                  >
                    All Areas
                  </button>
                  {JOS_AREAS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setArea(a); setAreaOpen(false); }}
                      className={cn(
                        'w-full text-left px-4 py-2.5 text-sm transition-colors',
                        area === a
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-semibold'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-dark-card2'
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-2xl transition-colors flex-shrink-0 flex items-center justify-center gap-2 text-sm active:scale-95"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>

      {/* Popular searches */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <span className="text-white/50 text-xs">Popular:</span>
        {['Hotels', 'Suya', 'Phone Repair', 'Salons', 'Shortlets'].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => { setQuery(term); }}
            className="text-white/70 hover:text-white text-xs underline underline-offset-2 transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </form>
  );
}
