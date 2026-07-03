// 연락 섹션: 메인 페이지 하단에서 간단한 안내 문구와 이메일 링크를 보여줍니다.
import SectionHeader from '@/components/SectionHeader';

const contactEmail = 'changchangdaero@naver.com';

export default function Contact() {
  return (
    <section id="contact" className="content-section contact-section" aria-labelledby="contact-title">
      <SectionHeader eyebrow="CONTACT" title="Email" titleId="contact-title" />

      <div className="contact-card">
        <p className="contact-card__description">
          글쓰기/개발 관련 제안 및 문의는 여기로 보내주세요!
        </p>
        <a
          className="contact-card__email"
          href={`mailto:${contactEmail}`}
          aria-label="이메일 보내기"
        >
          {contactEmail}
        </a>
      </div>
    </section>
  );
}
