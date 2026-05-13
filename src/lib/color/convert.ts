export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }

export function normalizeHex(hex: string): string {
  if (!hex) return '#000000'
  let h = hex.trim().replace('#', '').toUpperCase()
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  if (!/^[0-9A-F]{6}$/.test(h)) return '#000000'
  return `#${h}`
}

export function hexToRgb(hex: string): RGB {
  const h = normalizeHex(hex).slice(1)
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }: RGB): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const R = r / 255, G = g / 255, B = b / 255
  const max = Math.max(R, G, B), min = Math.min(R, G, B)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case R: h = ((G - B) / d + (G < B ? 6 : 0)) * 60; break
      case G: h = ((B - R) / d + 2) * 60; break
      case B: h = ((R - G) / d + 4) * 60; break
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const H = ((h % 360) + 360) % 360 / 360
  const S = Math.max(0, Math.min(100, s)) / 100
  const L = Math.max(0, Math.min(100, l)) / 100
  if (S === 0) {
    const v = Math.round(L * 255)
    return { r: v, g: v, b: v }
  }
  const q = L < 0.5 ? L * (1 + S) : L + S - L * S
  const p = 2 * L - q
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return {
    r: Math.round(hue2rgb(H + 1 / 3) * 255),
    g: Math.round(hue2rgb(H) * 255),
    b: Math.round(hue2rgb(H - 1 / 3) * 255),
  }
}

export function hexToHsl(hex: string): HSL { return rgbToHsl(hexToRgb(hex)) }
export function hslToHex(hsl: HSL): string { return rgbToHex(hslToRgb(hsl)) }

export function hslDistance(a: HSL, b: HSL): number {
  const dh = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h)) / 180
  const ds = (a.s - b.s) / 100
  const dl = (a.l - b.l) / 100
  return Math.sqrt(dh * dh + ds * ds + dl * dl)
}
