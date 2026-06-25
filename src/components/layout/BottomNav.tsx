'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MapPin, Plus, User } from 'lucide-react';
import { cn } from '@/utils';

const NAV_ITEMS = [
  { href: '/',            icon: Home,    label: 'Home' },
  { href: '/search',      icon: Search,  label: 'Explore' },
  { href: '/add-listing', icon: Plus,    label: 'Add',   special: true },
  { href: '/map',         icon: MapPin,  label: 'Map' },
  { href: '/profile',     icon: User,    label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md border-t border-surface-100 dark:border-dark-border safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label, special }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));

          if (special) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-brand -mt-4 active:scale-95 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-surface-500 mt-0.5">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 px-4 py-1"
            >
              <div className={cn(
                'w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-200',
                active ? 'bg-brand-50 dark:bg-brand-900/20' : ''
              )}>
                <Icon className={cn(
                  'w-5 h-5 transition-colors',
                  active ? 'text-brand-500' : 'text-surface-400 dark:text-surface-500'
                )} />
              </div>
              <span className={cn(
                'text-[10px] font-medium transition-colors',
                active ? 'text-brand-500' : 'text-surface-400 dark:text-surface-500'
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
