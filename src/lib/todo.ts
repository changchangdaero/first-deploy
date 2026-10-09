// 작성 필요 표시: 직접 채워야 할 문구 자리를 "[[작성: ...]]" 형태로 화면에 드러냅니다.
// 남은 항목 확인: grep -rn "todo(" src/data
export function todo(hint: string) {
  return `[[작성: ${hint}]]`;
}
