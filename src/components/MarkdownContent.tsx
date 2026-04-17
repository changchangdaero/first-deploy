import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import HandwritingBlockFigure from '@/components/handwriting/HandwritingBlockFigure';
import { splitContentWithHandwritingBlocks } from '@/lib/handwriting-blocks';
import { markdownSanitizePlugin } from '@/lib/markdown-sanitize';
import type { HandwritingBlockInput, HandwritingBlockRow } from '@/types/post';

type MarkdownContentProps = {
  content: string;
  className?: string;
  handwritingBlocks?: Array<HandwritingBlockInput | HandwritingBlockRow>;
};

function MarkdownSegment({ content }: { content: string }) {
  if (!content.trim()) {
    return null;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, markdownSanitizePlugin, rehypeHighlight]}
      components={{
        img: ({ src, alt, ...props }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src || ''}
            alt={alt || ''}
            {...props}
            style={{
              width:
                typeof props.width === 'number' || typeof props.width === 'string'
                  ? `${props.width}px`
                  : '100%',
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        ),
        a: ({ href, ...props }) => (
          <a
            href={href}
            {...props}
            target={props.target ?? '_blank'}
            rel={props.rel ?? 'noopener noreferrer'}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function MarkdownContent({
  content,
  className = '',
  handwritingBlocks = [],
}: MarkdownContentProps) {
  const handwritingMap = new Map(handwritingBlocks.map((block) => [block.id, block]));
  const segments = splitContentWithHandwritingBlocks(content);

  return (
    <div className={`markdown-content ${className}`.trim()}>
      {segments.map((segment, index) => {
        if (segment.type === 'markdown') {
          return <MarkdownSegment key={`markdown-${index}`} content={segment.value} />;
        }

        const block = handwritingMap.get(segment.blockId);

        if (!block) {
          return null;
        }

        return <HandwritingBlockFigure key={segment.blockId} block={block} />;
      })}
    </div>
  );
}
