import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Contact Us — AroundJos',
  description: 'Get in touch with the AroundJos team.',
};

export default function ContactPage() {
  return (
    <div className="page-top">
      <div className="bg-gradient-to-br from-surface-950 to-surface-900 py-14 text-center px-4">
        <h1 className="font-display font-black text-3xl text-white mb-3">Contact Us</h1>
        <p className="text-surface-400 text-sm">We&apos;d love to hear from you</p>
      </div>

      <div className="container-app max-w-2xl py-12">
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {[
            { icon: <MessageCircle className="w-5 h-5" />, color: '#16a34a', title: 'WhatsApp', body: '+234 803 123 4567', sub: 'Fastest response', href: 'https://wa.me/2348031234567?text=Hi AroundJos team!' },
            { icon: <Mail className="w-5 h-5" />, color: '#3B82F6', title: 'Email', body: 'hello@aroundjos.com', sub: 'We reply within 24hrs', href: 'mailto:hello@aroundjos.com' },
            { icon: <MapPin className="w-5 h-5" />, color: '#FF7D0A', title: 'Location', body: 'Jos, Plateau State', sub: 'Nigeria', href: null },
            { icon: <Clock className="w-5 h-5" />, color: '#8B5CF6', title: 'Hours', body: 'Mon – Fri: 9am – 6pm', sub: 'WAT (West Africa Time)', href: null },
          ].map((item) => (
            <div key={item.title} className="bg-white dark:bg-dark-card border border-surface-100 dark:border-dark-border rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}20`, color: item.color }}>
                {item.icon}
              </div>
              <h3 className="font-bold text-surface-900 dark:text-white text-sm mb-1">{item.title}</h3>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-500 font-medium hover:text-brand-600">{item.body}</a>
              ) : (
                <p className="text-sm text-surface-600 dark:text-surface-300">{item.body}</p>
              )}
              <p className="text-xs text-surface-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick topics */}
        <div className="bg-surface-50 dark:bg-dark-card2 rounded-3xl p-7 mb-10">
          <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white mb-5">What can we help with?</h2>
          <div className="space-y-3">
            {[
              { q: 'Adding or editing a listing', href: '/add-listing' },
              { q: 'Claiming your business', href: '/search' },
              { q: 'Advertising on AroundJos', href: '/advertise' },
              { q: 'Reporting incorrect information', href: null },
              { q: 'Technical issues or bugs', href: null },
            ].map((item) => (
              <div key={item.q} className="flex items-center justify-between py-2.5 border-b border-surface-100 dark:border-dark-border last:border-0">
                <span className="text-sm text-surface-700 dark:text-surface-300">{item.q}</span>
                {item.href ? (
                  <Link href={item.href} className="text-xs text-brand-500 font-semibold hover:text-brand-600">Go →</Link>
                ) : (
                  <a href="https://wa.me/2348031234567" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-500 font-semibold hover:text-brand-600">WhatsApp →</a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a href="https://wa.me/2348031234567?text=Hi AroundJos team, I need help with..." target="_blank" rel="noopener noreferrer">
            <Button size="lg">
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
