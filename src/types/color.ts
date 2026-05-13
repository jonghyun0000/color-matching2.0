export type Mode = 'daily' | 'campus' | 'date' | 'interview' | 'formal' | 'street'

export type ColorFamily =
  | 'white' | 'beige' | 'brown' | 'khaki' | 'gray' | 'black'
  | 'navy' | 'blue' | 'denim' | 'pink' | 'red' | 'green'
  | 'yellow' | 'purple'

export interface ColorEntry {
  id: string
  name: string
  nameEn: string
  hex: string
  family: ColorFamily
  isNeutral: boolean
  isBasic: boolean
  modes: Mode[]
}

export interface ColorInfo {
  hex: string
  name: string
  hsl: { h: number; s: number; l: number }
}

export type ItemType = 'top' | 'bottom'
