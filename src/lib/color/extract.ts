import { rgbToHex, rgbToHsl, hexToHsl } from './convert'
import { findNearestColor } from './name'
import type { ColorInfo } from '@/types/color'

interface Pixel { r: number; g: number; b: number }

/**
 * 이미지에서 대표 색 N개를 K-means로 추출.
 *
 * 개선 사항:
 * 1. 중앙 70% 영역만 샘플링 (옷은 보통 중앙에 위치, 배경 픽셀 비중 감소)
 * 2. 배경 가능성 점수 적용 (흰/회/검 배경을 후순위로)
 *
 * @param source  데이터URL, blob URL, File, 또는 HTMLImageElement
 * @param k       클러스터 개수 (기본 5)
 * @returns       가중치 내림차순 ColorInfo[]
 */
export async function extractColors(
  source: string | File | HTMLImageElement,
  k: number = 5
): Promise<ColorInfo[]> {
  const img = await loadImage(source)
  const pixels = samplePixelsFromCenter(img, 100)
  if (pixels.length === 0) return []

  const clusters = kmeans(pixels, k, 10)

  // 배경 가능성 점수로 가중치 보정
  const weighted = clusters.map((c) => {
    const bg = backgroundScore(c.center.r, c.center.g, c.center.b)
    return { ...c, weight: c.count * (1 - bg * 0.75) }
  })
  weighted.sort((a, b) => b.weight - a.weight)

  return weighted
    .filter((c) => c.count > 0)
    .map((c) => {
      const hex = rgbToHex(c.center)
      return { hex, hsl: hexToHsl(hex), name: findNearestColor(hex).name }
    })
}

async function loadImage(src: string | File | HTMLImageElement): Promise<HTMLImageElement> {
  if (src instanceof HTMLImageElement) return src
  const url = src instanceof File ? URL.createObjectURL(src) : src
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * 이미지 중앙 70% 영역에서 픽셀 샘플링.
 * 옷 사진은 보통 옷이 중앙에 위치하므로 배경 픽셀을 줄임.
 */
function samplePixelsFromCenter(img: HTMLImageElement, size: number): Pixel[] {
  const c = document.createElement('canvas')
  c.width = size; c.height = size
  const ctx = c.getContext('2d')!
  const srcSize = Math.min(img.width, img.height) * 0.7
  const srcX = (img.width - srcSize) / 2
  const srcY = (img.height - srcSize) / 2
  ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, size, size)

  const d = ctx.getImageData(0, 0, size, size).data
  const pixels: Pixel[] = []
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) continue
    pixels.push({ r: d[i], g: d[i + 1], b: d[i + 2] })
  }
  return pixels
}

/**
 * 클러스터가 배경(흰/회/검)일 가능성 점수 0~1.
 * 높을수록 배경일 가능성이 큼 → 추천 우선순위 낮춤.
 */
function backgroundScore(r: number, g: number, b: number): number {
  const hsl = rgbToHsl({ r, g, b })
  let score = 0
  if (hsl.l >= 90) score += 0.5   // 너무 밝음 (흰 배경)
  if (hsl.s <= 8) score += 0.3    // 거의 무채색
  if (hsl.l <= 10) score += 0.2   // 너무 어두움 (검 배경)
  return Math.min(1, score)
}

/** K-means++ 초기화 + 단순 반복 */
function kmeans(pixels: Pixel[], k: number, iter: number) {
  const centers: Pixel[] = [pixels[Math.floor(Math.random() * pixels.length)]]
  while (centers.length < k) {
    const dists = pixels.map((p) =>
      Math.min(...centers.map((c) => dist(p, c)))
    )
    const total = dists.reduce((a, b) => a + b, 0)
    if (total === 0) break
    let r = Math.random() * total
    for (let i = 0; i < pixels.length; i++) {
      r -= dists[i]
      if (r <= 0) { centers.push(pixels[i]); break }
    }
  }

  for (let it = 0; it < iter; it++) {
    const clusters: Pixel[][] = Array.from({ length: k }, () => [])
    for (const p of pixels) {
      let bi = 0, bd = Infinity
      for (let i = 0; i < k; i++) {
        const d = dist(p, centers[i])
        if (d < bd) { bd = d; bi = i }
      }
      clusters[bi].push(p)
    }
    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0) continue
      const avg = clusters[i].reduce(
        (a, p) => ({ r: a.r + p.r, g: a.g + p.g, b: a.b + p.b }),
        { r: 0, g: 0, b: 0 }
      )
      const n = clusters[i].length
      centers[i] = { r: avg.r / n, g: avg.g / n, b: avg.b / n }
    }
  }

  const counts = new Array(k).fill(0)
  for (const p of pixels) {
    let bi = 0, bd = Infinity
    for (let i = 0; i < k; i++) {
      const d = dist(p, centers[i])
      if (d < bd) { bd = d; bi = i }
    }
    counts[bi]++
  }
  return centers.map((c, i) => ({
    center: { r: Math.round(c.r), g: Math.round(c.g), b: Math.round(c.b) },
    count: counts[i],
  }))
}

function dist(a: Pixel, b: Pixel): number {
  const dr = a.r - b.r, dg = a.g - b.g, db = a.b - b.b
  return dr * dr + dg * dg + db * db
}
