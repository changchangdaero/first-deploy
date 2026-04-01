'use client';
import { useState } from 'react';
import Image from "next/image";
import { Work } from '@/types/portfolio';

export default function Works({ items }: { items: Work[] }) {
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
          Works & Publications
        </h2>
        <span
          className={`collapsible-chevron text-lg leading-none ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="mt-4 space-y-4">
          {items.map((work, index) => (
            <a
              key={index}
              href={work.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 p-4 rounded-[var(--radius-card)] bg-[var(--portfolio-surface)] border border-[var(--border-default)] shadow-[var(--shadow-sm)] items-center transition-[background,box-shadow,border-color] hover:bg-[var(--portfolio-surface-muted)] hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)]"
            >
              <div className="w-16 h-24 bg-[var(--portfolio-surface-muted)] rounded-lg relative overflow-hidden shrink-0 border border-[var(--border-default)]">
                {work.image && (
                  <Image src={work.image} alt={work.title} fill className="object-cover" sizes="64px" />
                )}
              </div>
              <div className="flex flex-col text-left min-w-0">
                <h3 className="font-semibold text-[var(--text-heading)] text-sm sm:text-base">
                  {work.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                  {work.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
