'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Grid3x3 } from 'lucide-react';
import { cn } from '@/utils';

interface Props {
  images: string[];
  name:   string;
}

export function ListingImageGallery({ images, name }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [current,  setCurrent]  = useState(0);

  const imgs = images.length ? images : ['/placeholder.jpg'];

  const prev = () => setCurrent((c) => (c - 1 + imgs.length) % imgs.length);
  const next = () => setCurrent((c) => (c + 1) % imgs.length);

  const openLightbox = (i: number) => { setLightbox(i); setCurrent(i); };
  const closeLightbox = () => setLightbox(null);

  return (
    <>
      {/* Gallery grid */}
      <div className="container-app">
        <div className={cn(
          'grid gap-2 rounded-3xl overflow-hidden',
          imgs.length === 1 ? 'grid-cols-1' :
          imgs.length === 2 ? 'grid-cols-2' :
          'grid-cols-2'
        )}>
          {/* Main image */}
          <div
            className={cn('relative cursor-pointer group', imgs.length >= 3 ? 'row-span-2' : '')}
            style={{ aspectRatio: imgs.length === 1 ? '16/7' : '4/3' }}
            onClick={() => openLightbox(0)}
          >
            <Image
              src={imgs[0]}
              alt={`${name} - 1`}
              fill
              className="object-cover group-hover:brightness-90 transition-all"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </div>

          {/* Secondary images */}
          {imgs.slice(1, 3).map((img, i) => (
            <div
              key={i}
              className="relative cursor-pointer group aspect-video"
              onClick={() => openLightbox(i + 1)}
            >
              <Image
                src={img}
                alt={`${name} - ${i + 2}`}
                fill
                className="object-cover group-hover:brightness-90 transition-all"
                sizes="(max-width: 768px) 50vw, 30vw"
              />
              {/* Show all photos button on last visible */}
              {i === 1 && imgs.length > 3 && (
                <div
                  className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); openLightbox(2); }}
                >
                  <Grid3x3 className="w-5 h-5 text-white mb-1" />
                  <span className="text-white text-sm font-bold">+{imgs.length - 3} more</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative w-full max-w-4xl aspect-video px-12" onClick={(e) => e.stopPropagation()}>
            <Image
              src={imgs[current]}
              alt={`${name} - ${current + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {imgs.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imgs.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                    className={cn('w-1.5 h-1.5 rounded-full transition-all', i === current ? 'bg-white w-4' : 'bg-white/40')}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
