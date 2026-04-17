import type { HandwritingPoint, HandwritingStroke } from '@/types/post';

function getDistance(a: HandwritingPoint, b: HandwritingPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function distanceToSegment(
  point: HandwritingPoint,
  start: HandwritingPoint,
  end: HandwritingPoint
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return getDistance(point, start);
  }

  const projection = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared
    )
  );

  const projectedPoint = {
    x: start.x + projection * dx,
    y: start.y + projection * dy,
  };

  return Math.hypot(point.x - projectedPoint.x, point.y - projectedPoint.y);
}

function sampleEllipsePoints(stroke: HandwritingStroke, samples = 48) {
  if (!stroke.ellipse) {
    return [] as HandwritingPoint[];
  }

  const rotation = stroke.ellipse.rotation ?? 0;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  return Array.from({ length: samples }, (_, index) => {
    const angle = (Math.PI * 2 * index) / samples;
    const localX = Math.cos(angle) * stroke.ellipse!.radiusX;
    const localY = Math.sin(angle) * stroke.ellipse!.radiusY;

    return {
      x: stroke.ellipse!.centerX + localX * cos - localY * sin,
      y: stroke.ellipse!.centerY + localX * sin + localY * cos,
    };
  });
}

export function doesStrokeIntersectPath(
  stroke: HandwritingStroke,
  eraserPath: HandwritingPoint[],
  eraserRadius: number
) {
  if (eraserPath.length === 0) {
    return false;
  }

  const threshold = Math.max(eraserRadius, stroke.size / 2) + 2;

  if (stroke.kind === 'line' && stroke.line) {
    return eraserPath.some((point) =>
      distanceToSegment(
        point,
        { x: stroke.line!.x1, y: stroke.line!.y1 },
        { x: stroke.line!.x2, y: stroke.line!.y2 }
      ) <= threshold
    );
  }

  if (stroke.kind === 'ellipse' && stroke.ellipse) {
    const ellipsePoints = sampleEllipsePoints(stroke);

    return eraserPath.some((point) =>
      ellipsePoints.some((ellipsePoint) => getDistance(point, ellipsePoint) <= threshold)
    );
  }

  return eraserPath.some((eraserPoint) =>
    stroke.points.some((strokePoint) => getDistance(eraserPoint, strokePoint) <= threshold)
  );
}
