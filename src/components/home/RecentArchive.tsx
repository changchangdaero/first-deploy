// 홈 최근 아카이브 섹션: 최근 기술 기록 미리보기 카드와 아카이브 이동 링크를 보여줍니다.
import Link from 'next/link';

import { recentTechNotes } from '@/data/portfolio';
import SectionHeading from './SectionHeading';
import TagList from './TagList';

export default function RecentArchive() {
  return (
    <section className="content-section">
      <SectionHeading
        eyebrow="Archive"
        title="<최근 기술 기록 섹션 제목>"
        description="<기술 학습, 트러블슈팅, 실험 메모를 모은다는 설명>"
      />
      <div className="note-list">
        {recentTechNotes.map((note) => (
          <article key={`${note.category}-${note.date}`} className="note-card">
            <div className="note-card__topline">
              <span>{note.category}</span>
              <time>{note.date}</time>
            </div>
            <h3>{note.title}</h3>
            <p>{note.description}</p>
            <TagList tags={note.tags} />
          </article>
        ))}
      </div>
      <Link href="/archive" className="text-link">
        Archive로 이동
      </Link>
    </section>
  );
}
