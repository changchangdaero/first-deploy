'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="fixed left-4 top-4 z-50 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-heading)] sm:left-6 sm:top-6"
      aria-label="뒤로가기"
    >
      {'<- 뒤로가기'}
    </button>
  );
}
