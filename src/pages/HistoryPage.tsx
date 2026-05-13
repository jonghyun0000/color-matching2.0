import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, X } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { getHistory, removeHistory, clearHistory, type HistoryItem } from '@/lib/storage/history'
import { MODE_MAP } from '@/constants/modes'
import { MODE_ICONS } from '@/constants/modeIcons'

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diff = (now.getTime() - ts) / 1000
  if (diff < 60) return '방금 전'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  const dayDiff = Math.floor(diff / 86400)
  if (dayDiff < 7) return `${dayDiff}일 전`
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<HistoryItem[]>([])

  useEffect(() => { setItems(getHistory()) }, [])

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeHistory(id)
    setItems(getHistory())
  }

  const handleClearAll = () => {
    if (!confirm('모든 분석 기록을 삭제할까요?')) return
    clearHistory()
    setItems([])
  }

  if (items.length === 0) {
    return (
      <div>
        <header className="px-5 pt-8 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">최근 기록</h1>
        </header>
        <EmptyState
          icon={Clock}
          title="아직 분석 기록이 없어요"
          description="옷 사진을 분석하면 여기에 자동으로 저장됩니다."
          action={{ label: '분석 시작하기', onClick: () => navigate('/upload?action=gallery') }}
        />
      </div>
    )
  }

  return (
    <div>
      <header className="px-5 pt-8 pb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">최근 기록</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length}개 · 최대 50개 저장</p>
        </div>
        <button
          onClick={handleClearAll}
          className="text-xs text-gray-500 hover:text-red-500 transition"
        >
          전체 삭제
        </button>
      </header>

      <main className="px-5 pb-8">
        <div className="space-y-2">
          {items.map((h) => {
            const ModeIcon = MODE_ICONS[h.mode]
            return (
              <button
                key={h.id}
                onClick={() => navigate(`/result?hex=${encodeURIComponent(h.baseColor.hex)}&type=${h.itemType}&mode=${h.mode}`)}
                className="w-full bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-3 hover:shadow-md transition text-left group"
              >
                {/* 색 미리보기 */}
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 shrink-0 flex">
                  <div className="flex-1" style={{ background: h.baseColor.hex }} />
                  {h.topPickHex && (
                    <div className="flex-1" style={{ background: h.topPickHex }} />
                  )}
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{h.baseColor.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ModeIcon className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {h.itemType === 'top' ? '상의' : '하의'} · {MODE_MAP[h.mode].label}
                    </p>
                  </div>
                  <p className="text-[10.5px] text-gray-400 mt-0.5">{formatDate(h.createdAt)}</p>
                </div>

                {/* 삭제 */}
                <button
                  onClick={(e) => handleRemove(h.id, e)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
