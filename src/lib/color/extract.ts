import { rgbToHex, rgbToHsl, hexToHsl } from './convert'
import { findNearestColor } from './name'
import type { ColorInfo } from '@/types/color'
import { kmeans } from './kmeans'
import { normalizeRegion, type ImageRegion } from './region'

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
  k: number = 5,
  region?: ImageRegion
): Promise<ColorInfo[]> {
  const img = await loadImage(source)
  const pixels = samplePixelsFromCenter(img, 100, region)
  if (pixels.length === 0) return []

  const clusters = kmeans(pixels, k, 10)

  // 배경 가능성 점수로 가중치 보정
  const weighted = clusters.map((c) => {
    // A user-selected garment may itself be white or black. Rank its actual coverage.
    const bg = region ? 0 : backgroundScore(c.center.r, c.center.g, c.center.b)
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
    const cleanup = () => { if (src instanceof File) URL.revokeObjectURL(url) }
    img.onload = () => { cleanup(); resolve(img) }
    img.onerror = () => { cleanup(); reject(new Error('이미지를 읽을 수 없습니다. JPG 또는 PNG 사진으로 다시 시도해 주세요.')) }
    img.src = url
  })
}

/**
 * 이미지 중앙 70% 영역에서 픽셀 샘플링.
 * 옷 사진은 보통 옷이 중앙에 위치하므로 배경 픽셀을 줄임.
 */
function samplePixelsFromCenter(img: HTMLImageElement, size: number, region?: ImageRegion): Pixel[] {
  const c = document.createElement('canvas')
  c.width = size; c.height = size
  const ctx = c.getContext('2d')!
  const width = img.naturalWidth, height = img.naturalHeight
  const srcSize = Math.min(width, height) * 0.7
  const r = region ? normalizeRegion(region) : null
  ctx.drawImage(img, r ? r.x * width : (width - srcSize) / 2,
    r ? r.y * height : (height - srcSize) / 2,
    r ? r.width * width : srcSize, r ? r.height * height : srcSize, 0, 0, size, size)

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
