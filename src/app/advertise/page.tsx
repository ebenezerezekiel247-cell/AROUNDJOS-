import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Star, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Advertise on AroundJos — Reach Jos Locals',
  description: 'Promote your business to thousands of residents and visitors in Jos, Plateau State.',
};

const PLANS = [
  {
    name:  'Basic',
    price: '₦5,000',
    period: '/month',
    icon:  <Star className="w-5 h-5" />,
    color: '#6B7280',
    features: ['Standard listing', 'WhatsApp & call button', 'Appear in search', 'Up to 5 photos'],
    cta:   'Get Started',
  },
  {
    name:  'Featured',
    price: '₦15,000',
    period: '/month',
    icon:  <Zap className="w-5 h-5" />,
    color: '#FF7D0A',
    popular: true,
    features: ['Everything in Basic', 'Featured badge', 'Homepage placement', 'Up to 15 photos', 'Priority in search'],
    cta:   'Get Featured',
  },
  {
    name:  'Sponsored',
    price: '₦35,000',
    period: '/month',
    icon:  <Crown className="w-5 h-5" />,
    color: '#8B5CF6',
    features: ['Everything in Featured', 'Sponsored banner ad', 'Top of category page', 'Unlimited photos', 'Analytics dashboard', 'Verified badge'],
    cta:   'Go Sponsored',
  },
];

export default function AdvertisePage() {
  return (
    <div className="page-top">
      {/* Hero */}
      <div className="bg-gradient-to-br from-surface-950 via-surface-900 to-earth-950 py-16 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          📣 Reach Jos Residents
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
          Grow Your Business<br />with <span className="text-brand-500">AroundJos</span>
        </h1>
        <p className="text-surface-300 text-base max-w-lg mx-auto mb-8">
          Put your business in front of thousands of people in Jos searching for exactly what you offer.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-white/70">
          {['500+ Businesses', '1,000+ Monthly Visitors', 'Jos-Focused', 'Affordable Plans'].map((s) => (
            <span key={s} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <CheckCircle className="w-3.5 h-3.5 text-brand-400" /> {s}
            </span>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="container-app section">
        <h2 className="font-display font-black text-2xl text-surface-900 dark:text-white text-center mb-2">Choose Your Plan</h2>
        <p className="text-surface-500 text-center mb-10">All plans include a free listing. Upgrade anytime.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative bg-white dark:bg-dark-card rounded-3xl border-2 p-6 ${plan.popular ? 'border-brand-500 shadow-xl' : 'border-surface-100 dark:border-dark-border'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${plan.color}20`, color: plan.color }}>
                {plan.icon}
              </div>
              <h3 className="font-display font-black text-xl text-surface-900 dark:text-white mb-1">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-5">
                <span className="text-3xl font-black text-surface-900 dark:text-white">{plan.price}</span>
                <span className="text-surface-400 text-sm mb-1">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} /> {f}
                  </li>
                ))}
              </ul>
              <a href={`https://wa.me/2348031234567?text=I'm interested in the ${plan.name} plan on AroundJos`} target="_blank" rel="noopener noreferrer">
                <Button fullWidth variant={plan.popular ? 'primary' : 'secondary'}>{plan.cta}</Button>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="container-app pb-16">
        <div className="max-w-xl mx-auto bg-surface-50 dark:bg-dark-card2 rounded-3xl p-8 text-center border border-surface-100 dark:border-dark-border">
          <h2 className="font-display font-bold text-xl text-surface-900 dark:text-white mb-2">Questions? Let's Talk</h2>
          <p className="text-surface-500 text-sm mb-6">Contact us on WhatsApp and we'll help you pick the right plan.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/2348031234567?text=Hi, I want to advertise on AroundJos" target="_blank" rel="noopener noreferrer">
              <Button>💬 Chat on WhatsApp</Button>
            </a>
            <Link href="/add-listing">
              <Button variant="secondary">Add Free Listing First</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
