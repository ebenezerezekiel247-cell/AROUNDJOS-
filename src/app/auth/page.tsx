import { Suspense } from 'react';
import { Spinner } from '@/components/ui';
import AuthContent from './AuthContent';

// Wrap in Suspense so useSearchParams() inside AuthContent works during static generation
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
