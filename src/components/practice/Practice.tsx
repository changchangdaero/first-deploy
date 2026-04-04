'use client';

import Link from 'next/link';

export default function Practice() {
  return (
    <section className="w-full">
      <div className="section-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-[var(--border-strong)] transition-[border-color,box-shadow]">
        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="text-lg font-bold text-[var(--text-heading)] tracking-tight">
            Technical Archive
          </h2>
          <p className="text-sm text-[var(--text-muted)]">실습기록</p>
        </div>

        <Link
          href="/archive"
          className="inline-flex items-center justify-center shrink-0 w-12 h-12 rounded-full border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] text-[var(--accent)] shadow-[var(--shadow-sm)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-[background,color,border-color,transform,box-shadow] hover:scale-105 hover:shadow-[var(--shadow-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-ring)]"
          aria-label="실습 기록 archive으로 이동"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 pl-0.5"
          >
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
