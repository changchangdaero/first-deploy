import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { markdownSanitizePlugin } from '@/lib/markdown-sanitize';

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export default function MarkdownContent({
  content,
  className = '',
}: MarkdownContentProps) {
  return (
    <div className={`markdown-content ${className}`.trim()}>
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
    </div>
  );
}
