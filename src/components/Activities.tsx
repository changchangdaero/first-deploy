'use client';
import { useState } from 'react';
import { Activity } from '@/types/portfolio';

export default function Activities({ items }: { items: Activity[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="collapsible-trigger"
        aria-expanded={isOpen}
      >
        <h2 className="section-title section-title--inline text-left">
          Activities & Exhibition
        </h2>
        <span
          className={`collapsible-chevron text-lg leading-none ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3 text-left">
          {items.map((act, index) => (
            <div
              key={index}
              className="p-4 rounded-[var(--radius-card)] bg-[var(--portfolio-surface)] border border-[var(--border-default)] shadow-[var(--shadow-sm)] flex flex-col gap-1"
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--accent-muted)] text-[var(--accent)] uppercase tracking-wider">
                  {act.type}
                </span>
                <span className="text-[10px] text-[var(--text-faint)] font-mono shrink-0">
                  {act.date}
                </span>
              </div>
              <h3 className="font-semibold text-[var(--text-heading)] mt-1 text-sm sm:text-base">
                {act.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {act.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
