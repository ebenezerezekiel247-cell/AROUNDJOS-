'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, X, MapPin, Star } from 'lucide-react';
import { getListings } from '@/services/listings';
import type { Listing } from '@/services/listings';
import Link from 'next/link';
import { CATEGORIES } from '@/services/categories';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const JOS_CENTER: [number, number] = [8.8921, 9.9085];

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map          = useRef<mapboxgl.Map | null>(null);
  const markers      = useRef<mapboxgl.Marker[]>([]);

  const [listings,  setListings]  = useState<Listing[]>([]);
  const [selected,  setSelected]  = useState<Listing | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('');
  const [category,  setCategory]  = useState('');

  useEffect(() => {
    getListings({ status: 'active', limit: 100 })
      .then(({ listings }) => setListings(listings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:     'mapbox://styles/mapbox/streets-v12',
      center:    JOS_CENTER,
      zoom:      12,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(
      new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }),
      'top-right'
    );
    return () => { map.current?.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    const filtered = listings.filter((l) => {
      if (!l.lat || !l.lng) return false;
      if (category && l.categorySlug !== category) return false;
      if (filter && !l.businessName.toLowerCase().includes(filter.toLowerCase())) return false;
      return true;
    });

    filtered.forEach((listing) => {
      const cat = CATEGORIES.find((c) => c.slug === listing.categorySlug);
      const el  = document.createElement('div');
      el.className = 'cursor-pointer';
      el.innerHTML = `
        <div style="width:36px;height:36px;border-radius:50%;background:${cat?.color || '#FF7D0A'};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>`;

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([listing.lng!, listing.lat!])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelected(listing);
        map.current?.flyTo({ center: [listing.lng!, listing.lat!], zoom: 15, duration: 800 });
      });

      markers.current.push(marker);
    });
  }, [listings, filter, category]);

  return (
    <div className="page-top h-screen flex flex-col">
      <div className="bg-white dark:bg-dark-card border-b border-surface-100 dark:border-dark-border px-4 py-3 flex items-center gap-2 flex-shrink-0 z-10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input value={filter} onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name…"
            className="w-full pl-9 pr-3 py-2 bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl px-3 py-2 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">All</option>
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="relative flex-1">
        <div ref={mapContainer} className="w-full h-full" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-dark-bg/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-card rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-surface-700 dark:text-white">Loading businesses…</span>
            </div>
          </div>
        )}

        {selected && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-surface-100 dark:border-dark-border overflow-hidden animate-slide-up">
            <div className="relative">
              {selected.coverImage && (
                <img src={selected.coverImage} alt={selected.businessName} className="w-full h-32 object-cover" />
              )}
              <button onClick={() => setSelected(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-surface-900 dark:text-white mb-1">{selected.businessName}</h3>
              <p className="text-xs text-surface-500 flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3" /> {selected.area}
              </p>
              {selected.ratingAverage > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-surface-700 dark:text-surface-300">{selected.ratingAverage.toFixed(1)}</span>
                  <span className="text-xs text-surface-400">({selected.reviewCount})</span>
                </div>
              )}
              <Link href={`/listing/${selected.slug}`}
                className="block w-full text-center bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                View Details →
              </Link>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-surface-100 dark:border-dark-border text-xs font-medium text-surface-600 dark:text-surface-300">
          {listings.filter((l) => l.lat && l.lng && (!category || l.categorySlug === category)).length} on map
        </div>
      </div>
    </div>
  );
}
