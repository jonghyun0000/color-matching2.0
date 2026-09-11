export interface Pixel { r: number; g: number; b: number }
const distance = (a: Pixel, b: Pixel) =>
  (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2

/** Deterministic farthest-point seeding. Never invent clusters for absent colors. */
export function kmeans(pixels: Pixel[], requested = 5, iterations = 10) {
  if (!pixels.length || !Number.isFinite(requested) || requested < 1) return []
  const k = Math.min(16, pixels.length, Math.floor(requested))
  const centers: Pixel[] = [{ ...pixels[0] }]
  while (centers.length < k) {
    let farthest = pixels[0], maxDistance = 0
    for (const pixel of pixels) {
      const d = Math.min(...centers.map(center => distance(pixel, center)))
      if (d > maxDistance) { maxDistance = d; farthest = pixel }
    }
    if (maxDistance === 0) break
    centers.push({ ...farthest })
  }
  const nearest = (pixel: Pixel) => {
    let index = 0
    for (let i = 1; i < centers.length; i++) {
      if (distance(pixel, centers[i]) < distance(pixel, centers[index])) index = i
    }
    return index
  }
  for (let step = 0; step < iterations; step++) {
    const sums = centers.map(() => ({ r: 0, g: 0, b: 0, count: 0 }))
    for (const pixel of pixels) {
      const sum = sums[nearest(pixel)]
      sum.r += pixel.r; sum.g += pixel.g; sum.b += pixel.b; sum.count++
    }
    let moved = false
    sums.forEach((sum, i) => {
      if (!sum.count) return
      const next = { r: sum.r / sum.count, g: sum.g / sum.count, b: sum.b / sum.count }
      if (distance(next, centers[i]) > 0.01) moved = true
      centers[i] = next
    })
    if (!moved) break
  }
  const counts = centers.map(() => 0)
  for (const pixel of pixels) counts[nearest(pixel)]++
  return centers.map((center, i) => ({
    center: { r: Math.round(center.r), g: Math.round(center.g), b: Math.round(center.b) },
    count: counts[i],
  })).filter(cluster => cluster.count > 0)
}
