import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Heart, Share2, Pencil, Camera, Palette, ArrowLeftRight, X, Lightbulb } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { recommendColors, averageScore } from '@/lib/color/recommend'
import { MODES, MODE_MAP } from '@/constants/modes'
import { MODE_ICONS } from '@/constants/modeIcons'
import { MATERIALS, MATERIAL_MAP } from '@/constants/materials'
import { buildMaterialHint } from '@/constants/reasonTemplates'
import { addFavorite, removeFavorite, isFavorited, findFavorite } from '@/lib/storage/favorites'
import { addHistory } from '@/lib/storage/history'
import { captureAndShare } from '@/lib/share'
import type { ItemType, Mode } from '@/types/color'
import type { Material } from '@/types/material'

export default function ResultPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const baseHex = params.get('hex') ?? '#1B2A49'
  const initialItemType = (params.get('type') ?? 'top') as ItemType
  const initialMode: Mode = MODES.find(m => m.id === params.get('mode'))?.id ?? 'daily'

  const [mode, setMode] = useState<Mode>(initialMode)
  const [itemType, setItemType] = useState<ItemType>(initialItemType)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [favored, setFavored] = useState(false)
  const [baseMaterial, setBaseMaterial] = useState<Material | undefined>()
  const [sheet, setSheet] = useState<'none' | 'base' | 'material'>('none')

  const captureRef = useRef<HTMLDivElement>(null)

  const result = useMemo(
    () => recommendColors(baseHex, mode, baseMaterial),
    [baseHex, mode, baseMaterial]
  )
  const selected = result.recommendations[selectedIdx]
  const targetLabel = itemType === 'top' ? '하의' : '상의'
  const avg = averageScore(result)
  const materialHint = buildMaterialHint(baseMaterial, result.recommendedMaterials, itemType)
  const ModeIcon = MODE_ICONS[mode]

  // 즐겨찾기 상태 sync
  useEffect(() => {
    if (selected) {
      setFavored(isFavorited(baseHex, selected.color.hex, mode))
    }
  }, [baseHex, selected, mode])

  // 모드 바뀌면 선택 초기화
  useEffect(() => { setSelectedIdx(0) }, [mode])

  // 페이지 진입 시 history에 추가 (한 번만)
  useEffect(() => {
    const top = result.recommendations[0]
    if (top) {
      addHistory({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        itemType,
        baseColor: result.base,
        mode,
        topPickHex: top.color.hex,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFavorite = () => {
    if (!selected) return
    if (favored) {
      const fav = findFavorite(baseHex, selected.color.hex, mode)
      if (fav) removeFavorite(fav.id)
      setFavored(false)
    } else {
      addFavorite({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        itemType,
        baseColor: result.base,
        pickedColor: selected.color,
        mode,
      })
      setFavored(true)
    }
  }

  const handleShare = async () => {
    if (!captureRef.current || !selected) return
    await captureAndShare(
      captureRef.current,
      `dduckddak-${Date.now()}.png`,
      '뚝딱 코디 추천',
      `${result.base.name} + ${selected.color.name} (${selected.score}점)`
    )
  }

  return (
    <div className="device-frame pb-24">
      <PageHeader
        title="추천 결과"
        right={
          <>
            <button onClick={handleFavorite} className="p-2" aria-label="즐겨찾기">
              <Heart className={`w-5 h-5 transition ${favored ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
            </button>
            <button onClick={handleShare} className="-mr-2 p-2" aria-label="공유">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </>
        }
      />

      <main>
        <div ref={captureRef} className="px-5 py-6 bg-white">
          {/* 기준 색 카드 (탭 가능) */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium">내 {itemType === 'top' ? '상의' : '하의'}</p>
              <span className="text-[11px] text-brand font-semibold">탭해서 변경</span>
            </div>
            <button
              onClick={() => setSheet('base')}
              className="w-full flex items-center gap-4 -m-2 p-2 rounded-xl hover:bg-gray-50 transition text-left"
            >
              <div
                className="w-16 h-16 rounded-full border border-gray-200 shadow-sm shrink-0"
                style={{ backgroundColor: result.base.hex }}
              />
              <div className="flex-1">
                <p className="text-xl font-bold tracking-tight">{result.base.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{result.base.hex}</p>
              </div>
              <Pencil className="w-4 h-4 text-gray-400 shrink-0" />
            </button>
          </section>

          {/* 점수 헤더 */}
          <section className="mb-3">
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">추천 {targetLabel}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <ModeIcon className="w-3 h-3" strokeWidth={2} />
                  {MODE_MAP[mode].label} 모드
                </p>
              </div>
              <p className="text-3xl font-bold text-brand leading-none">
                {avg}<span className="text-sm font-medium text-gray-400 ml-0.5">점</span>
              </p>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-500"
                style={{ width: `${avg}%` }}
              />
            </div>
          </section>

          {/* 재질 칩 */}
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">점수는 색 조합 규칙을 적용한 참고값이며, 정확도나 만족 확률을 뜻하지 않아요.</p>
          <div className="flex gap-1.5 mb-4 mt-3">
            <button
              onClick={() => setSheet('material')}
              className={`h-7 px-3 rounded-full text-xs font-medium transition ${
                baseMaterial
                  ? 'bg-brand/10 text-brand font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {baseMaterial
                ? MATERIAL_MAP[baseMaterial].label
                : `+ ${itemType === 'top' ? '상의' : '하의'} 재질 선택`}
            </button>
          </div>

          {/* 추천 색 스트립 */}
          <section className="-mx-5 px-5 mb-5">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1.5">
              {result.recommendations.map((rec, i) => (
                <button
                  key={rec.entryId}
                  onClick={() => setSelectedIdx(i)}
                  className={`shrink-0 w-[88px] text-center transition-all ${
                    i === selectedIdx ? 'scale-[1.04]' : 'opacity-55 hover:opacity-80'
                  }`}
                  style={{ transformOrigin: 'center bottom' }}
                >
                  <div
                    className={`w-20 h-20 mx-auto rounded-2xl border-2 mb-2 shadow-sm transition-colors ${
                      i === selectedIdx ? 'border-brand' : 'border-gray-100'
                    }`}
                    style={{ backgroundColor: rec.color.hex }}
                  />
                  <p className="text-xs font-semibold truncate px-1">{rec.color.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{rec.score}점</p>
                </button>
              ))}
            </div>
          </section>

          {/* 추천 이유 */}
          {selected && (
            <section className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                <p className="text-[11px] font-semibold text-gray-500">추천 이유</p>
              </div>
              <p className="text-sm leading-relaxed text-gray-800">{selected.reason}</p>
              {materialHint && (
                <p className="mt-2.5 pt-2.5 border-t border-dashed border-gray-200 text-xs leading-relaxed text-gray-600">
                  {materialHint}
                </p>
              )}
            </section>
          )}
        </div>

        {/* 모드 탭 */}
        <section className="px-5 mt-2">
          <p className="text-xs font-semibold text-gray-500 mb-3">상황별 추천</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {MODES.map((m) => {
              const Icon = MODE_ICONS[m.id]
              const active = mode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`shrink-0 h-9 px-3.5 rounded-full text-[13px] font-medium transition inline-flex items-center gap-1.5 ${
                    active ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  {m.label}
                </button>
              )
            })}
          </div>
        </section>
      </main>

      {/* 하단 액션 */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100">
        <div className="flex gap-2 px-5 py-3">
          <button
            onClick={handleFavorite}
            className="flex-1 h-12 rounded-xl border border-gray-200 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <Heart className={`w-4 h-4 ${favored ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favored ? '저장됨' : '즐겨찾기'}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 h-12 rounded-xl bg-brand text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-press transition"
          >
            <Share2 className="w-4 h-4" />
            공유하기
          </button>
        </div>
      </footer>

      {/* 기준 옷 변경 시트 */}
      <BottomSheet open={sheet === 'base'} onClose={() => setSheet('none')} title="기준 옷 변경">
        <SheetOption icon={<Camera className="w-5 h-5" />} label="사진 다시 찍기"
          onClick={() => { setSheet('none'); navigate('/upload') }} />
        <SheetOption icon={<Palette className="w-5 h-5" />} label="색 직접 고르기"
          onClick={() => { setSheet('none'); navigate(`/manual-color?type=${itemType}`) }} />
        <SheetOption icon={<ArrowLeftRight className="w-5 h-5" />}
          label={itemType === 'top'
            ? '상의 → 하의 분석 (현재) ↔ 하의 → 상의'
            : '하의 → 상의 분석 (현재) ↔ 상의 → 하의'}
          onClick={() => {
            setItemType(itemType === 'top' ? 'bottom' : 'top')
            setSelectedIdx(0)
            setSheet('none')
          }}
        />
      </BottomSheet>

      {/* 재질 선택 시트 */}
      <BottomSheet open={sheet === 'material'} onClose={() => setSheet('none')}
        title={`${itemType === 'top' ? '상의' : '하의'} 재질 선택`}>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {MATERIALS.map((m) => (
            <button
              key={m.id}
              onClick={() => { setBaseMaterial(m.id); setSheet('none') }}
              className={`h-14 px-4 rounded-xl text-left text-sm font-medium transition border-[1.5px] ${
                baseMaterial === m.id
                  ? 'bg-brand/10 border-brand text-brand font-semibold'
                  : 'bg-gray-50 border-transparent hover:bg-gray-100'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {baseMaterial && (
          <button
            onClick={() => { setBaseMaterial(undefined); setSheet('none') }}
            className="w-full h-11 mt-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-50"
          >
            재질 선택 해제
          </button>
        )}
      </BottomSheet>
    </div>
  )
}

/* ───────── 바텀시트 ───────── */
function BottomSheet({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end animate-fadein"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl px-5 pt-2 pb-5 animate-slideup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold tracking-tight">{title}</h3>
          <button onClick={onClose} className="-mr-2 p-1.5 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
      <style>{`
        @keyframes fadein { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideup { from { transform: translateY(100%) } to { transform: translateY(0) } }
        .animate-fadein { animation: fadein 0.2s ease }
        .animate-slideup { animation: slideup 0.25s ease }
      `}</style>
    </div>
  )
}

function SheetOption({ icon, label, onClick }: {
  icon: React.ReactNode; label: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-12 px-3 rounded-xl text-sm font-medium text-left flex items-center gap-3 hover:bg-gray-50 transition"
    >
      <span className="text-gray-500">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
