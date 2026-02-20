'use client';
import { useState } from 'react';
import { Activity } from '@/types/portfolio';

export default function Activities({ items }: { items: Activity[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full p-4 rounded-xl border border-green-600/50 bg-green-900/30 hover:bg-green-800/40 transition-all"
      >
        <h2 className="text-xl font-semibold text-green-300">Activities & Exhibition</h2>
        <span className={`text-green-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 text-left">
          {items.map((act, index) => (
            <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-green-700/30 text-green-400 uppercase tracking-wider">{act.type}</span>
                <span className="text-[9px] text-green-500/60 font-mono">{act.date}</span>
              </div>
              <h3 className="font-bold text-green-100 mt-1">{act.title}</h3>
              <p className="text-xs text-green-200/70 leading-relaxed">{act.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}