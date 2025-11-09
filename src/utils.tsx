const EPSILON = 1e-10;
export function approxEqual(a: number, b: number, eps = EPSILON) {
  return Math.abs(a - b) < eps;
}
