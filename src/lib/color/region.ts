/** Image-relative coordinates (0–1), independent of screen size. */
export interface ImageRegion { x: number; y: number; width: number; height: number }
export const FULL_IMAGE: ImageRegion = { x: 0, y: 0, width: 1, height: 1 }
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
export function normalizeRegion(r: ImageRegion): ImageRegion {
  if (!Object.values(r).every(Number.isFinite)) throw new Error('Invalid image region')
  const x = clamp(r.x, 0, .98), y = clamp(r.y, 0, .98)
  return { x, y, width: clamp(r.width, .02, 1 - x), height: clamp(r.height, .02, 1 - y) }
}
export function regionFromPoints(a: {x:number;y:number}, b: {x:number;y:number}): ImageRegion {
  return normalizeRegion({ x: Math.min(a.x,b.x), y: Math.min(a.y,b.y), width: Math.abs(a.x-b.x), height: Math.abs(a.y-b.y) })
}
