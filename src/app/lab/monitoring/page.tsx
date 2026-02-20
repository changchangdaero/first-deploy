'use client';

import Link from 'next/link';

/**
 * 01. 모니터링 시스템 구축 실습 상세
 * 구성 중심의 레이아웃으로 변경되었습니다.
 */
export default function MonitoringDetail() {
  // 세 가지 화면 구성
  const labContents = [
    {
      title: "Docker 환경 구축",
      src: "/container1.png",
      desc: "Docker Compose를 활용해 모니터링과 부하 테스트에 필요한 컨테이너 환경을 구축했습니다."
    },
    {
      title: "부하 테스트 (nGrinder)",
      src: "/ngrinder.png",
      desc: "가상 사용자(Vusers) 20명을 동시에 접속시켜 서버가 얼마나 잘 버티는지 테스트하는 nGrinder 화면입니다."
    },
    {
      title: "Metrics 시각화 (Grafana)",
      src: "/Grapana.png",
      desc: "부하 테스트를 하는 동안 서버가 어떤 상태인지 실시간 그래프로 한눈에 보여주는 대시보드입니다. 금번 실습은 대시보드 구축까지의 과정에 좀 더 비중을 두었고, 다음 번엔 Vusers를 차차 늘려가며 병목 구간을 찾고, 최적화해보는 과정을 실습할 예정입니다."
    }
  ];

  return (
    <div className="min-h-screen bg-[#062016] text-green-50 p-8">
      <main className="max-w-2xl mx-auto py-10">
        <Link href="/lab" className="text-green-500 hover:text-green-300 transition-colors text-sm flex items-center gap-2 mb-10">
          ← Back to Index
        </Link>

        <header className="mb-16">
          <span className="text-xs font-mono text-green-500 tracking-tighter uppercase">Lab Record #01</span>
          <h1 className="text-3xl font-bold text-green-100 mt-2 italic">모니터링 시스템 구축 실습</h1>
          <p className="mt-4 text-sm text-green-200/60 leading-relaxed">
            로컬 환경에서 Docker를 기반으로 모니터링 시스템을 구축하고, <br />
            ngrinder 부하 테스트를 통해 데이터 수집(Prometheus)부터 시각화(Grafana)까지의 과정을 실습했습니다.
          </p>
        </header>

        <div className="space-y-20">
          {labContents.map((content, i) => (
            <section key={i} className="space-y-6">
              {/* 각 화면의 제목 */}
              <div className="flex items-center gap-3">
                <span className="text-green-500 font-mono text-sm">0{i + 1}.</span>
                <h2 className="text-xl font-semibold text-green-100">{content.title}</h2>
              </div>

              {/* 스크린샷 이미지 박스 */}
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20 shadow-2xl">
                <img 
                  src={content.src} 
                  alt={content.title} 
                  className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity duration-500" 
                />
              </div>

              {/* 하단 설명글 */}
              <p className="text-sm text-green-200/70 leading-relaxed pl-4 border-l-2 border-green-800/40">
                {content.desc}
              </p>
            </section>
          ))}
        </div>

        {/* 상세 페이지 하단부에 위치 */}
        <section className="mt-20 p-6 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm text-yellow-200/60 italic leading-relaxed">
            * Vusers 생각없이 계속 늘리다가 노트북 터질 뻔했습니다. CPU에 무리갈 수도 있으니 적당히 테스트해보세요!
            </p>
                </section>

        {/* 하단 여백을 위한 푸터 */}
        <footer className="mt-20 pt-10 border-t border-green-900/30 text-center">
          <p className="text-[10px] text-green-800/40 italic">
            Observed and Logged by Changmin
          </p>
        </footer>
      </main>
    </div>
  );
}