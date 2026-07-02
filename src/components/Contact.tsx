'use client';

// 연락 링크 섹션: 포트폴리오 페이지에서 재사용하는 이메일/GitHub/이력서 링크 블록입니다.
export default function Contact() {
  const email = 'changchangdaero@naver.com';

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="section-eyebrow">Contact</p>
        <h2 className="section-title">연결 지점</h2>
        <p className="section-description">
          기록과 작업은 이곳에 남겨둡니다. 필요한 이야기는 메일로 이어가도 좋습니다.
        </p>
      </div>

      <div className="section-card">
        <a className="text-link" href={`mailto:${email}`}>
          {email}
        </a>
      </div>
    </section>
  );
}
