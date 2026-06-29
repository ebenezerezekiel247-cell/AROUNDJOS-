'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, X, MapPin, Star, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { getListings } from '@/services/listings';
import type { Listing } from '@/services/listings';
import Link from 'next/link';
import { CATEGORIES } from '@/services/categories';
import { cn } from '@/utils';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const JOS_CENTER: [number, number] = [8.8921, 9.9085];
const JOS_ZOOM = 12;

// Calculate distance between two coordinates in km
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m away`;
  return `${km.toFixed(1)}km away`;
}

export default function MapPage() {
  const mapContainer  = useRef<HTMLDivElement>(null);
  const map           = useRef<mapboxgl.Map | null>(null);
  const markers       = useRef<mapboxgl.Marker[]>([]);
  const userMarker    = useRef<mapboxgl.Marker | null>(null);
  const geoControl    = useRef<mapboxgl.GeolocateControl | null>(null);

  const [listings,      setListings]      = useState<Listing[]>([]);
  const [selected,      setSelected]      = useState<Listing | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [filter,        setFilter]        = useState('');
  const [category,      setCategory]      = useState('');
  const [userLocation,  setUserLocation]  = useState<{ lat: number; lng: number } | null>(null);
  const [locating,      setLocating]      = useState(false);
  const [locError,      setLocError]      = useState('');
  const [nearbyMode,    setNearbyMode]    = useState(false);

  // Load listings
  useEffect(() => {
    getListings({ status: 'active', limit: 100 })
      .then(({ listings }) => setListings(listings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Init map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:     'mapbox://styles/mapbox/streets-v12',
      center:    JOS_CENTER,
      zoom:      JOS_ZOOM,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Built-in geolocate control (hidden — we use our custom button instead)
    const geo = new mapboxgl.GeolocateControl({
      positionOptions:    { enableHighAccuracy: true },
      trackUserLocation:  true,
      showUserHeading:    true,
      showAccuracyCircle: true,
    });
    geoControl.current = geo;
    map.current.addControl(geo, 'top-right');

    // Listen to geolocate events
    geo.on('geolocate', (e: any) => {
      const { latitude: lat, longitude: lng } = e.coords;
      setUserLocation({ lat, lng });
      setLocating(false);
      setLocError('');
      addUserMarker(lat, lng);
    });

    geo.on('error', () => {
      setLocating(false);
      setLocError('Location access denied. Enable it in your browser settings.');
    });

    return () => { map.current?.remove(); map.current = null; };
  }, []);

  // Add / update the pulsing user location dot
  const addUserMarker = useCallback((lat: number, lng: number) => {
    if (!map.current) return;

    // Remove old marker
    userMarker.current?.remove();

    // Create pulsing dot element
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="position:relative;width:22px;height:22px;">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:rgba(59,130,246,0.3);
          animation:pulse-ring 1.5s ease-out infinite;
        "></div>
        <div style="
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:14px;height:14px;border-radius:50%;
          background:#3B82F6;border:2.5px solid white;
          box-shadow:0 2px 6px rgba(59,130,246,0.6);
        "></div>
      </div>`;

    // Inject keyframe if not already there
    if (!document.getElementById('pulse-style')) {
      const style = document.createElement('style');
      style.id = 'pulse-style';
      style.textContent = `
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }`;
      document.head.appendChild(style);
    }

    userMarker.current = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 20, closeButton: false })
          .setHTML('<div style="font-size:12px;font-weight:600;padding:4px 2px;">📍 You are here</div>')
      )
      .addTo(map.current);
  }, []);

  // "Find Me" button handler
  const handleFindMe = useCallback(() => {
    setLocating(true);
    setLocError('');

    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by your browser');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        setLocating(false);
        setLocError('');
        addUserMarker(lat, lng);

        map.current?.flyTo({
          center:   [lng, lat],
          zoom:     14,
          duration: 1200,
          essential: true,
        });
      },
      (err) => {
        setLocating(false);
        setLocError(
          err.code === 1
            ? 'Location access denied. Check your browser permissions.'
            : 'Could not get your location. Try again.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, [addUserMarker]);

  // Re-centre on user if already located
  const reCentre = useCallback(() => {
    if (!userLocation || !map.current) return;
    map.current.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 14, duration: 800 });
  }, [userLocation]);

  // Place listing markers
  useEffect(() => {
    if (!map.current) return;
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    let filtered = listings.filter((l) => {
      if (!l.lat || !l.lng) return false;
      if (category && l.categorySlug !== category) return false;
      if (filter && !l.businessName.toLowerCase().includes(filter.toLowerCase())) return false;
      return true;
    });

    // Nearby mode: sort by distance and show only closest 20
    if (nearbyMode && userLocation) {
      filtered = filtered
        .map(l => ({ ...l, _dist: distanceKm(userLocation.lat, userLocation.lng, l.lat!, l.lng!) }))
        .sort((a: any, b: any) => a._dist - b._dist)
        .slice(0, 20);
    }

    filtered.forEach((listing) => {
      const cat = CATEGORIES.find((c) => c.slug === listing.categorySlug);
      const el  = document.createElement('div');
      el.style.cursor = 'pointer';
      el.innerHTML = `
        <div style="
          width:36px;height:36px;border-radius:50%;
          background:${cat?.color || '#FF7D0A'};
          border:2.5px solid white;
          box-shadow:0 2px 10px rgba(0,0,0,.25);
          display:flex;align-items:center;justify-content:center;
          transition:transform 0.15s;
        " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>`;

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([listing.lng!, listing.lat!])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelected(listing);
        map.current?.flyTo({ center: [listing.lng!, listing.lat!], zoom: 15, duration: 700 });
      });

      markers.current.push(marker);
    });
  }, [listings, filter, category, nearbyMode, userLocation]);

  const visibleCount = listings.filter(l =>
    l.lat && l.lng && (!category || l.categorySlug === category)
  ).length;

  const selectedDistance = selected && userLocation && selected.lat && selected.lng
    ? distanceKm(userLocation.lat, userLocation.lng, selected.lat, selected.lng)
    : null;

  return (
    <div className="page-top h-screen flex flex-col">

      {/* Toolbar */}
      <div className="bg-white dark:bg-dark-card border-b border-surface-100 dark:border-dark-border px-4 py-3 flex items-center gap-2 flex-shrink-0">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search businesses…"
            className="w-full pl-9 pr-3 py-2 bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="bg-surface-50 dark:bg-dark-card2 border border-surface-200 dark:border-dark-border rounded-xl px-3 py-2 text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 flex-shrink-0"
        >
          <option value="">All</option>
          {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {/* Map area */}
      <div className="relative flex-1">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-dark-bg/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-card rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-surface-700 dark:text-white">Loading businesses…</span>
            </div>
          </div>
        )}

        {/* ── FIND ME button ───────────────────────────────────────────── */}
        <div className="absolute bottom-6 left-4 flex flex-col gap-2">
          <button
            onClick={userLocation ? reCentre : handleFindMe}
            disabled={locating}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg border transition-all',
              userLocation
                ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                : 'bg-white dark:bg-dark-card text-surface-700 dark:text-white border-surface-100 dark:border-dark-border hover:border-blue-400'
            )}
          >
            {locating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Locating…</>
              : userLocation
                ? <><Navigation className="w-4 h-4 fill-white" /> My Location</>
                : <><Navigation className="w-4 h-4" /> Find Me</>
            }
          </button>

          {/* Nearby mode toggle — only available after locating */}
          {userLocation && (
            <button
              onClick={() => setNearbyMode(n => !n)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg border transition-all',
                nearbyMode
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white dark:bg-dark-card text-surface-700 dark:text-white border-surface-100 dark:border-dark-border hover:border-brand-400'
              )}
            >
              <MapPin className="w-4 h-4" />
              {nearbyMode ? 'Showing Nearby' : 'Show Nearby'}
            </button>
          )}
        </div>

        {/* Location error toast */}
        {locError && (
          <div className="absolute top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-80 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl p-3 flex items-start gap-2 shadow-lg">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-red-700 dark:text-red-300">Location Error</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{locError}</p>
            </div>
            <button onClick={() => setLocError('')} className="text-red-400 hover:text-red-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Stats pill */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-surface-100 dark:border-dark-border text-xs font-medium text-surface-600 dark:text-surface-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          {nearbyMode ? `${Math.min(20, visibleCount)} nearby` : `${visibleCount} on map`}
          {userLocation && <span className="text-blue-500">· 📍 Located</span>}
        </div>

        {/* Selected listing card */}
        {selected && (
          <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-80 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-surface-100 dark:border-dark-border overflow-hidden animate-slide-up">
            <div className="relative">
              {selected.coverImage && (
                <img src={selected.coverImage} alt={selected.businessName} className="w-full h-32 object-cover" />
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Distance badge */}
              {selectedDistance !== null && (
                <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  {formatDistance(selectedDistance)}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-surface-900 dark:text-white mb-1">{selected.businessName}</h3>
              <p className="text-xs text-surface-500 flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3" /> {selected.area}, Jos
              </p>
              {selected.ratingAverage > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-surface-700 dark:text-surface-300">{selected.ratingAverage.toFixed(1)}</span>
                  <span className="text-xs text-surface-400">({selected.reviewCount} reviews)</span>
                </div>
              )}
              <div className="flex gap-2">
                <Link
                  href={`/listing/${selected.slug}`}
                  className="flex-1 block text-center bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  View Details →
                </Link>
                {selected.whatsapp && (
                  <a
                    href={`https://wa.me/${selected.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
                  >
                    💬
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
