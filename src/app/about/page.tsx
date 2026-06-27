import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Heart, Star, Building2 } from 'lucide-react';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About AroundJos — Discover Everything Around Jos',
  description: 'AroundJos is the #1 local business discovery platform for Jos, Plateau State, Nigeria.',
};

export default function AboutPage() {
  return (
    <div className="page-top">
      {/* Hero */}
      <div className="bg-gradient-to-br from-surface-950 via-surface-900 to-earth-950 py-20 px-4 text-center">
        <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl font-display mx-auto mb-6">AJ</div>
        <h1 className="font-display font-black text-4xl text-white mb-4">About <span className="text-brand-500">AroundJos</span></h1>
        <p className="text-surface-300 text-base max-w-xl mx-auto">
          The #1 local business discovery platform for Jos, Plateau State, Nigeria. Connecting residents and visitors with the best businesses in the city.
        </p>
      </div>

      {/* Mission */}
      <div className="container-app max-w-3xl py-14">
        <div className="grid sm:grid-cols-2 gap-6 mb-14">
          {[
            { icon: <MapPin className="w-6 h-6" />, color: '#FF7D0A', title: 'Built for Jos', body: 'Every feature is designed specifically for the Jos market — the areas, the culture, the businesses, the people.' },
            { icon: <Heart className="w-6 h-6" />, color: '#EC4899', title: 'Made with Love', body: 'AroundJos was born from a love for Jos and a desire to support local businesses that make this city great.' },
            { icon: <Star className="w-6 h-6" />, color: '#F59E0B', title: 'Community First', body: 'Real reviews from real people in Jos. No fake ratings, no paid placements in search results.' },
            { icon: <Building2 className="w-6 h-6" />, color: '#3B82F6', title: 'Free for Businesses', body: 'Basic listings are completely free. We believe every Jos business deserves to be discoverable online.' },
          ].map((item) => (
            <div key={item.title} className="bg-white dark:bg-dark-card border border-surface-100 dark:border-dark-border rounded-2xl p-6">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${item.color}20`, color: item.color }}>
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-surface-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="mb-14">
          <h2 className="font-display font-black text-2xl text-surface-900 dark:text-white mb-5">Our Story</h2>
          <div className="space-y-4 text-surface-600 dark:text-surface-300 leading-relaxed text-sm">
            <p>Jos is one of Nigeria&apos;s most beautiful cities — known for its cool climate, breathtaking plateau views, and warm, welcoming people. But for years, finding a reliable restaurant, shortlet, or service provider in Jos meant asking around on WhatsApp groups or scrolling through scattered Facebook pages.</p>
            <p>AroundJos was created to change that. We believe Jos deserves a dedicated, well-designed platform where locals and visitors can discover the best the city has to offer — from iconic hotels like Hill Station to the best suya spots on Zaria Road.</p>
            <p>We&apos;re a small team passionate about Jos and committed to building tools that help local businesses thrive in the digital age.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-surface-50 dark:bg-dark-card2 rounded-3xl p-8 mb-14">
          <h2 className="font-display font-bold text-xl text-surface-900 dark:text-white text-center mb-8">AroundJos by the Numbers</h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            {[['500+', 'Businesses'], ['25+', 'Jos Areas'], ['1,000+', 'Monthly Users']].map(([val, label]) => (
              <div key={label}>
                <div className="font-display font-black text-3xl text-brand-500">{val}</div>
                <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="font-display font-bold text-xl text-surface-900 dark:text-white mb-3">Join the AroundJos Community</h2>
          <p className="text-surface-500 text-sm mb-6">Whether you&apos;re a local, a visitor, or a business owner — AroundJos is for you.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/search"><Button>Explore Businesses</Button></Link>
            <Link href="/add-listing"><Button variant="secondary">Add Your Business</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
