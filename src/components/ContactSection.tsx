// 연락 섹션: Engineering / Literature 페이지 맨 아래에서 이메일 주소를 보여줍니다. 누르면 메일 앱이 열립니다.
import SectionHeader from '@/components/SectionHeader';
import { links } from '@/data/links';

export default function ContactSection() {
  return (
    <section id="contact" className="content-section contact-section" aria-labelledby="contact-title">
      <SectionHeader eyebrow="CONTACT" title="Email" titleId="contact-title" />

      <div className="contact-card">
        <a className="contact-card__email" href={`mailto:${links.email}`} aria-label="이메일 보내기">
          {links.email}
        </a>
      </div>
    </section>
  );
}
