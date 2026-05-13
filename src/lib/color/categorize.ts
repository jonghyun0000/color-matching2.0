import type { HSL } from './convert'

export type ColorCategory = 'neutral' | 'warm' | 'cool' | 'vivid'

export function isNeutral(hsl: HSL): boolean {
  if (hsl.s <= 12) return true
  if (hsl.l <= 12 || hsl.l >= 92) return true
  if (hsl.h >= 20 && hsl.h <= 50 && hsl.s <= 35 && hsl.l >= 30 && hsl.l <= 80) return true
  return false
}

export function categorize(hsl: HSL): ColorCategory {
  if (isNeutral(hsl)) return 'neutral'
  if (hsl.s >= 65 && hsl.l >= 35 && hsl.l <= 65) return 'vivid'
  if ((hsl.h >= 0 && hsl.h < 60) || hsl.h >= 300) return 'warm'
  return 'cool'
}

export function isLight(hsl: HSL): boolean { return hsl.l >= 65 }
export function isDark(hsl: HSL): boolean { return hsl.l <= 30 }
