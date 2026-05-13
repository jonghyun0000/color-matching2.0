import { COLOR_DICTIONARY } from '@/constants/colors'
import type { ColorEntry, ColorInfo } from '@/types/color'
import { hexToHsl, hslDistance, normalizeHex } from './convert'

export function findNearestColor(hex: string): ColorEntry {
  const targetHsl = hexToHsl(hex)
  let best = COLOR_DICTIONARY[0]
  let bestDist = Infinity
  for (const entry of COLOR_DICTIONARY) {
    const d = hslDistance(hexToHsl(entry.hex), targetHsl)
    if (d < bestDist) { bestDist = d; best = entry }
  }
  return best
}

export function toColorInfo(hex: string): ColorInfo {
  const normalized = normalizeHex(hex)
  const nearest = findNearestColor(normalized)
  return { hex: normalized, name: nearest.name, hsl: hexToHsl(normalized) }
}

export function entryToInfo(entry: ColorEntry): ColorInfo {
  return { hex: entry.hex, name: entry.name, hsl: hexToHsl(entry.hex) }
}
