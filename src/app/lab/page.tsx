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
  ];

  return (
    <div className="portfolio-page font-sans">
      <main className="max-w-2xl mx-auto py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-10"
        >
          ← Back to Main
        </Link>

        <h1 className="text-2xl font-bold text-[var(--text-heading)] tracking-tight mb-8">
          Technical Archive
        </h1>

        <div className="grid grid-cols-1 gap-4">
          {labs.map((lab) => (
            <Link key={lab.id} href={lab.path}>
              <div className="group section-card flex items-center justify-between gap-4 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] transition-[border-color,box-shadow]">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] font-mono text-[var(--text-faint)] tracking-widest">
                    Lab {lab.id}
                  </span>
                  <h2 className="text-lg font-semibold text-[var(--text-heading)] group-hover:text-[var(--accent)] transition-colors">
                    {lab.title}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">{lab.description}</p>
                </div>
                <span className="text-[var(--accent)] shrink-0 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
