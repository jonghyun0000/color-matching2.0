import { Link, useNavigate } from 'react-router-dom'
import { Camera, Image as ImageIcon, Palette, Settings as SettingsIcon, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getHistory, type HistoryItem } from '@/lib/storage/history'

export default function HomePage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    setHistory(getHistory().slice(0, 4))
  }, [])

  return (
    <div>
      <header className="px-5 pt-8 pb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand">뚝딱</h1>
          <p className="text-sm text-gray-500 mt-1">오늘 입을 옷, 색 조합까지 뚝딱</p>
        </div>
        <Link to="/settings" className="p-2 -mr-2 text-gray-500">
          <SettingsIcon className="w-5 h-5" />
        </Link>
      </header>

      <main className="px-5">
        {/* 메인 액션 */}
        <section className="grid grid-cols-2 gap-3 mb-3">
          <MainCard
            icon={<Camera className="w-6 h-6" />}
            title="사진 찍기"
            sub="카메라로 바로"
            onClick={() => navigate('/upload?action=camera')}
          />
          <MainCard
            icon={<ImageIcon className="w-6 h-6" />}
            title="갤러리"
            sub="저장된 사진"
            onClick={() => navigate('/upload?action=gallery')}
          />
        </section>

        <button
          onClick={() => navigate('/manual-color')}
          className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center gap-3 mb-8 transition"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand">
            <Palette className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">색 직접 고르기</p>
            <p className="text-xs text-gray-500 mt-0.5">사진 없이 색만 선택</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* 최근 기록 */}
        {history.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500">최근 분석</p>
              <Link to="/history" className="text-xs text-brand font-semibold">
                전체보기
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
              {history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => navigate(`/result?hex=${encodeURIComponent(h.baseColor.hex)}&type=${h.itemType}&mode=${h.mode}`)}
                  className="shrink-0 w-24 text-center"
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 mb-2">
                    <div className="absolute inset-0 flex">
                      <div className="flex-1" style={{ background: h.baseColor.hex }} />
                      {h.topPickHex && (
                        <div className="flex-1" style={{ background: h.topPickHex }} />
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] font-medium truncate">{h.baseColor.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {h.itemType === 'top' ? '상의' : '하의'}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 시작 가이드 (기록 없을 때만) */}
        {history.length === 0 && (
          <section className="p-5 bg-gray-50 rounded-2xl mb-8">
            <p className="text-sm font-semibold mb-2">처음이신가요?</p>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              옷 사진을 한 장만 올리면<br />
              어울리는 상하의 색을 추천해드려요.
            </p>
            <button
              onClick={() => navigate('/upload?action=gallery')}
              className="h-9 px-4 rounded-full bg-brand text-white text-xs font-semibold"
            >
              시작하기
            </button>
          </section>
        )}
      </main>
    </div>
  )
}

function MainCard({ icon, title, sub, onClick }: {
  icon: React.ReactNode; title: string; sub: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="aspect-square bg-gray-50 hover:bg-gray-100 rounded-2xl p-5 flex flex-col items-start justify-between transition text-left"
    >
      <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-brand">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
      </div>
    </button>
  )
}
