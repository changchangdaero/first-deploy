// 연락 페이지: "/contact" 화면에 이메일, GitHub, 이력서 링크를 보여줍니다.
import { profile } from '@/data/portfolio';

export default function ContactPage() {
  return (
    <main className="portfolio-page">
      <div className="portfolio-main">
        <header className="page-intro">
          <p className="section-eyebrow">Contact</p>
          <h1>Contact</h1>
          <p>{'<연락 및 협업 가능성을 짧게 안내하는 문장>'}</p>
        </header>

        <section className="content-section">
          <div className="contact-actions contact-actions--stacked">
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
      </div>
    </main>
  );
}
