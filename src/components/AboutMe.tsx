// 프로필 이력 섹션: 예전 프로필/소개 레이아웃에서 쓰는 짧은 자기소개 목록입니다.
export default function AboutMe() {
  const items = [
    '명지대학교 AI응용시스템학과 정보통신과 인공지능ICT융합전공',
    'Spring Boot, Next.js, Supabase 기반의 작은 서비스를 직접 만들고 배포합니다.',
    '문학과 개발을 함께 기록하며, 글과 코드의 구조를 함께 다듬습니다.',
  ];

  return (
    <section className="content-section profile-section">
      <div className="section-heading">
        <p className="section-eyebrow">Profile</p>
        <h2 className="section-title">짧은 이력</h2>
      </div>
      <ul className="profile-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
