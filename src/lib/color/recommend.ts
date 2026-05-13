import { COLOR_DICTIONARY } from '@/constants/colors'
import { BARUSA_PAIRS, FASHION_PAIRS, SAFE_ANCHORS } from '@/constants/fashionPairs'
import { MODE_MAP } from '@/constants/modes'
import { recommendMaterials } from '@/constants/materials'
import { buildReason, type ReasonType } from '@/constants/reasonTemplates'
import type { ColorEntry, ColorInfo, Mode } from '@/types/color'
import type { Material } from '@/types/material'
import { hexToHsl, normalizeHex } from './convert'
import { findNearestColor, entryToInfo } from './name'

export interface Recommendation {
  color: ColorInfo
  entryId: string
  score: number
  reasonType: ReasonType
  reason: string
}

export interface RecommendResult {
  base: ColorInfo
  baseMaterial?: Material
  mode: Mode
  modeLabel: string
  recommendations: Recommendation[]
  recommendedMaterials: Material[]
}

const BASE_SCORE = 60
const MIN_SCORE = 35
const MAX_RECOMMENDATIONS = 5

export function scoreMatch(
  base: ColorEntry,
  target: ColorEntry,
  mode: Mode
): { score: number; reasonType: ReasonType } {
  if (base.id === target.id) return { score: 0, reasonType: 'fashion_basic' }

  const baseHsl = hexToHsl(base.hex)
  const targetHsl = hexToHsl(target.hex)
  const modeInfo = MODE_MAP[mode]

  let score = BASE_SCORE
  let reasonType: ReasonType = 'fashion_basic'

  // 1. BARUSA 검증 페어
  const barusaPairs = BARUSA_PAIRS[base.id]
  if (barusaPairs?.includes(target.id)) {
    score += 22
    reasonType = 'barusa_verified'
  }

  // 2. 안전 앵커
  if (SAFE_ANCHORS.includes(target.id)) {
    score += 10
    if (reasonType === 'fashion_basic') reasonType = 'safe_anchor'
  }

  // 3. 무채색 매치
  if (target.isNeutral && !base.isNeutral) {
    score += 15
    if (reasonType === 'fashion_basic') reasonType = 'neutral_match'
  }

  // 4. 톤온톤
  if (base.family === target.family) {
    const lDiff = Math.abs(baseHsl.l - targetHsl.l)
    if (lDiff >= 20 && lDiff <= 55) {
      score += 12
      if (reasonType === 'fashion_basic') reasonType = 'ton_on_ton'
    } else if (lDiff < 10) {
      score -= 20
    }
  }

  // 5. 유사색 / 6. 보색
  if (!base.isNeutral && !target.isNeutral) {
    const hDiff = Math.min(
      Math.abs(baseHsl.h - targetHsl.h),
      360 - Math.abs(baseHsl.h - targetHsl.h)
    )
    if (hDiff <= 30 && base.family !== target.family) {
      score += 8
      if (reasonType === 'fashion_basic') reasonType = 'analogous'
    }
    if (hDiff >= 150 && hDiff <= 210 && targetHsl.s <= 55) {
      score += 6
      if (reasonType === 'fashion_basic') reasonType = 'complementary'
    }
  }

  // 7. 일반 패션 페어
  const fashionPairs = FASHION_PAIRS[base.family] ?? []
  if (fashionPairs.includes(target.id)) score += 8

  // 8. 명도 대비
  const lDiff = Math.abs(baseHsl.l - targetHsl.l)
  if (lDiff >= 30) score += 8
  if (lDiff < 8 && base.family !== target.family) score -= 12

  // 9. 양쪽 채도 강함
  if (baseHsl.s > 60 && targetHsl.s > 60) score -= 25

  // 10. 모드 가중치
  if (target.modes.includes(mode)) score += 10
  else score -= 8

  if (mode === 'interview' || mode === 'formal') {
    if (target.isNeutral) score += 10
    if (targetHsl.s > modeInfo.maxSaturation) score -= 25
  }
  if (mode === 'date') {
    if (targetHsl.l >= 65) score += 6
    if (target.isNeutral && targetHsl.l < 30) score -= 5
  }
  if (mode === 'street') {
    if (targetHsl.s >= 40) score += 8
  }
  if (mode === 'campus') {
    if (target.isBasic) score += 5
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasonType,
  }
}

export function recommendColors(
  baseHex: string,
  mode: Mode,
  baseMaterial?: Material
): RecommendResult {
  const normalizedHex = normalizeHex(baseHex)
  const baseEntry = findNearestColor(normalizedHex)
  const baseInfo: ColorInfo = {
    hex: normalizedHex,
    name: baseEntry.name,
    hsl: hexToHsl(normalizedHex),
  }

  const scored = COLOR_DICTIONARY
    .map((target) => {
      const { score, reasonType } = scoreMatch(baseEntry, target, mode)
      return { target, score, reasonType }
    })
    .filter((c) => c.score >= MIN_SCORE && c.target.id !== baseEntry.id)

  scored.sort((a, b) => b.score - a.score)

  // family 다양성: 같은 family 최대 2개
  const familyCount: Record<string, number> = {}
  const picked: typeof scored = []
  for (const c of scored) {
    const cnt = familyCount[c.target.family] ?? 0
    if (cnt >= 2) continue
    picked.push(c)
    familyCount[c.target.family] = cnt + 1
    if (picked.length >= MAX_RECOMMENDATIONS) break
  }

  const recommendations: Recommendation[] = picked.map((c) => ({
    color: entryToInfo(c.target),
    entryId: c.target.id,
    score: c.score,
    reasonType: c.reasonType,
    reason: buildReason(c.reasonType, baseEntry.name, c.target.name, mode),
  }))

  const recommendedMaterials = baseMaterial
    ? recommendMaterials(baseMaterial, mode, 2)
    : []

  return {
    base: baseInfo,
    baseMaterial,
    mode,
    modeLabel: MODE_MAP[mode].label,
    recommendations,
    recommendedMaterials,
  }
}

export function recommendAllModes(
  baseHex: string,
  baseMaterial?: Material
): Record<Mode, RecommendResult> {
  const modes: Mode[] = ['daily','campus','date','interview','formal','street']
  return modes.reduce((acc, m) => {
    acc[m] = recommendColors(baseHex, m, baseMaterial)
    return acc
  }, {} as Record<Mode, RecommendResult>)
}

export function averageScore(result: RecommendResult): number {
  if (result.recommendations.length === 0) return 0
  const sum = result.recommendations.reduce((s, r) => s + r.score, 0)
  return Math.round(sum / result.recommendations.length)
}
