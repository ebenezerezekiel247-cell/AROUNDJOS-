import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/services/categories';
import { JOS_AREAS } from '@/types';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://aroundjos.vercel.app';

export async function GET() {
  const staticRoutes = ['', '/search', '/map', '/add-listing', '/advertise', '/about', '/contact', '/privacy', '/terms'];
  const categoryRoutes = CATEGORIES.map(c => `/category/${c.slug}`);
  const areaRoutes = JOS_AREAS.filter(a => a !== 'Other').map(a => `/area/${a.toLowerCase().replace(/\s+/g, '-')}`);

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...areaRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${BASE}${route}</loc>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
