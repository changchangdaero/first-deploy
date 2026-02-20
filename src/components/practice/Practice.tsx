'use client';

import Link from 'next/link';

export default function Practice() {
  return (
    <section className="w-full">
      <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-green-500/30 transition-all group">
        
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-green-300 italic">Technical Archive</h2>
          <p className="text-sm text-green-200/60">실습기록</p>
        </div>

        <Link 
          href="/lab" 
          className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500 transition-all text-green-500 hover:text-[#062016] shadow-lg"
        >
          {/* ml-1 대신 pl-0.5로 미세 조정! 또는 translate-x-[1px] 추천 */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-6 h-6 pl-0.5 transition-transform group-hover:scale-110"
          >
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        </Link>

      </div>
    </section>
  );
}