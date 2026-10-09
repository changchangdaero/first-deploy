// 출간물 섹션: 책 표지 카드로 저서와 참여 작품을 보여주고 교보문고 페이지로 연결합니다.
import Image from 'next/image';

import SectionHeader from '@/components/SectionHeader';
import { literatureSections as sections } from '@/data/literature/sections';
import { works, type Work } from '@/data/literature/works';

function WorkCard({ work }: { work: Work }) {
  return (
    <a
      href={work.href}
      className="publication-card"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${work.title} 외부 링크 열기`}
    >
      <span className="publication-card__cover-wrap">
        <Image
          src={work.image}
          alt={`${work.title} 책 표지`}
          width={104}
          height={150}
          className="publication-card__cover"
        />
      </span>

      <span className="publication-card__body">
        <span className="publication-card__title">{work.title}</span>
        <span className="publication-card__description">{work.description}</span>
        <span className="publication-card__footer">
          <span className="publication-card__label">{work.label}</span>
          <span className="publication-card__arrow" aria-hidden="true">
            →
          </span>
        </span>
      </span>
    </a>
  );
}

export default function Works() {
  return (
    <section id="works" className="content-section works-publications-section" aria-labelledby="works-title">
      <SectionHeader eyebrow={sections.works.eyebrow} title={sections.works.title} titleId="works-title" />
      <div className="publication-grid">
        {works.map((work) => (
          <WorkCard key={work.title} work={work} />
        ))}
      </div>
    </section>
  );
}
