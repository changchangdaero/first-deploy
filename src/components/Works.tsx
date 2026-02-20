'use client';
import { useState } from 'react';
import Image from "next/image";
import { Work } from '@/types/portfolio';

export default function Works({ items }: { items: Work[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className="w-full">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full p-4 rounded-xl border border-green-600/50 bg-green-900/30 hover:bg-green-800/40 transition-all">
        <h2 className="text-xl font-semibold text-green-300">Works & Publications</h2>
        <span className={`text-green-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          {items.map((work, index) => (
            <a key={index} href={work.url || "#"} target="_blank" className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 items-center hover:bg-white/10 transition-all">
              <div className="w-16 h-24 bg-gray-800 rounded relative overflow-hidden">
                {work.image && <Image src={work.image} alt={work.title} fill className="object-cover" />}
              </div>
              <div className="flex flex-col text-left">
                <h3 className="font-bold text-green-100 text-sm">{work.title}</h3>
                <p className="text-[11px] text-green-200/70 mt-1">{work.description}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}