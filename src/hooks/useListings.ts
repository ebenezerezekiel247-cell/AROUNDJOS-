'use client';
import { useState, useEffect, useCallback } from 'react';
import { getFeaturedListings, getTrendingListings, getRecentListings, getListingBySlug, getListingsByCategory, searchListings, addFavorite, removeFavorite } from '@/services/listings';
import type { Listing } from '@/services/listings';
import type { SearchFilters } from '@/types';

export function useFeaturedListings(count = 8) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getFeaturedListings(count).then(setListings).finally(() => setLoading(false)); }, [count]);
  return { listings, loading };
}

export function useTrendingListings(count = 8) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getTrendingListings(count).then(setListings).finally(() => setLoading(false)); }, [count]);
  return { listings, loading };
}

export function useRecentListings(count = 8) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getRecentListings(count).then(setListings).finally(() => setLoading(false)); }, [count]);
  return { listings, loading };
}

export function useListingBySlug(slug: string) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (slug) getListingBySlug(slug).then(setListing).finally(() => setLoading(false)); }, [slug]);
  return { listing, loading };
}

export function useListingsByCategory(categorySlug: string, count = 24) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (categorySlug) getListingsByCategory(categorySlug, count).then(setListings).finally(() => setLoading(false)); }, [categorySlug, count]);
  return { listings, loading };
}

export function useSearch() {
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const search = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    try { const data = await searchListings(filters); setResults(data); }
    finally { setLoading(false); }
  }, []);
  return { results, loading, search };
}

export function useFavorite(userId: string | undefined, listingId: string, initial = false) {
  const [isFav, setIsFav] = useState(initial);
  const [loading, setLoading] = useState(false);
  const toggle = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const prev = isFav;
    setIsFav(!prev);
    try { prev ? await removeFavorite(userId, listingId) : await addFavorite(userId, listingId); }
    catch { setIsFav(prev); }
    finally { setLoading(false); }
  }, [userId, listingId, isFav]);
  return { isFav, toggle, loading };
}
