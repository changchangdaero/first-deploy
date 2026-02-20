'use client';

import Link from 'next/link';

/**
 * 실습 목록(Index) 페이지
 * 진행한 모든 실습 항목을 폴더 형태로 나열합니다.
 */
export default function LabIndex() {
  const labs = [
    {
      id: "01",
      title: "모니터링 시스템 구축 실습",
      description: "nGrinder, Prometheus, Grafana를 활용한 부하 테스트 및 모니터링 구축",
      path: "/lab/monitoring"
    }
    // 나중에 02, 03번 실습을 여기에 추가하면 돼!
  ];

  return (
    <div className="min-h-screen bg-[#062016] text-green-50 p-8">
      <main className="max-w-2xl mx-auto py-10">
        <Link href="/" className="text-green-500 hover:text-green-300 transition-colors text-sm flex items-center gap-2 mb-10">
          ← Back to Main
        </Link>

        <h1 className="text-2xl font-bold text-green-300 mb-8 italic italic">Technical Archive</h1>
        
        <div className="grid grid-cols-1 gap-4">
          {labs.map((lab) => (
            <Link key={lab.id} href={lab.path}>
              <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-all flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-green-500/50 tracking-widest">Lab {lab.id}</span>
                  <h2 className="text-lg font-bold text-green-100 group-hover:text-green-400 transition-colors">{lab.title}</h2>
                  <p className="text-sm text-green-200/60">{lab.description}</p>
                </div>
                <span className="text-green-500 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}