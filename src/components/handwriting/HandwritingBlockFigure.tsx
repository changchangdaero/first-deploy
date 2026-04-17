'use client';

import { useEffect, useRef } from 'react';
import { drawHandwritingStrokes, HANDWRITING_BACKGROUND } from '@/lib/handwriting-render';
import type { HandwritingBlockRow } from '@/types/post';

type HandwritingBlockFigureProps = {
  block: Pick<HandwritingBlockRow, 'id' | 'strokes' | 'preview_image_url' | 'width' | 'height'>;
  className?: string;
};

export default function HandwritingBlockFigure({
  block,
  className = '',
}: HandwritingBlockFigureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (block.preview_image_url) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.width = block.width;
    canvas.height = block.height;
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    drawHandwritingStrokes(context, block.strokes, block.width, block.height);
  }, [block]);

  return (
    <figure
      className={`my-6 overflow-hidden rounded-2xl border border-[var(--border-default)] bg-white ${className}`.trim()}
    >
      {block.preview_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.preview_image_url}
          alt={`손글씨 블록 ${block.id}`}
          className="h-auto w-full bg-white"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="block w-full h-auto"
          style={{ backgroundColor: HANDWRITING_BACKGROUND }}
        />
      )}
    </figure>
  );
}
