import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RotateCcw, Palette, Loader2 } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { extractColors } from '@/lib/color/extract'
import type { ColorInfo, ItemType } from '@/types/color'

export default function ExtractPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const itemType = (params.get('type') ?? 'top') as ItemType

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [colors, setColors] = useState<ColorInfo[]>([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dataUrl = sessionStorage.getItem('@dduckddak/temp-image')
    if (!dataUrl) {
      navigate('/upload', { replace: true })
      return
    }
    setImageUrl(dataUrl)

    const start = Date.now()
    extractColors(dataUrl, 5)
      .then((result) => {
        const remaining = Math.max(0, 700 - (Date.now() - start))
        setTimeout(() => {
          setColors(result.slice(0, 3))
          setLoading(false)
        }, remaining)
      })
      .catch(() => setLoading(false))
  }, [navigate])

  const handleConfirm = () => {
    const sel = colors[selectedIdx]
    if (!sel) return
    navigate(`/result?hex=${encodeURIComponent(sel.hex)}&type=${itemType}`)
  }

  return (
    <div className="device-frame pb-24">
      <PageHeader title="색상 분석" />

      <main className="px-5 py-6">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-6">
          {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover" />}
        </div>

        <p className="text-xs font-medium text-gray-500 mb-3">
          {itemType === 'top' ? '상의' : '하의'}에서 추출한 대표 색상
        </p>

        {loading ? (
          <div className="h-32 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p className="text-sm">색상 분석 중...</p>
          </div>
        ) : colors.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-sm text-gray-400">
            색을 추출하지 못했습니다
          </div>
        ) : (
          <div className="flex gap-3 mb-6 pt-2">
            {colors.map((c, i) => (
              <button
                key={c.hex + i}
                onClick={() => setSelectedIdx(i)}
                className={`flex-1 text-center transition-all ${
                  i === selectedIdx ? 'scale-[1.03]' : 'opacity-55'
                }`}
                style={{ transformOrigin: 'center bottom' }}
              >
                <div
                  className={`w-full aspect-square rounded-2xl border-2 mb-2 ${
                    i === selectedIdx ? 'border-brand' : 'border-gray-100'
                  }`}
                  style={{ background: c.hex }}
                />
                <p className="text-xs font-semibold truncate">{c.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{c.hex}</p>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => navigate('/upload')}
            className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            다시 찍기
          </button>
          <button
            onClick={() => navigate(`/manual-color?type=${itemType}`)}
            className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold flex items-center justify-center gap-1.5"
          >
            <Palette className="w-4 h-4" />
            직접 고르기
          </button>
        </div>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100">
        <div className="px-5 py-3">
          <button
            onClick={handleConfirm}
            disabled={loading || colors.length === 0}
            className="w-full h-12 rounded-xl bg-brand text-white font-semibold text-sm disabled:opacity-40"
          >
            {loading ? '분석 중...' : '이 색으로 추천받기'}
          </button>
        </div>
      </footer>
    </div>
  )
}
