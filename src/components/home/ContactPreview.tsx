// 홈 연락 미리보기: 랜딩 화면에 짧게 배치되는 연락 링크 섹션입니다.
import { profile } from '@/data/portfolio';
import SectionHeading from './SectionHeading';

export default function ContactPreview() {
  return (
    <section id="contact" className="content-section">
      <SectionHeading
        eyebrow="Contact"
        title="<연락 섹션 제목>"
        description="<연락 및 협업 가능성을 짧게 안내하는 문장>"
      />
      <div className="contact-actions">
        <a className="text-link" href={`mailto:${profile.email}`}>
          Email
        </a>
        <a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a className="text-link" href={profile.resumeHref}>
          Resume
        </a>
      </div>
    </section>
  );
}
