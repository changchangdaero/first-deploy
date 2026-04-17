'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { doesStrokeIntersectPath } from '@/lib/handwriting-hit-test';
import { correctStrokeToShape } from '@/lib/handwriting-shape-correction';
import {
  DEFAULT_HANDWRITING_HEIGHT,
  DEFAULT_HANDWRITING_WIDTH,
  drawHandwritingStrokes,
  HANDWRITING_BACKGROUND,
} from '@/lib/handwriting-render';
import type { HandwritingBlockInput, HandwritingPoint, HandwritingStroke } from '@/types/post';

type AdminHandwritingBlockEditorProps = {
  block: HandwritingBlockInput | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (block: HandwritingBlockInput) => Promise<void> | void;
};

const COLOR_PRESETS = ['#111827', '#1d4ed8', '#b91c1c', '#15803d', '#7c3aed'];
const ERASER_PRESETS = [
  { label: '작게', value: 12 },
  { label: '보통', value: 24 },
  { label: '크게', value: 40 },
];

type DraftStroke = HandwritingStroke;
type EraserMode = 'stroke' | 'partial';

export default function AdminHandwritingBlockEditor({
  block,
  isSaving,
  onClose,
  onSave,
}: AdminHandwritingBlockEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStrokeRef = useRef<DraftStroke | null>(null);
  const erasedStrokeIdsRef = useRef<Set<string>>(new Set());
  const pointerIdRef = useRef<number | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [eraserMode, setEraserMode] = useState<EraserMode>('stroke');
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [penSize, setPenSize] = useState(4);
  const [eraserSize, setEraserSize] = useState(24);
  const [width, setWidth] = useState(DEFAULT_HANDWRITING_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HANDWRITING_HEIGHT);
  const [strokes, setStrokes] = useState<HandwritingStroke[]>([]);
  const [autoCorrectShapes, setAutoCorrectShapes] = useState(true);

  useEffect(() => {
    if (!block) {
      return;
    }

    setStrokes(block.strokes);
    setWidth(block.width);
    setHeight(block.height);
    erasedStrokeIdsRef.current = new Set();

    const lastPenStroke = [...block.strokes].reverse().find((item) => item.tool === 'pen');
    const lastEraserStroke = [...block.strokes]
      .reverse()
      .find((item) => item.tool === 'eraser');

    if (lastPenStroke) {
      setColor(lastPenStroke.color);
      setPenSize(lastPenStroke.size);
    }

    if (lastEraserStroke) {
      setEraserSize(lastEraserStroke.size);
    }
  }, [block]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    drawHandwritingStrokes(context, strokes, width, height);
  }, [height, strokes, width]);

  const canUndo = strokes.length > 0;
  const drawingSummary = useMemo(() => `선 ${strokes.length}개`, [strokes.length]);
  const activeSize = tool === 'pen' ? penSize : eraserSize;

  if (!block) {
    return null;
  }

  const currentBlock = block;

  function getCanvasPoint(event: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * width,
      y: ((event.clientY - rect.top) / rect.height) * height,
      pressure: event.pressure > 0 ? event.pressure : undefined,
    };
  }

  function redrawPreview(nextStrokes: HandwritingStroke[], nextStroke?: DraftStroke | null) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    drawHandwritingStrokes(
      context,
      nextStroke ? [...nextStrokes, nextStroke] : nextStrokes,
      width,
      height
    );
  }

  function getStrokeErasedPreview(path: HandwritingPoint[]) {
    const erasedIds = erasedStrokeIdsRef.current;

    const nextErasedIds = new Set(erasedIds);

    for (const stroke of strokes) {
      if (stroke.tool !== 'pen' || nextErasedIds.has(stroke.id)) {
        continue;
      }

      if (doesStrokeIntersectPath(stroke, path, eraserSize / 2)) {
        nextErasedIds.add(stroke.id);
      }
    }

    erasedStrokeIdsRef.current = nextErasedIds;

    return strokes.filter((stroke) => !nextErasedIds.has(stroke.id));
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    event.preventDefault();
    pointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);

    const startPoint = getCanvasPoint(event);

    currentStrokeRef.current = {
      id: crypto.randomUUID(),
      tool,
      color,
      size: activeSize,
      points: [startPoint],
      kind: 'freehand',
    };

    if (tool === 'eraser' && eraserMode === 'stroke') {
      const previewStrokes = getStrokeErasedPreview([startPoint]);
      redrawPreview(previewStrokes);
      return;
    }

    redrawPreview(strokes, currentStrokeRef.current);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (pointerIdRef.current !== event.pointerId || !currentStrokeRef.current) {
      return;
    }

    currentStrokeRef.current = {
      ...currentStrokeRef.current,
      points: [...currentStrokeRef.current.points, getCanvasPoint(event)],
    };

    if (tool === 'eraser' && eraserMode === 'stroke') {
      const previewStrokes = getStrokeErasedPreview(currentStrokeRef.current.points);
      redrawPreview(previewStrokes);
      return;
    }

    redrawPreview(strokes, currentStrokeRef.current);
  }

  function finishStroke() {
    if (!currentStrokeRef.current) {
      return;
    }

    let finalStroke = currentStrokeRef.current;
    currentStrokeRef.current = null;
    pointerIdRef.current = null;

    if (tool === 'eraser' && eraserMode === 'stroke') {
      const erasedIds = erasedStrokeIdsRef.current;
      erasedStrokeIdsRef.current = new Set();
      setStrokes((current) => current.filter((stroke) => !erasedIds.has(stroke.id)));
      return;
    }

    if (autoCorrectShapes && finalStroke.tool === 'pen') {
      const correction = correctStrokeToShape(finalStroke);

      if (correction?.kind === 'line') {
        finalStroke = {
          ...finalStroke,
          kind: 'line',
          line: correction.line,
          ellipse: undefined,
        };
      } else if (correction?.kind === 'ellipse') {
        finalStroke = {
          ...finalStroke,
          kind: 'ellipse',
          ellipse: correction.ellipse,
          line: undefined,
        };
      }
    }

    setStrokes((current) => [...current, finalStroke]);
  }

  async function handleSave() {
    await onSave({
      id: currentBlock.id,
      strokes,
      preview_image_url: currentBlock.preview_image_url,
      width,
      height,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-[var(--portfolio-bg)] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-default)] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
              손글씨 블록
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[var(--text-heading)]">
              손글씨 블록 편집
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              수식, 화살표, 간단한 도식을 그려서 게시글 안에 바로 넣을 수 있습니다.
            </p>
          </div>

          <button type="button" onClick={onClose} className="link-pill">
            닫기
          </button>
        </div>

        <div className="grid gap-6 overflow-y-auto px-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                도구
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTool('pen')}
                  className={`link-pill ${tool === 'pen' ? 'bg-[var(--text-heading)] text-white' : ''}`}
                >
                  펜
                </button>
                <button
                  type="button"
                  onClick={() => setTool('eraser')}
                  className={`link-pill ${tool === 'eraser' ? 'bg-[var(--text-heading)] text-white' : ''}`}
                >
                  지우개
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
              <label className="flex items-center gap-3 text-sm font-medium text-[var(--text-heading)]">
                <input
                  type="checkbox"
                  checked={autoCorrectShapes}
                  onChange={(event) => setAutoCorrectShapes(event.target.checked)}
                />
                도형 자동 보정
              </label>
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                선과 원에 가까운 획은 그리기 완료 후 자동으로 정리됩니다.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
              <label className="block text-sm font-medium text-[var(--text-heading)]">
                색상
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setTool('pen');
                      setColor(preset);
                    }}
                    aria-label={`색상 ${preset}`}
                    className={`h-9 w-9 rounded-full border ${color === preset ? 'border-[var(--text-heading)] ring-2 ring-[var(--text-heading)]/20' : 'border-white/60'}`}
                    style={{ backgroundColor: preset }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
              <label className="block text-sm font-medium text-[var(--text-heading)]">
                굵기
              </label>
              <input
                type="range"
                min="2"
                max="24"
                step="1"
                value={penSize}
                onChange={(event) => setPenSize(Number(event.target.value))}
                className="mt-3 w-full"
              />
              <p className="mt-2 text-xs text-[var(--text-muted)]">펜 {penSize}px</p>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
              <p className="text-sm font-medium text-[var(--text-heading)]">지우개 방식</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEraserMode('stroke')}
                  className={`link-pill ${eraserMode === 'stroke' ? 'bg-[var(--text-heading)] text-white' : ''}`}
                >
                  획 단위 지우개
                </button>
                <button
                  type="button"
                  onClick={() => setEraserMode('partial')}
                  className={`link-pill ${eraserMode === 'partial' ? 'bg-[var(--text-heading)] text-white' : ''}`}
                >
                  부분 지우개
                </button>
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                획 단위 지우개가 기본값이며, 닿은 선 전체를 지웁니다.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
              <p className="text-sm font-medium text-[var(--text-heading)]">지우개 크기</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ERASER_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setTool('eraser');
                      setEraserSize(preset.value);
                    }}
                    className={`link-pill ${eraserSize === preset.value ? 'bg-[var(--text-heading)] text-white' : ''}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="8"
                max="48"
                step="2"
                value={eraserSize}
                onChange={(event) => {
                  setTool('eraser');
                  setEraserSize(Number(event.target.value));
                }}
                className="mt-3 w-full"
              />
              <p className="mt-2 text-xs text-[var(--text-muted)]">지우개 {eraserSize}px</p>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
              <p className="text-sm font-medium text-[var(--text-heading)]">캔버스 크기</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="text-xs text-[var(--text-muted)]">
                  가로
                  <input
                    type="number"
                    min="320"
                    max="1600"
                    value={width}
                    onChange={(event) =>
                      setWidth(Number(event.target.value) || DEFAULT_HANDWRITING_WIDTH)
                    }
                    className="mt-1 w-full rounded-xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-3 py-2 text-sm text-[var(--text-heading)]"
                  />
                </label>
                <label className="text-xs text-[var(--text-muted)]">
                  세로
                  <input
                    type="number"
                    min="200"
                    max="1200"
                    value={height}
                    onChange={(event) =>
                      setHeight(Number(event.target.value) || DEFAULT_HANDWRITING_HEIGHT)
                    }
                    className="mt-1 w-full rounded-xl border border-[var(--border-default)] bg-[var(--portfolio-surface-muted)] px-3 py-2 text-sm text-[var(--text-heading)]"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
              <p className="text-sm font-medium text-[var(--text-heading)]">편집</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setStrokes((current) => current.slice(0, -1))}
                  disabled={!canUndo}
                  className="link-pill disabled:opacity-50"
                >
                  실행 취소
                </button>
                <button type="button" onClick={() => setStrokes([])} className="link-pill">
                  모두 지우기
                </button>
              </div>
              <p className="mt-3 text-xs text-[var(--text-muted)]">{drawingSummary}</p>
            </div>
          </aside>

          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishStroke}
                onPointerCancel={finishStroke}
                onPointerLeave={finishStroke}
                className="block w-full rounded-2xl border border-[var(--border-default)] bg-white"
                style={{ backgroundColor: HANDWRITING_BACKGROUND, touchAction: 'none' }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[var(--text-muted)]">
                마우스와 스타일러스 모두 사용할 수 있습니다.
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={onClose} className="link-pill">
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-full bg-[var(--text-heading)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent)] disabled:opacity-60"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
