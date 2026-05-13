import type { ColorInfo, ItemType, Mode } from '@/types/color'

const KEY = '@dduckddak/favorites'

export interface Favorite {
  id: string
  createdAt: number
  itemType: ItemType
  baseColor: ColorInfo
  pickedColor: ColorInfo
  mode: Mode
  imageDataUrl?: string
  memo?: string
}

export function getFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addFavorite(f: Favorite): void {
  const list = getFavorites()
  const dup = list.find(
    (x) =>
      x.baseColor.hex === f.baseColor.hex &&
      x.pickedColor.hex === f.pickedColor.hex &&
      x.mode === f.mode
  )
  if (dup) return
  list.unshift(f)
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)))
}

export function removeFavorite(id: string): void {
  const list = getFavorites().filter((f) => f.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function isFavorited(
  baseHex: string,
  pickedHex: string,
  mode: Mode
): boolean {
  return getFavorites().some(
    (f) =>
      f.baseColor.hex === baseHex &&
      f.pickedColor.hex === pickedHex &&
      f.mode === mode
  )
}

export function findFavorite(
  baseHex: string,
  pickedHex: string,
  mode: Mode
): Favorite | undefined {
  return getFavorites().find(
    (f) =>
      f.baseColor.hex === baseHex &&
      f.pickedColor.hex === pickedHex &&
      f.mode === mode
  )
}
