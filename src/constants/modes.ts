import type { Mode } from '@/types/color'

export interface ModeInfo {
  id: Mode
  label: string
  description: string
  preferNeutral: boolean
  maxSaturation: number
  preferBright: boolean
}

export const MODES: ModeInfo[] = [
  { id: 'daily', label: '데일리', description: '매일 입어도 어색하지 않은 무난한 조합', preferNeutral: true, maxSaturation: 60, preferBright: false },
  { id: 'campus', label: '캠퍼스', description: '편하면서도 정돈된 학교 코디', preferNeutral: false, maxSaturation: 70, preferBright: false },
  { id: 'date', label: '데이트', description: '부드럽고 밝은 인상을 주는 조합', preferNeutral: false, maxSaturation: 65, preferBright: true },
  { id: 'interview', label: '면접', description: '단정하고 신뢰감 있는 컬러', preferNeutral: true, maxSaturation: 30, preferBright: false },
  { id: 'formal', label: '포멀', description: '격식 있는 자리에 어울리는 클래식한 조합', preferNeutral: true, maxSaturation: 40, preferBright: false },
  { id: 'street', label: '스트릿', description: '개성을 살린 트렌디한 매치', preferNeutral: false, maxSaturation: 85, preferBright: false },
]

export const MODE_MAP: Record<Mode, ModeInfo> = Object.fromEntries(
  MODES.map(m => [m.id, m])
) as Record<Mode, ModeInfo>
