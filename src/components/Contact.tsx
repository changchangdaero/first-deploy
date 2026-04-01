'use client';

export default function Contact() {
  const email = "changchangdaero@naver.com";

  return (
    <section className="w-full space-y-4">
      <h2 className="section-title">Contact</h2>

      <div className="section-card">
        <p className="text-sm text-[var(--text-muted)] mb-5 leading-relaxed">
          글쓰기/개발 관련 제안 및 문의는 여기로 보내주세요!
        </p>

        <a
          href={`mailto:${email}`}
          className="text-lg font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors break-words underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-[var(--accent)]"
        >
          {email}
        </a>
      </div>
    </section>
  );
}
