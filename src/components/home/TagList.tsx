// 태그 목록: 프로젝트, 아카이브 미리보기, 역량 카드에서 쓰는 작은 키워드 칩입니다.
export default function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="tag-list" aria-label="keywords">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
