// 상세 페이지 문장 렌더러: `백틱`으로 감싼 부분은 코드 글꼴로, "[확인 필요]"로 시작하는 문장은 노란색으로 강조합니다.
const CONFIRM_PREFIX = '[확인 필요]';

function renderInlineCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 1 ? (
      <code key={index} className="project-detail__inline-code">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

export function isConfirmText(text: string) {
  return text.trim().startsWith(CONFIRM_PREFIX);
}

export default function RichText({ text }: { text: string }) {
  if (isConfirmText(text)) {
    return <mark className="project-detail__confirm">{renderInlineCode(text)}</mark>;
  }

  return <>{renderInlineCode(text)}</>;
}
