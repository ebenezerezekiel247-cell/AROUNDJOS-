import type { Metadata } from 'next';
import { Syne, Nunito } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default:  'AroundJos – Discover Everything Around Jos',
    template: '%s | AroundJos',
  },
  description:
    'AroundJos is the #1 local discovery platform for Jos, Plateau State. Find hotels, restaurants, shops, and services near you.',
  keywords:  ['Jos', 'Plateau State', 'Nigeria', 'local business', 'restaurants Jos', 'hotels Jos', 'discovery'],
  authors:   [{ name: 'AroundJos' }],
  creator:   'AroundJos',
  publisher: 'AroundJos',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://aroundjos.com'),
  openGraph: {
    type:        'website',
    locale:      'en_NG',
    url:         'https://aroundjos.com',
    siteName:    'AroundJos',
    title:       'AroundJos – Discover Everything Around Jos',
    description: 'Find hotels, restaurants, shops, and local services in Jos, Plateau State.',
    images: [{
      url:    '/og-image.jpg',
      width:  1200,
      height: 630,
      alt:    'AroundJos – Discover Jos',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'AroundJos – Discover Everything Around Jos',
    description: 'Find hotels, restaurants, shops, and local services in Jos, Plateau State.',
    images:      ['/og-image.jpg'],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon:  '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${nunito.variable} font-body antialiased bg-surface-50 dark:bg-dark-bg text-surface-900 dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <Header />
          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>
          <BottomNav />
          <Toaster
            position="top-center"
            toastOptions={{
              className: 'font-body text-sm',
              style: {
                borderRadius: '16px',
                background:   '#1c1c1c',
                color:        '#fff',
                padding:      '12px 16px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
