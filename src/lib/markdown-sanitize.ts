// Markdown 보안 필터: 공개 아카이브 글에서 렌더링 가능한 HTML 태그와 속성을 제한합니다.
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const allowedTags = new Set([...(defaultSchema.tagNames ?? []), 'img', 'span', 'u']);

export const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: Array.from(allowedTags),
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ...((defaultSchema.attributes?.a as Array<string | [string, ...Array<string | RegExp>]>) ?? []),
      'href',
      'title',
      ['target', '_blank', '_self'],
      ['rel', 'noopener', 'noreferrer', 'nofollow'],
    ],
    img: [
      ...((defaultSchema.attributes?.img as Array<string | [string, ...Array<string | RegExp>]>) ?? []),
      'src',
      'alt',
      ['width', /^\d+$/],
    ],
    span: [['className', 'text-red']],
    u: [],
  },
};

export const markdownSanitizePlugin: [typeof rehypeSanitize, typeof markdownSanitizeSchema] = [
  rehypeSanitize,
  markdownSanitizeSchema,
];
