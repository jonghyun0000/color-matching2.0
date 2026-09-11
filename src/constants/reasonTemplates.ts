import type { Mode } from '@/types/color'
import type { Material } from '@/types/material'
import { MATERIAL_MAP } from './materials'

export type ReasonType =
  | 'barusa_verified'
  | 'safe_anchor'
  | 'neutral_match'
  | 'ton_on_ton'
  | 'analogous'
  | 'complementary'
  | 'fashion_basic'

export const PSYCHOLOGY_TAG: Record<Mode, string> = {
  daily: '안정감을 주는',
  campus: '활력을 주는',
  date: '감성적인',
  interview: '신뢰감을 주는',
  formal: '차분한 인상의',
  street: '활력을 주는',
}

export function buildReason(
  reasonType: ReasonType,
  baseName: string,
  targetName: string,
  mode: Mode
): string {
  const psych = PSYCHOLOGY_TAG[mode]
  switch (reasonType) {
    case 'barusa_verified':
      return `${baseName}와 ${targetName}는 이 앱의 색 조합 사전에 등록된 ${psych} 조합이에요. 실제 옷의 재질과 조명도 함께 살펴보세요.`
    case 'safe_anchor':
      return `${targetName}는 어떤 색에도 잘 어울리는 패션 기본 색이에요. ${baseName}와 함께 입으면 단정하고 깔끔한 인상을 줘요.`
    case 'neutral_match':
      return `${baseName}는 차분한 색이라 ${targetName} 같은 무채색과 가장 잘 어울려요. 가장 무난하고 안전한 조합이에요.`
    case 'ton_on_ton':
      return `같은 계열의 ${targetName}을 매치하면 자연스럽고 정돈된 느낌을 줘요. 톤온톤 코디는 키도 커 보이게 해요.`
    case 'analogous':
      return `${targetName}는 ${baseName}와 비슷한 계열이라 부드럽게 어우러져요. 통일감 있는 ${psych} 코디가 돼요.`
    case 'complementary':
      return `${targetName}는 ${baseName}의 반대 색이에요. 채도를 낮춰 매치하면 서로를 돋보이게 하면서도 부담스럽지 않아요.`
    case 'fashion_basic':
    default:
      return `${baseName}와 ${targetName}는 패션에서 자주 쓰이는 ${psych} 조합이에요. 어디에 입어도 무난해요.`
  }
}

export function buildMaterialHint(
  baseMaterial: Material | undefined,
  recommendedMaterials: Material[],
  itemType: 'top' | 'bottom'
): string | null {
  if (!baseMaterial || recommendedMaterials.length === 0) return null
  const names = recommendedMaterials.map(m => MATERIAL_MAP[m].label).join(', ')
  const baseLabel = MATERIAL_MAP[baseMaterial].label
  const baseType = itemType === 'top' ? '상의' : '하의'
  const targetType = itemType === 'top' ? '하의' : '상의'
  return `${baseLabel} ${baseType}에는 ${names} ${targetType}를 매치하면 좋아요.`
}
