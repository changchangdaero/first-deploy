import type {
  HandwritingEllipseShape,
  HandwritingLineShape,
  HandwritingPoint,
  HandwritingStroke,
} from '@/types/post';

type ShapeCorrectionResult =
  | { kind: 'line'; line: HandwritingLineShape }
  | { kind: 'ellipse'; ellipse: HandwritingEllipseShape }
  | null;

function getDistance(a: HandwritingPoint, b: HandwritingPoint) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function getPathLength(points: HandwritingPoint[]) {
  let total = 0;

  for (let index = 1; index < points.length; index += 1) {
    total += getDistance(points[index - 1], points[index]);
  }

  return total;
}

function getBoundingBox(points: HandwritingPoint[]) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function getAverageDistanceToLine(
  points: HandwritingPoint[],
  start: HandwritingPoint,
  end: HandwritingPoint
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);

  if (length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  let total = 0;

  for (const point of points) {
    const distance =
      Math.abs(dy * point.x - dx * point.y + end.x * start.y - end.y * start.x) /
      length;
    total += distance;
  }

  return total / points.length;
}

function detectLine(points: HandwritingPoint[]): HandwritingLineShape | null {
  if (points.length < 2) {
    return null;
  }

  const start = points[0];
  const end = points[points.length - 1];
  const directLength = getDistance(start, end);
  const pathLength = getPathLength(points);

  if (directLength < 24 || pathLength === 0) {
    return null;
  }

  const straightness = directLength / pathLength;
  const averageDistance = getAverageDistanceToLine(points, start, end);

  if (straightness < 0.94 || averageDistance > Math.max(6, directLength * 0.03)) {
    return null;
  }

  return {
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y,
  };
}

function detectEllipse(points: HandwritingPoint[]): HandwritingEllipseShape | null {
  if (points.length < 8) {
    return null;
  }

  const start = points[0];
  const end = points[points.length - 1];
  const closureDistance = getDistance(start, end);
  const bounds = getBoundingBox(points);

  if (bounds.width < 24 || bounds.height < 24) {
    return null;
  }

  const pathLength = getPathLength(points);
  const estimatedPerimeter = Math.PI * (bounds.width + bounds.height) / 2;
  const closureThreshold = Math.max(18, Math.min(bounds.width, bounds.height) * 0.35);
  const aspectRatio =
    Math.max(bounds.width, bounds.height) / Math.max(1, Math.min(bounds.width, bounds.height));

  if (closureDistance > closureThreshold || aspectRatio > 1.8) {
    return null;
  }

  if (pathLength < estimatedPerimeter * 0.75 || pathLength > estimatedPerimeter * 1.35) {
    return null;
  }

  const centerX = bounds.minX + bounds.width / 2;
  const centerY = bounds.minY + bounds.height / 2;
  const radiusX = bounds.width / 2;
  const radiusY = bounds.height / 2;

  let totalError = 0;

  for (const point of points) {
    const normalized =
      ((point.x - centerX) * (point.x - centerX)) / (radiusX * radiusX) +
      ((point.y - centerY) * (point.y - centerY)) / (radiusY * radiusY);
    totalError += Math.abs(1 - normalized);
  }

  const averageError = totalError / points.length;

  if (averageError > 0.28) {
    return null;
  }

  return {
    centerX,
    centerY,
    radiusX,
    radiusY,
    rotation: 0,
  };
}

export function correctStrokeToShape(stroke: HandwritingStroke): ShapeCorrectionResult {
  if (stroke.tool !== 'pen' || stroke.points.length < 2) {
    return null;
  }

  const ellipse = detectEllipse(stroke.points);

  if (ellipse) {
    return {
      kind: 'ellipse',
      ellipse,
    };
  }

  const line = detectLine(stroke.points);

  if (line) {
    return {
      kind: 'line',
      line,
    };
  }

  return null;
}
