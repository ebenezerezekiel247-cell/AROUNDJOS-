import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — AroundJos',
  description: 'How AroundJos collects, uses, and protects your personal information.',
};

const SECTIONS = [
  { title: '1. Information We Collect',
    body: `When you use AroundJos, we may collect:\n• Account info: name, email, profile photo\n• Business listings you create\n• Reviews you submit\n• Usage data: pages visited, searches, listings viewed\n• Device info: browser type, IP address` },
  { title: '2. How We Use Your Information',
    body: `We use your data to:\n• Run and improve AroundJos\n• Display your listings and reviews to other users\n• Send account notifications (e.g. claim approvals)\n• Analyse usage to improve the service\n• Prevent fraud and abuse` },
  { title: '3. Information Sharing',
    body: `We do not sell your data. We share only with:\n• Other users (public profiles, listings, reviews are visible to all)\n• Service providers: Supabase (database), Cloudinary (images), Vercel (hosting)\n• Law enforcement when required by Nigerian law` },
  { title: '4. Data Security',
    body: `Your data is stored on Supabase with:\n• Encrypted connections (HTTPS/TLS)\n• Row-level security policies\n• Supabase Auth for authentication\n\nNo electronic system is 100% secure, but we follow best practices.` },
  { title: '5. Your Rights',
    body: `You can:\n• Access your personal data\n• Correct inaccurate information\n• Delete your account and data\n• Opt out of non-essential emails\n\nContact us via WhatsApp or email to exercise these rights.` },
  { title: '6. Cookies',
    body: `We use cookies to:\n• Keep you signed in\n• Remember preferences (dark/light mode)\n• Analyse site traffic\n\nYou can disable cookies in browser settings, though some features may break.` },
  { title: '7. Contact',
    body: `For privacy questions:\n• WhatsApp: +234 803 123 4567\n• Email: hello@aroundjos.com\n• Location: Jos, Plateau State, Nigeria` },
];

export default function PrivacyPage() {
  return (
    <div className="page-top">
      <div className="bg-gradient-to-br from-surface-950 to-surface-900 py-14 text-center px-4">
        <h1 className="font-display font-black text-3xl text-white mb-3">Privacy Policy</h1>
        <p className="text-surface-400 text-sm">Last updated: June 2025</p>
      </div>
      <div className="container-app max-w-3xl py-12">
        <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-800/20 rounded-2xl p-5 mb-10 text-sm text-brand-700 dark:text-brand-300">
          <strong>Summary:</strong> We collect only what is needed to run AroundJos. We do not sell your data. Public listings and reviews are visible to everyone. You can delete your account at any time.
        </div>
        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white mb-3">{s.title}</h2>
              <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed whitespace-pre-line">{s.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-surface-100 dark:border-dark-border flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="text-brand-500 hover:text-brand-600 font-medium">Terms of Service →</Link>
          <Link href="/contact" className="text-brand-500 hover:text-brand-600 font-medium">Contact Us →</Link>
          <Link href="/" className="text-brand-500 hover:text-brand-600 font-medium">Back to Home →</Link>
        </div>
      </div>
    </div>
  );
}
