// 글쓰기 페이지: "/writing" 화면에 글쓰기 카테고리와 외부 활동 링크를 보여줍니다.
import Link from 'next/link';

import SectionHeading from '@/components/home/SectionHeading';
import { writingCategories, writingPreview } from '@/data/portfolio';

export default function WritingPage() {
  return (
    <main className="portfolio-page">
      <div className="portfolio-main">
        <header className="page-intro">
          <p className="section-eyebrow">Writing</p>
          <h1>문학과 글쓰기 활동</h1>
          <p>{'<문학/글쓰기 활동 전용 페이지 설명. 개발 Archive와 섞지 않는다는 안내>'}</p>
        </header>

        <section className="content-section">
          <SectionHeading
            eyebrow="Categories"
            title="<Writing 카테고리 섹션 제목>"
            description="<Essay, Poem, Review, Publication, Brunch를 분리해 보여주는 설명>"
          />
          <div className="track-grid">
            {writingCategories.map((category) => (
              <article key={category} className="quiet-card">
                <h3>{category}</h3>
                <p>{'<해당 글쓰기 카테고리 설명>'}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section">
          <SectionHeading
            eyebrow="Preview"
            title="<글쓰기 활동 미리보기 섹션 제목>"
            description="<개인 저서, 브런치스토리, 산문/시/서평 이력을 보여주는 설명>"
          />
          <div className="writing-preview-grid">
            {writingPreview.map((item) => (
              <article key={item.title} className="quiet-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <Link href="/contact" className="text-link">
          Contact
        </Link>
      </div>
    </main>
  );
}
