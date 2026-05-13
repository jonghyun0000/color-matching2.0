import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, X } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { getFavorites, removeFavorite, type Favorite } from '@/lib/storage/favorites'
import { MODE_MAP } from '@/constants/modes'
import { MODE_ICONS } from '@/constants/modeIcons'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Favorite[]>([])

  useEffect(() => { setItems(getFavorites()) }, [])

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('이 즐겨찾기를 삭제할까요?')) return
    removeFavorite(id)
    setItems(getFavorites())
  }

  if (items.length === 0) {
    return (
      <div>
        <header className="px-5 pt-8 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">즐겨찾기</h1>
        </header>
        <EmptyState
          icon={Heart}
          title="아직 즐겨찾기가 없어요"
          description="마음에 드는 색 조합을 저장하고 다음 코디 때 다시 꺼내 쓰세요."
          action={{ label: '추천 받으러 가기', onClick: () => navigate('/') }}
        />
      </div>
    )
  }

  return (
    <div>
      <header className="px-5 pt-8 pb-4 flex items-end justify-between">
        <h1 className="text-2xl font-bold tracking-tight">즐겨찾기</h1>
        <p className="text-xs text-gray-400">{items.length}개</p>
      </header>

      <main className="px-5 pb-8">
        <div className="grid grid-cols-2 gap-3">
          {items.map((f) => {
            const ModeIcon = MODE_ICONS[f.mode]
            return (
              <button
                key={f.id}
                onClick={() => navigate(`/result?hex=${encodeURIComponent(f.baseColor.hex)}&type=${f.itemType}&mode=${f.mode}`)}
                className="text-left bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition relative group"
              >
                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => handleRemove(f.id, e)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3.5 h-3.5 text-gray-600" />
                </button>

                {/* 색 미리보기 */}
                <div className="flex h-28">
                  <div className="flex-1" style={{ background: f.baseColor.hex }} />
                  <div className="flex-1" style={{ background: f.pickedColor.hex }} />
                </div>

                {/* 정보 */}
                <div className="p-3">
                  <p className="text-xs font-semibold truncate">
                    {f.baseColor.name} + {f.pickedColor.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ModeIcon className="w-3 h-3 text-gray-400" />
                    <p className="text-[10.5px] text-gray-500">
                      {MODE_MAP[f.mode].label} · {f.itemType === 'top' ? '상의 기준' : '하의 기준'}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
