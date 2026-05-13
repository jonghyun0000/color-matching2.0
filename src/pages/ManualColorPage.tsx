import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '@/components/ui/PageHeader'
import { COLOR_DICTIONARY } from '@/constants/colors'
import type { ColorEntry, ColorFamily, ItemType } from '@/types/color'

const FAMILY_GROUPS: { id: ColorFamily | 'all'; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'white', label: '화이트' },
  { id: 'beige', label: '베이지' },
  { id: 'brown', label: '브라운' },
  { id: 'khaki', label: '카키' },
  { id: 'gray', label: '그레이' },
  { id: 'black', label: '블랙' },
  { id: 'navy', label: '네이비' },
  { id: 'denim', label: '데님' },
  { id: 'pink', label: '핑크' },
  { id: 'red', label: '레드' },
  { id: 'green', label: '그린' },
  { id: 'yellow', label: '옐로' },
  { id: 'purple', label: '퍼플' },
]

export default function ManualColorPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initialType = (params.get('type') ?? 'top') as ItemType

  const [itemType, setItemType] = useState<ItemType>(initialType)
  const [filter, setFilter] = useState<ColorFamily | 'all'>('all')

  const colors = filter === 'all'
    ? COLOR_DICTIONARY
    : COLOR_DICTIONARY.filter((c) => c.family === filter || (filter === 'blue' && c.family === 'blue'))

  const handleSelect = (c: ColorEntry) => {
    navigate(`/result?hex=${encodeURIComponent(c.hex)}&type=${itemType}`)
  }

  return (
    <div className="device-frame">
      <PageHeader title="색 직접 고르기" />

      <main className="px-5 py-6">
        {/* 상하의 토글 */}
        <p className="text-xs font-medium text-gray-500 mb-3">어느 옷의 색인가요?</p>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
          {(['top', 'bottom'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setItemType(t)}
              className={`flex-1 h-11 rounded-lg text-sm font-semibold transition ${
                itemType === t ? 'bg-white text-brand shadow-sm' : 'text-gray-500'
              }`}
            >
              {t === 'top' ? '상의' : '하의'}
            </button>
          ))}
        </div>

        {/* family 필터 */}
        <div className="-mx-5 px-5 mb-5">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {FAMILY_GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => setFilter(g.id)}
                className={`shrink-0 h-8 px-3 rounded-full text-xs font-medium transition ${
                  filter === g.id ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* 색 그리드 */}
        <div className="grid grid-cols-4 gap-3">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c)}
              className="text-center group"
            >
              <div
                className="w-full aspect-square rounded-xl border border-gray-100 shadow-sm mb-1.5 group-hover:scale-95 group-active:scale-90 transition-transform"
                style={{ backgroundColor: c.hex }}
              />
              <p className="text-[11px] font-medium truncate px-0.5">{c.name}</p>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          총 {COLOR_DICTIONARY.length}개 색상 · 색을 누르면 바로 추천이 시작돼요
        </p>
      </main>
    </div>
  )
}
