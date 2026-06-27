import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — AroundJos',
  description: 'Terms and conditions for using AroundJos.',
};

const SECTIONS = [
  { title: '1. Acceptance of Terms',
    body: `By accessing or using AroundJos, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.` },
  { title: '2. Description of Service',
    body: `AroundJos is a local business discovery platform for Jos, Plateau State, Nigeria. We allow users to:\n• Browse and search for local businesses\n• Add and manage business listings\n• Leave reviews and ratings\n• Claim business ownership` },
  { title: '3. User Accounts',
    body: `You are responsible for:\n• Maintaining the confidentiality of your account credentials\n• All activity that occurs under your account\n• Providing accurate and complete registration information\n\nYou must be at least 13 years old to create an account.` },
  { title: '4. Business Listings',
    body: `When adding a business listing, you confirm that:\n• You have permission to list the business\n• The information provided is accurate and not misleading\n• You will keep the information up to date\n\nWe reserve the right to remove listings that violate these terms or our content guidelines.` },
  { title: '5. Reviews & Content',
    body: `User-submitted reviews must be:\n• Honest and based on genuine experience\n• Free from hate speech, harassment, or discrimination\n• Not posted by the business owner or their associates\n\nWe may remove reviews that violate these guidelines.` },
  { title: '6. Prohibited Conduct',
    body: `You may not:\n• Post false, misleading, or defamatory content\n• Impersonate another person or business\n• Use the platform for spam or commercial solicitation\n• Attempt to hack, scrape, or overload the platform\n• Post content that infringes on intellectual property rights` },
  { title: '7. Limitation of Liability',
    body: `AroundJos provides the platform "as is" without warranties. We are not liable for:\n• The accuracy of business information provided by users\n• Disputes between users and businesses\n• Any indirect or consequential damages\n\nOur total liability is limited to the amount you paid us in the past 12 months.` },
  { title: '8. Changes to Terms',
    body: `We may update these Terms at any time. Continued use of AroundJos after changes constitutes acceptance. We will notify registered users of significant changes via email.` },
  { title: '9. Governing Law',
    body: `These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Plateau State, Nigeria.` },
  { title: '10. Contact',
    body: `For questions about these Terms:\n• WhatsApp: +234 803 123 4567\n• Email: legal@aroundjos.com` },
];

export default function TermsPage() {
  return (
    <div className="page-top">
      <div className="bg-gradient-to-br from-surface-950 to-surface-900 py-14 text-center px-4">
        <h1 className="font-display font-black text-3xl text-white mb-3">Terms of Service</h1>
        <p className="text-surface-400 text-sm">Last updated: June 2025</p>
      </div>
      <div className="container-app max-w-3xl py-12">
        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display font-bold text-lg text-surface-900 dark:text-white mb-3">{s.title}</h2>
              <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed whitespace-pre-line">{s.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-surface-100 dark:border-dark-border flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="text-brand-500 hover:text-brand-600 font-medium">Privacy Policy →</Link>
          <Link href="/contact" className="text-brand-500 hover:text-brand-600 font-medium">Contact Us →</Link>
          <Link href="/" className="text-brand-500 hover:text-brand-600 font-medium">Back to Home →</Link>
        </div>
      </div>
    </div>
  );
}
