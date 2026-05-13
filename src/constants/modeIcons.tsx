import { Sun, Backpack, Heart, Briefcase, Crown, Flame, type LucideIcon } from 'lucide-react'
import type { Mode } from '@/types/color'

/** 모드별 lucide 아이콘 컴포넌트 매핑 (이모지 대체) */
export const MODE_ICONS: Record<Mode, LucideIcon> = {
  daily: Sun,
  campus: Backpack,
  date: Heart,
  interview: Briefcase,
  formal: Crown,
  street: Flame,
}
