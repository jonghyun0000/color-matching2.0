import type { ColorFamily } from '@/types/color'

export const FASHION_PAIRS: Record<ColorFamily, string[]> = {
  white: ['navy','navy-deep','denim','denim-dark','black','beige','camel','brown-cocoa','gray-charcoal','khaki'],
  beige: ['white-off','ivory','brown-cocoa','navy','navy-deep','black','denim-dark','khaki','gray-charcoal'],
  brown: ['ivory','cream','beige-light','beige','white-off','navy','denim-dark','green-sage'],
  khaki: ['white-off','ivory','beige','brown-cocoa','black','denim-dark','gray-charcoal'],
  gray: ['white-pure','white-off','black','navy','navy-deep','denim-dark','pink-dusty','red-wine'],
  black: ['white-pure','white-off','ivory','gray','gray-light','beige','denim-light','khaki','red-wine'],
  navy: ['white-pure','white-off','ivory','beige','beige-light','gray-light','camel','brown-cocoa','denim-faded'],
  blue: ['white-off','ivory','beige','gray-light','navy-deep','denim-dark'],
  denim: ['white-pure','white-off','ivory','beige','camel','brown-cocoa','black','gray-charcoal','khaki','navy-deep'],
  pink: ['white-off','ivory','gray-light','gray','denim-dark','navy','beige'],
  red: ['white-off','ivory','black','navy-deep','gray-charcoal','beige'],
  green: ['ivory','beige','brown-cocoa','white-off','denim-dark','gray-charcoal'],
  yellow: ['white-off','denim','denim-dark','navy','gray-charcoal','black','brown-cocoa'],
  purple: ['white-off','ivory','gray-light','gray-charcoal','black','denim-dark'],
}

/** BARUSA 검증 페어 */
export const BARUSA_PAIRS: Record<string, string[]> = {
  'red-wine': ['navy','black','beige','mustard'],
  'red-burgundy': ['navy','black','beige','mustard'],
  'navy': ['beige','denim-light','khaki','teal-deep'],
  'navy-deep': ['beige','denim-light','khaki','teal-deep'],
  'gray-mid': ['black','navy','pink-blush','gray-charcoal'],
  'gray': ['black','navy','pink-blush','gray-charcoal'],
  'green-forest': ['gray-light','denim-light','yellow-butter-pale','black'],
  'green-dark': ['gray-light','denim-light','yellow-butter-pale','black'],
  'khaki': ['navy','black','denim-light','orange-vivid'],
  'olive': ['navy','black','denim-light','orange-vivid'],
  'denim-light': ['gray-charcoal','gray-light','navy','red-wine'],
  'denim-faded': ['gray-charcoal','gray-light','navy','red-wine'],
  'brown-mocha': ['beige','navy','black','pink-blush'],
  'brown-cocoa': ['beige','navy','black','pink-blush'],
  'purple-dark': ['olive','gray-light','black','mustard'],
  'yellow-light': ['denim-light','gray-light','brown-cocoa','orange-vivid'],
  'yellow-butter-pale': ['denim-light','gray-light','brown-cocoa','orange-vivid'],
}

export const SAFE_ANCHORS = ['navy','black','beige','gray-light']
