'use client';

export default function Contact() {
  const email = "changchangdaero@naver.com"; 

  return (
    <section className="w-full space-y-6">
      {/* 1. 박스 밖의 타이틀 */}
      <h2 className="text-xl font-bold text-green-300">Contact</h2>

      {/* 2. 컨택트 카드 */}
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-[#0A2A1E] flex flex-col gap-6 shadow-lg border border-white/5">
        
        {/* 안내 문구 (이탤릭) */}
        <p className="text-sm text-green-200/70 italic leading-relaxed break-keep">
          글쓰기/개발 관련 제안 및 문의는 여기로 보내주세요!
        </p>

        {/* 3. 핵심 수정 부분: 이메일 레이아웃 */}
        <a 
          href={`mailto:${email}`} 
          className="group flex items-start gap-3 w-full transition-colors"
        >
          {/* 편지 아이콘 (고정 크기 유지) */}
          <div className="mt-1.5 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-400 group-hover:text-green-300">
              <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
              <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
            </svg>
          </div>

          {/* 이메일 텍스트 (줄바꿈 처리) */}
          <span className="text-lg font-medium text-green-50 hover:text-green-300 underline underline-offset-8 decoration-green-500/30 break-all leading-snug">
            {email}
          </span>
        </a>
      </div>
    </section>
  );
}