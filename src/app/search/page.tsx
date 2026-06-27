import { Suspense } from 'react';
import { Spinner } from '@/components/ui';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="page-top min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
