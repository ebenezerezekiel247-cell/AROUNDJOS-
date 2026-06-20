'use client';

import React from 'react';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?:    'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?:    React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size    = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary:   'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500 shadow-brand',
    secondary: 'bg-surface-100 hover:bg-surface-200 text-surface-900 dark:bg-dark-card dark:hover:bg-dark-card2 dark:text-white focus:ring-surface-300',
    ghost:     'bg-transparent hover:bg-surface-100 text-surface-700 dark:hover:bg-dark-card dark:text-surface-300 focus:ring-surface-300',
    danger:    'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    outline:   'border-2 border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 focus:ring-brand-500',
  };

  const sizes = {
    xs: 'text-xs px-3 py-1.5',
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  children:  React.ReactNode;
  variant?:  'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
  size?:     'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-surface-100 text-surface-700 dark:bg-dark-card2 dark:text-surface-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    brand:   'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 font-medium rounded-full', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

interface StarRatingProps {
  rating:    number;
  max?:      number;
  size?:     'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({ rating, max = 5, size = 'md', interactive, onChange, className }: StarRatingProps) {
  const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const half   = !filled && i + 0.5 < rating;
        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            className={cn(
              sizes[size],
              interactive && 'cursor-pointer hover:scale-110 transition-transform',
              !interactive && 'pointer-events-none'
            )}
            onClick={() => interactive && onChange?.(i + 1)}
          >
            <svg viewBox="0 0 24 24" className={cn('w-full h-full', filled ? 'text-amber-400' : half ? 'text-amber-400' : 'text-surface-300 dark:text-dark-border')}>
              {filled || half ? (
                <path
                  fill="currentColor"
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              ) : (
                <path
                  fill="currentColor"
                  d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
                />
              )}
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
  rounded?:   string;
}

export function Skeleton({ className, rounded = 'rounded-xl' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-surface-200 via-surface-100 to-surface-200',
        'dark:from-dark-card dark:via-dark-card2 dark:to-dark-card',
        'bg-[length:200%_100%]',
        rounded,
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-surface-100 dark:border-dark-border">
      <Skeleton className="h-48 w-full" rounded="rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider({ className }: { className?: string }) {
  return <div className={cn('border-t border-surface-100 dark:border-dark-border', className)} />;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon:     React.ReactNode;
  title:    string;
  message:  string;
  action?:  React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{title}</h3>
      <p className="text-surface-500 dark:text-surface-400 max-w-xs">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title:    string;
  subtitle?: string;
  action?:  React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-6', className)}>
      <div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white font-display">{title}</h2>
        {subtitle && <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────

export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <Loader2 className={cn('animate-spin text-brand-500', sizes[size], className)} />;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  src?:  string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };
  const initials = name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover bg-surface-200', sizes[size], className)}
      />
    );
  }

  return (
    <div className={cn('rounded-full bg-brand-500 text-white flex items-center justify-center font-bold', sizes[size], className)}>
      {initials}
    </div>
  );
}

// ─── Verified Badge ───────────────────────────────────────────────────────────

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400', className)}>
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Verified
    </span>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:     string;
  error?:     string;
  icon?:      React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Input({ label, error, icon, iconRight, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-surface-50 dark:bg-dark-card border border-surface-200 dark:border-dark-border',
            'rounded-2xl px-4 py-3 text-surface-900 dark:text-white',
            'placeholder:text-surface-400 dark:placeholder:text-surface-600',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'transition-all duration-200',
            icon && 'pl-10',
            iconRight && 'pr-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full bg-surface-50 dark:bg-dark-card border border-surface-200 dark:border-dark-border',
          'rounded-2xl px-4 py-3 text-surface-900 dark:text-white resize-none',
          'placeholder:text-surface-400 dark:placeholder:text-surface-600',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          'transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string;
  error?:   string;
  options:  { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full bg-surface-50 dark:bg-dark-card border border-surface-200 dark:border-dark-border',
          'rounded-2xl px-4 py-3 text-surface-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          'transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
