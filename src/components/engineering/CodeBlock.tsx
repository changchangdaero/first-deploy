// 코드 블록: 서버에서 highlight.js로 문법 강조를 적용해 보여줍니다. (브라우저로 추가 스크립트를 보내지 않음)
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import yaml from 'highlight.js/lib/languages/yaml';

import type { ProjectCode } from '@/data/engineering/projects';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('yaml', yaml);

export default function CodeBlock({ code }: { code: ProjectCode }) {
  const highlighted = hljs.highlight(code.source.trim(), { language: code.language }).value;

  return (
    <figure className="project-detail__code">
      {/* 제목은 섹션 제목으로 보여주므로 여기서는 언어만 표시합니다. */}
      <div className="project-detail__code-header">
        <span className="project-detail__code-lang">{code.language}</span>
      </div>
      <pre>
        <code className={`hljs language-${code.language}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
      {code.caption ? <figcaption>{code.caption}</figcaption> : null}
    </figure>
  );
}
