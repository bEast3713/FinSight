export type Point = { x: number; y: number };

export function linearRegression(points: Point[]) {
  const n = points.length;
  if (n === 0) {
    return { slope: 0, intercept: 0, forecast: () => 0 };
  }

  const sumX = points.reduce((acc, point) => acc + point.x, 0);
  const sumY = points.reduce((acc, point) => acc + point.y, 0);
  const sumXY = points.reduce((acc, point) => acc + point.x * point.y, 0);
  const sumXX = points.reduce((acc, point) => acc + point.x * point.x, 0);

  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return {
    slope,
    intercept,
    forecast: (x: number) => slope * x + intercept,
  };
}
