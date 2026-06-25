'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Search, Menu, X, Sun, Moon, LogIn,
  ChevronDown, User, LogOut, LayoutDashboard, ShieldCheck
} from 'lucide-react';
import { signOut } from '@/lib/supabase/auth';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, Button } from '@/components/ui';
import { cn } from '@/utils';

export function Header() {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');

  const { theme, setTheme } = useTheme();
  const { user, profile, isAdmin, isOwner, isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const displayName = profile?.display_name || user?.email || 'User';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md border-b border-surface-100 dark:border-dark-border shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-display">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-white font-black text-sm">
                AJ
              </div>
              <span className="text-lg font-black tracking-tight text-surface-900 dark:text-white">
                Around<span className="text-brand-500">Jos</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: '/',            label: 'Home' },
                { href: '/search',      label: 'Explore' },
                { href: '/map',         label: 'Map' },
                { href: '/add-listing', label: 'Add Business' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                    pathname === href
                      ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                      : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-dark-card'
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-dark-card transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-dark-card transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-card transition-colors"
                  >
                    <Avatar
                      src={profile?.photo_url || undefined}
                      name={displayName}
                      size="sm"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-surface-500 hidden md:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-dark-card rounded-2xl border border-surface-100 dark:border-dark-border shadow-xl py-2 animate-scale-in z-50">
                      <div className="px-4 py-2 border-b border-surface-100 dark:border-dark-border">
                        <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                      </div>
                      {isOwner && (
                        <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-dark-card2 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                      )}
                      {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-dark-card2 transition-colors">
                          <ShieldCheck className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-dark-card2 transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth">
                  <Button size="sm" variant="primary">
                    <LogIn className="w-4 h-4" /> Sign In
                  </Button>
                </Link>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-dark-card"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-surface-100 dark:border-dark-border bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md px-4 sm:px-6 py-3 animate-slide-down">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search businesses, restaurants, hotels..."
                  className="w-full pl-10 pr-4 py-3 bg-surface-50 dark:bg-dark-card border border-surface-200 dark:border-dark-border rounded-2xl text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </form>
          </div>
        )}

        {menuOpen && (
          <div className="md:hidden border-t border-surface-100 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-4 space-y-1 animate-slide-down">
            {[
              { href: '/',            label: 'Home' },
              { href: '/search',      label: 'Explore' },
              { href: '/map',         label: 'Map' },
              { href: '/add-listing', label: 'Add Business' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                    : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-dark-card'
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {(userMenuOpen || menuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}
        />
      )}
    </>
  );
}
