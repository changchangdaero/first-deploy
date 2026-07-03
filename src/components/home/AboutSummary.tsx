// 홈 소개 섹션: 랜딩 화면에 프로필 사진, 한 줄 소개, 요약, 강조 목록을 보여줍니다.
import Image from 'next/image';

import SectionHeader from '@/components/SectionHeader';
import { profile } from '@/data/portfolio';

export default function AboutSummary() {
  return (
    <section id="about" className="content-section">
      <SectionHeader eyebrow="PROFILE" title="About Me" />
      <div className="about-summary">
        <div className="about-summary__image">
          <Image src={profile.image} alt={`${profile.name} 프로필 사진`} width={180} height={180} />
        </div>
        <div className="about-summary__content">
          <p className="about-summary__name">{profile.name}</p>
          <p className="about-summary__headline">{profile.headline}</p>
          {profile.summary ? <p className="about-summary__text">{profile.summary}</p> : null}
          <ul className="profile-list">
            {profile.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
