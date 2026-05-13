import type { ColorEntry, Mode } from '@/types/color'

export const COLOR_DICTIONARY: ColorEntry[] = [
  // 화이트 (4)
  { id: 'white-pure', name: '퓨어 화이트', nameEn: 'Pure White', hex: '#FFFFFF', family: 'white', isNeutral: true, isBasic: true, modes: ['daily','campus','date','interview','formal'] },
  { id: 'white-off', name: '오프 화이트', nameEn: 'Off White', hex: '#F8F6F1', family: 'white', isNeutral: true, isBasic: true, modes: ['daily','campus','date','interview','formal'] },
  { id: 'ivory', name: '아이보리', nameEn: 'Ivory', hex: '#F2EAD7', family: 'white', isNeutral: true, isBasic: true, modes: ['daily','campus','date','formal'] },
  { id: 'cream', name: '크림', nameEn: 'Cream', hex: '#EFE4CC', family: 'white', isNeutral: true, isBasic: false, modes: ['daily','date','campus'] },
  // 베이지 (5)
  { id: 'beige-light', name: '라이트 베이지', nameEn: 'Light Beige', hex: '#E5D2B5', family: 'beige', isNeutral: true, isBasic: true, modes: ['daily','campus','date','formal'] },
  { id: 'beige', name: '베이지', nameEn: 'Beige', hex: '#D4B895', family: 'beige', isNeutral: true, isBasic: true, modes: ['daily','campus','date','formal'] },
  { id: 'sand', name: '샌드 베이지', nameEn: 'Sand Beige', hex: '#C5A878', family: 'beige', isNeutral: true, isBasic: false, modes: ['daily','campus','date'] },
  { id: 'camel', name: '카멜', nameEn: 'Camel', hex: '#A07758', family: 'beige', isNeutral: false, isBasic: true, modes: ['daily','date','formal'] },
  { id: 'tan', name: '탠', nameEn: 'Tan', hex: '#B68B5C', family: 'beige', isNeutral: false, isBasic: false, modes: ['daily','campus','street'] },
  // 브라운 (5)
  { id: 'brown-mocha', name: '모카 브라운', nameEn: 'Mocha Brown', hex: '#8B6F4E', family: 'brown', isNeutral: false, isBasic: true, modes: ['daily','date','formal'] },
  { id: 'brown-cocoa', name: '코코아 브라운', nameEn: 'Cocoa Brown', hex: '#6B4F35', family: 'brown', isNeutral: false, isBasic: true, modes: ['daily','date','formal','street'] },
  { id: 'brown-chocolate', name: '초콜릿 브라운', nameEn: 'Chocolate Brown', hex: '#5C3A21', family: 'brown', isNeutral: false, isBasic: true, modes: ['daily','date','formal','street'] },
  { id: 'brown-dark', name: '다크 브라운', nameEn: 'Dark Brown', hex: '#3F2A18', family: 'brown', isNeutral: false, isBasic: false, modes: ['daily','formal','street'] },
  { id: 'brown-espresso', name: '에스프레소', nameEn: 'Espresso', hex: '#2E1F12', family: 'brown', isNeutral: false, isBasic: false, modes: ['formal','street'] },
  // 카키 (4)
  { id: 'khaki-light', name: '라이트 카키', nameEn: 'Light Khaki', hex: '#9B9466', family: 'khaki', isNeutral: false, isBasic: true, modes: ['daily','campus','street'] },
  { id: 'khaki', name: '카키', nameEn: 'Khaki', hex: '#6B6A41', family: 'khaki', isNeutral: false, isBasic: true, modes: ['daily','campus','street'] },
  { id: 'olive', name: '올리브', nameEn: 'Olive', hex: '#556B2F', family: 'khaki', isNeutral: false, isBasic: false, modes: ['campus','street','daily'] },
  { id: 'khaki-dark', name: '다크 카키', nameEn: 'Dark Khaki', hex: '#3D3D24', family: 'khaki', isNeutral: false, isBasic: false, modes: ['street','daily'] },
  // 그레이 (5)
  { id: 'gray-light', name: '라이트 그레이', nameEn: 'Light Gray', hex: '#E0E0E0', family: 'gray', isNeutral: true, isBasic: true, modes: ['daily','campus','date','interview','formal'] },
  { id: 'gray', name: '연 그레이', nameEn: 'Soft Gray', hex: '#C4C4C4', family: 'gray', isNeutral: true, isBasic: true, modes: ['daily','campus','date','interview','formal'] },
  { id: 'gray-mid', name: '미디엄 그레이', nameEn: 'Medium Gray', hex: '#8A8F95', family: 'gray', isNeutral: true, isBasic: true, modes: ['daily','campus','interview','formal','street'] },
  { id: 'gray-charcoal', name: '차콜 그레이', nameEn: 'Charcoal Gray', hex: '#4A4A4A', family: 'gray', isNeutral: true, isBasic: true, modes: ['daily','interview','formal','street'] },
  { id: 'gray-dark', name: '다크 차콜', nameEn: 'Dark Charcoal', hex: '#2E2E2E', family: 'gray', isNeutral: true, isBasic: true, modes: ['interview','formal','street'] },
  // 블랙 (2)
  { id: 'black', name: '블랙', nameEn: 'Black', hex: '#1A1A1A', family: 'black', isNeutral: true, isBasic: true, modes: ['daily','campus','date','interview','formal','street'] },
  { id: 'black-ink', name: '잉크 블랙', nameEn: 'Ink Black', hex: '#0A0A0A', family: 'black', isNeutral: true, isBasic: true, modes: ['interview','formal','street'] },
  // 네이비 (4)
  { id: 'navy-deep', name: '딥 네이비', nameEn: 'Deep Navy', hex: '#0B1F3A', family: 'navy', isNeutral: true, isBasic: true, modes: ['daily','campus','date','interview','formal'] },
  { id: 'navy', name: '네이비', nameEn: 'Navy', hex: '#1B2A49', family: 'navy', isNeutral: true, isBasic: true, modes: ['daily','campus','date','interview','formal'] },
  { id: 'navy-mid', name: '미디엄 네이비', nameEn: 'Medium Navy', hex: '#2E4172', family: 'navy', isNeutral: false, isBasic: true, modes: ['daily','campus','date','formal'] },
  { id: 'cobalt', name: '코발트 블루', nameEn: 'Cobalt Blue', hex: '#2D4F8E', family: 'blue', isNeutral: false, isBasic: false, modes: ['campus','street','daily'] },
  // 데님 (4)
  { id: 'denim-light', name: '라이트 데님', nameEn: 'Light Denim', hex: '#8FA5BD', family: 'denim', isNeutral: false, isBasic: true, modes: ['daily','campus','date'] },
  { id: 'denim', name: '데님 블루', nameEn: 'Denim Blue', hex: '#4A6B8A', family: 'denim', isNeutral: false, isBasic: true, modes: ['daily','campus','date','street'] },
  { id: 'denim-dark', name: '다크 데님', nameEn: 'Dark Denim', hex: '#2E4259', family: 'denim', isNeutral: false, isBasic: true, modes: ['daily','campus','date','formal','street'] },
  { id: 'denim-faded', name: '페이디드 데님', nameEn: 'Faded Denim', hex: '#9DB1C5', family: 'denim', isNeutral: false, isBasic: false, modes: ['daily','campus','street'] },
  // 핑크/레드 (5)
  { id: 'pink-dusty', name: '더스티 핑크', nameEn: 'Dusty Pink', hex: '#D4A5A5', family: 'pink', isNeutral: false, isBasic: false, modes: ['date','daily','campus'] },
  { id: 'pink-blush', name: '블러쉬 핑크', nameEn: 'Blush Pink', hex: '#E8C5C0', family: 'pink', isNeutral: false, isBasic: false, modes: ['date','daily'] },
  { id: 'coral', name: '코랄', nameEn: 'Coral', hex: '#E89C8E', family: 'pink', isNeutral: false, isBasic: false, modes: ['date','campus','daily'] },
  { id: 'red-wine', name: '와인', nameEn: 'Wine', hex: '#6F2A35', family: 'red', isNeutral: false, isBasic: false, modes: ['date','formal','street'] },
  { id: 'red-burgundy', name: '버건디', nameEn: 'Burgundy', hex: '#4F1F26', family: 'red', isNeutral: false, isBasic: false, modes: ['date','formal','street'] },
  // 그린 (3)
  { id: 'green-sage', name: '세이지 그린', nameEn: 'Sage Green', hex: '#94A084', family: 'green', isNeutral: false, isBasic: false, modes: ['daily','campus','date'] },
  { id: 'green-forest', name: '포레스트 그린', nameEn: 'Forest Green', hex: '#2F4F3F', family: 'green', isNeutral: false, isBasic: false, modes: ['daily','campus','street'] },
  { id: 'green-dark', name: '다크 그린', nameEn: 'Dark Green', hex: '#1F3A2E', family: 'green', isNeutral: false, isBasic: false, modes: ['formal','street'] },
  // 옐로 (3)
  { id: 'mustard', name: '머스타드', nameEn: 'Mustard', hex: '#C9A227', family: 'yellow', isNeutral: false, isBasic: false, modes: ['campus','street','daily'] },
  { id: 'mustard-dark', name: '다크 머스타드', nameEn: 'Dark Mustard', hex: '#8F721B', family: 'yellow', isNeutral: false, isBasic: false, modes: ['street','daily'] },
  { id: 'yellow-light', name: '버터 옐로우', nameEn: 'Butter Yellow', hex: '#E8D88C', family: 'yellow', isNeutral: false, isBasic: false, modes: ['date','daily','campus'] },
  // 퍼플 (2)
  { id: 'lavender', name: '라벤더', nameEn: 'Lavender', hex: '#B8A5C7', family: 'purple', isNeutral: false, isBasic: false, modes: ['date','daily'] },
  { id: 'purple-dark', name: '다크 퍼플', nameEn: 'Dark Purple', hex: '#3E2A4F', family: 'purple', isNeutral: false, isBasic: false, modes: ['street','formal'] },
  // BARUSA 보강 (3)
  { id: 'teal-deep', name: '딥 틸', nameEn: 'Deep Teal', hex: '#187768', family: 'green', isNeutral: false, isBasic: false, modes: ['date','campus','street'] },
  { id: 'orange-vivid', name: '비비드 오렌지', nameEn: 'Vivid Orange', hex: '#F9852C', family: 'yellow', isNeutral: false, isBasic: false, modes: ['street','campus'] },
  { id: 'yellow-butter-pale', name: '페일 버터', nameEn: 'Pale Butter', hex: '#F1E7AD', family: 'yellow', isNeutral: false, isBasic: false, modes: ['date','daily'] },
]

export const NEUTRAL_PALETTE = COLOR_DICTIONARY.filter(c => c.isNeutral && c.isBasic)
export const BASIC_PALETTE = COLOR_DICTIONARY.filter(c => c.isBasic)
export const COLOR_MAP: Record<string, ColorEntry> = Object.fromEntries(COLOR_DICTIONARY.map(c => [c.id, c]))
export const colorsByMode = (mode: Mode) => COLOR_DICTIONARY.filter(c => c.modes.includes(mode))
