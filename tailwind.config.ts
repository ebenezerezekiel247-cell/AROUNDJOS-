import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors - Plateau warmth
        brand: {
          50:  '#fff8ed',
          100: '#ffefd3',
          200: '#ffdba5',
          300: '#ffc06d',
          400: '#ff9b32',
          500: '#ff7d0a', // Primary orange-amber
          600: '#f05e06',
          700: '#c74507',
          800: '#9e3610',
          900: '#7f2e13',
          950: '#451408',
        },
        // Earth tones for local feel
        earth: {
          50:  '#fdf6f0',
          100: '#faeadb',
          200: '#f4d2b5',
          300: '#ecb385',
          400: '#e28c50',
          500: '#da6f2f', // Jos plateau earth
          600: '#cc5a22',
          700: '#a9451d',
          800: '#88391e',
          900: '#6e301b',
          950: '#3b170c',
        },
        // Plateau Green
        plateau: {
          50:  '#eefbf1',
          100: '#d7f5df',
          200: '#b2e9c2',
          300: '#7fd69d',
          400: '#47bc74',
          500: '#23a155', // Jos plateau green
          600: '#168044',
          700: '#136639',
          800: '#13512f',
          900: '#114328',
          950: '#062515',
        },
        // Dark theme surfaces
        surface: {
          50:  '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#818181',
          700: '#6a6a6a',
          800: '#5a5a5a',
          900: '#3d3d3d',
          950: '#1a1a1a',
        },
        dark: {
          bg:      '#0a0a0a',
          card:    '#141414',
          card2:   '#1c1c1c',
          border:  '#2a2a2a',
          border2: '#333333',
          muted:   '#6b6b6b',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card':       '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.16)',
        'brand':      '0 4px 20px rgba(255,125,10,0.35)',
        'dark-card':  '0 2px 12px rgba(0,0,0,0.4)',
        'glow':       '0 0 40px rgba(255,125,10,0.2)',
      },
      animation: {
        'fade-in':        'fadeIn 0.5s ease-out',
        'slide-up':       'slideUp 0.4s ease-out',
        'slide-down':     'slideDown 0.4s ease-out',
        'scale-in':       'scaleIn 0.3s ease-out',
        'shimmer':        'shimmer 1.5s infinite',
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle':  'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern':     "url('/patterns/hero-pattern.svg')",
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'safe-top':    'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left':   'env(safe-area-inset-left)',
        'safe-right':  'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
};

export default config;
