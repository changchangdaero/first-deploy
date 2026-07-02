// 프로필 카드 섹션: 이미지, 이력, 연습, 작업, 활동을 보여주던 예전 프로필 레이아웃입니다.
import Image from 'next/image';

interface ProfileProps {
  name: string;
  github: string;
}

export default function Profile({ name, github }: ProfileProps) {
  const links = [
    { label: 'GitHub', href: github },
    { label: 'Blog', href: 'https://blog.naver.com/changchangdaero' },
    { label: 'Brunch', href: 'https://brunch.co.kr/@changchangdaero' },
  ];

  return (
    <section className="hero-section">
      <Image
        src="/me.jpg"
        alt={`${name} 프로필 사진`}
        width={132}
        height={132}
        className="mb-6 h-[132px] w-[132px] rounded-[var(--radius-card)] border border-[var(--border-default)] object-cover"
        priority
      />
      <p className="section-eyebrow">Changmin.dev</p>
      <h1>{name}</h1>
      <p className="hero-copy">
        개발과 글쓰기 사이에서 문제를 기록하고 해결합니다. 문장을 고치듯 코드를
        다듬고, 기록을 쌓듯 서비스를 만듭니다.
      </p>
      <nav className="hero-links" aria-label="프로필 링크">
        {links.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ))}
      </nav>
    </section>
  );
}
