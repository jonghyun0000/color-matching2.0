import type { ColorInfo, ItemType, Mode } from '@/types/color'

const KEY = '@dduckddak/history'
const MAX = 50

export interface HistoryItem {
  id: string
  createdAt: number
  itemType: ItemType
  baseColor: ColorInfo
  mode: Mode
  topPickHex?: string  // 1순위 추천 색 (썸네일용)
  imageDataUrl?: string
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addHistory(item: HistoryItem): void {
  const list = getHistory()
  list.unshift(item)
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
}

export function removeHistory(id: string): void {
  const list = getHistory().filter((h) => h.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function clearHistory(): void {
  localStorage.removeItem(KEY)
}
