'use client';

export default function Contact() {
  const email = "changchangdaero@naver.com"; 

  return (
    <section className="w-full space-y-4">
      {/* 1. 타이틀 */}
      <h2 className="text-xl font-bold text-green-300">Contact</h2>

      {/* 2. 컨택트 카드 (이전의 심플한 구조) */}
      <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
        <p className="text-sm text-green-200/60 mb-4 italic">
          글쓰기/개발 관련 제안 및 문의는 여기로 보내주세요!
        </p>

        <a 
          href={`mailto:${email}`} 
          className="text-lg font-medium text-green-100 hover:text-green-400 transition-colors underline underline-offset-4 decoration-green-500/30 break-words"
        >
          {email}
        </a>
      </div>
    </section>
  );
}