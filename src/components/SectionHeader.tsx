// 공통 섹션 헤더: 공개 페이지 섹션에서 재사용하는 작은 라벨, 제목, 설명 블록입니다.
type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  titleId?: string;
};

export default function SectionHeader({ eyebrow, title, description, titleId }: SectionHeaderProps) {
  return (
    <div className="section-heading">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={titleId} className="section-title">
        {title}
      </h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}
