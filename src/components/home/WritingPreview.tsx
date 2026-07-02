// 홈 글쓰기 미리보기 섹션: 비기술 글쓰기 카테고리를 소개하고 "/writing"으로 연결합니다.
import Link from 'next/link';

import { writingPreview } from '@/data/portfolio';
import SectionHeading from './SectionHeading';

export default function WritingPreview() {
  return (
    <section className="content-section">
      <SectionHeading
        eyebrow="Writing"
        title="<문학/글쓰기 섹션 제목>"
        description="<문학 활동과 글쓰기 이력을 소개하는 짧은 설명>"
      />
      <div className="writing-preview-grid">
        {writingPreview.map((item) => (
          <article key={item.title} className="quiet-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      <Link href="/writing" className="text-link">
        Writing으로 이동
      </Link>
    </section>
  );
}
