import type { Material } from '@/types/material'
import type { Mode } from '@/types/color'

export interface MaterialInfo {
  id: Material
  label: string
  modes: Mode[]
}

export const MATERIALS: MaterialInfo[] = [
  { id: 'cotton',   label: '면',         modes: ['daily','campus','date','interview','formal'] },
  { id: 'denim',    label: '데님',       modes: ['daily','campus','date','street'] },
  { id: 'knit',     label: '니트',       modes: ['daily','campus','date','formal'] },
  { id: 'slacks',   label: '슬랙스',     modes: ['interview','formal','date','campus'] },
  { id: 'shirt',    label: '셔츠',       modes: ['daily','campus','date','interview','formal'] },
  { id: 'hoodie',   label: '후드/맨투맨', modes: ['daily','campus','street'] },
  { id: 'leather',  label: '가죽',       modes: ['date','street','formal'] },
  { id: 'corduroy', label: '코듀로이',   modes: ['daily','campus','date'] },
]

export const MATERIAL_MAP = Object.fromEntries(MATERIALS.map(m => [m.id, m])) as Record<Material, MaterialInfo>

export const MATERIAL_PAIRS: Record<Material, Record<Material, number>> = {
  cotton:   { cotton: 6, denim: 10, knit: 5, slacks: 8, shirt: 6, hoodie: 5, leather: 7, corduroy: 8 },
  denim:    { cotton: 9, denim: 4,  knit: 8, slacks: 5, shirt: 9, hoodie: 9, leather: 7, corduroy: 6 },
  knit:     { cotton: 7, denim: 9,  knit: 4, slacks: 10, shirt: 6, hoodie: 4, leather: 8, corduroy: 9 },
  slacks:   { cotton: 8, denim: 5,  knit: 9, slacks: 3, shirt: 10, hoodie: 4, leather: 7, corduroy: 7 },
  shirt:    { cotton: 8, denim: 10, knit: 7, slacks: 10, shirt: 4, hoodie: 5, leather: 7, corduroy: 8 },
  hoodie:   { cotton: 7, denim: 10, knit: 5, slacks: 4, shirt: 5, hoodie: 4, leather: 6, corduroy: 7 },
  leather:  { cotton: 8, denim: 9,  knit: 8, slacks: 7, shirt: 7, hoodie: 6, leather: 4, corduroy: 7 },
  corduroy: { cotton: 8, denim: 6,  knit: 9, slacks: 7, shirt: 8, hoodie: 7, leather: 6, corduroy: 4 },
}

export function recommendMaterials(
  baseMaterial: Material,
  mode: Mode,
  n: number = 2
): Material[] {
  const pairs = MATERIAL_PAIRS[baseMaterial]
  return (Object.entries(pairs) as [Material, number][])
    .map(([m, score]) => {
      const info = MATERIAL_MAP[m]
      const bonus = info.modes.includes(mode) ? 2 : -2
      return { material: m, total: score + bonus }
    })
    .filter(({ material }) => material !== baseMaterial || pairs[baseMaterial] >= 7)
    .sort((a, b) => b.total - a.total)
    .slice(0, n)
    .map(x => x.material)
}
