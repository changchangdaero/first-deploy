// Engineering About: 사진(없으면 숨김), 한 줄 소개, 이력, 기술 스택 칩, 링크 버튼을 보여줍니다.
import Image from 'next/image';

import LinkPills from '@/components/LinkPills';
import SectionHeader from '@/components/SectionHeader';
import { engineeringProfile as profile } from '@/data/engineering/profile';
import { engineeringSections as sections } from '@/data/engineering/sections';
import { publicFileExists } from '@/lib/public-file';

export default function EngAbout() {
  const hasImage = publicFileExists(profile.image);

  return (
    <section id="about" className="content-section" aria-labelledby="eng-about-title">
      <SectionHeader eyebrow={sections.about.eyebrow} title={sections.about.title} titleId="eng-about-title" />
      <div className={hasImage ? 'about-summary' : 'about-summary about-summary--no-image'}>
        {hasImage ? (
          <div className="about-summary__image">
            <Image src={profile.image} alt={`${profile.name} 프로필 사진`} width={180} height={180} priority />
          </div>
        ) : null}
        <div className="about-summary__content">
          <h1 className="about-summary__name">{profile.name}</h1>
          <p className="about-summary__headline">{profile.headline}</p>
          {profile.summary ? <p className="about-summary__text">{profile.summary}</p> : null}
          <ul className="profile-list">
            {profile.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className="showcase-project-card__stack about-summary__stack" aria-label="기술 스택">
            {profile.stack.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
          <LinkPills items={profile.links} label="Engineering 링크" />
        </div>
      </div>
    </section>
  );
}
