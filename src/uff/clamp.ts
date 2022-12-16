/**
 * Clamps `n` between `a` and `b` (inlcusive).
 */

export function clamp(a: number, b: number): (n: number) => number;
export function clamp(a: number, b: number, n: number): number;
export function clamp(a: number, b: number, n?: number) {
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  const clamper = (n: number) => Math.min(Math.max(n, low), high);
  return n === undefined ? clamper : clamper(n);
}
