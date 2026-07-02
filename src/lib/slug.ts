// slug 도우미: 제목을 URL에 안전한 카테고리, 하위 카테고리, 글 slug로 바꿉니다.
export function createSlugCandidate(value: string, fallback = 'item') {
  const normalized = value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || fallback;
}
