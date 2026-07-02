// 개수 라벨 도우미: 아카이브 카드의 "1 post", "3 posts" 같은 개수 문구를 만듭니다.
export function formatCountLabel(count: number, singular: string, plural?: string) {
  const label = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${label}`;
}
