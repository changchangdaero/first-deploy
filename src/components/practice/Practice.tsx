'use client';

// 연습/기록 안내 섹션: 현재는 방문자를 아카이브로 안내하는 작은 공개 블록입니다.
import Link from 'next/link';

export default function Practice() {
  return (
    <section className="content-section">
      <div className="section-card">
        <p className="section-eyebrow">Archive</p>
        <h2 className="section-title">기술 기록</h2>
        <p className="section-description">
          학습 기록, 트러블슈팅, 배포 메모를 카테고리별로 남깁니다.
        </p>
        <Link href="/archive" className="text-link">
          Archive 보기
        </Link>
      </div>
    </section>
  );
}
