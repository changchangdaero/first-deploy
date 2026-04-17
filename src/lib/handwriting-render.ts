import type { HandwritingStroke } from '@/types/post';

export const DEFAULT_HANDWRITING_WIDTH = 960;
export const DEFAULT_HANDWRITING_HEIGHT = 540;
export const HANDWRITING_BACKGROUND = '#FFFFFF';

export function drawHandwritingStrokes(
  context: CanvasRenderingContext2D,
  strokes: HandwritingStroke[],
  width: number,
  height: number
) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = HANDWRITING_BACKGROUND;
  context.fillRect(0, 0, width, height);
  context.lineCap = 'round';
  context.lineJoin = 'round';

  for (const stroke of strokes) {
    if (stroke.points.length === 0) {
      continue;
    }

    context.save();
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle =
      stroke.tool === 'eraser' ? HANDWRITING_BACKGROUND : stroke.color;
    context.lineWidth = stroke.size;

    if (stroke.points.length === 1) {
      const [point] = stroke.points;
      context.beginPath();
      context.arc(point.x, point.y, stroke.size / 2, 0, Math.PI * 2);
      context.fillStyle =
        stroke.tool === 'eraser' ? HANDWRITING_BACKGROUND : stroke.color;
      context.fill();
      context.restore();
      continue;
    }

    context.beginPath();
    context.moveTo(stroke.points[0].x, stroke.points[0].y);

    for (let index = 1; index < stroke.points.length; index += 1) {
      const current = stroke.points[index];
      const previous = stroke.points[index - 1];
      const midX = (previous.x + current.x) / 2;
      const midY = (previous.y + current.y) / 2;

      context.quadraticCurveTo(previous.x, previous.y, midX, midY);
    }

    const lastPoint = stroke.points[stroke.points.length - 1];
    context.lineTo(lastPoint.x, lastPoint.y);
    context.stroke();
    context.restore();
  }
}
