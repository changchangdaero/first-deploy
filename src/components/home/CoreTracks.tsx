// 홈 핵심 역량 섹션: 포트폴리오를 역량 축과 키워드 태그로 묶어 보여줍니다.
import { coreTracks } from '@/data/portfolio';
import SectionHeading from './SectionHeading';
import TagList from './TagList';

export default function CoreTracks() {
  return (
    <section className="content-section">
      <SectionHeading
        eyebrow="Core Tracks"
        title="<핵심 역량 축을 보여주는 제목>"
        description="<프로젝트 경험을 역량 축으로 묶어 보여주는 설명>"
      />
      <div className="track-grid">
        {coreTracks.map((track) => (
          <article key={track.title} className="quiet-card">
            <h3>{track.title}</h3>
            <p>{track.description}</p>
            <TagList tags={track.items} />
          </article>
        ))}
      </div>
    </section>
  );
}
