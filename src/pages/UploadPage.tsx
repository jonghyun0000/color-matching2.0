import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Camera, Image as ImageIcon, Palette, Info } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import type { ItemType } from '@/types/color'

export default function UploadPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [itemType, setItemType] = useState<ItemType>('top')
  const fileRef = useRef<HTMLInputElement>(null)
  const camRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [reading, setReading] = useState(false)

  // HomePage에서 'action=camera' 또는 'action=gallery'로 진입 시 자동 트리거
  useEffect(() => {
    const action = params.get('action')
    if (action === 'camera') camRef.current?.click()
    else if (action === 'gallery') fileRef.current?.click()
    // 한 번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setError('')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('JPG, PNG 또는 WebP 사진을 선택해 주세요. HEIC 사진은 JPG로 변환해 주세요.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('사진은 3MB 이하로 선택해 주세요. 크기를 줄이거나 색 직접 고르기를 이용할 수 있어요.')
      return
    }
    setReading(true)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        sessionStorage.setItem('@dduckddak/temp-image', reader.result as string)
        navigate(`/extract?type=${itemType}`)
      } catch {
        setError('사진을 임시 저장할 공간이 부족해요. 더 작은 사진이나 색 직접 고르기를 이용해 주세요.')
      } finally { setReading(false) }
    }
    reader.onerror = () => { setReading(false); setError('사진을 읽지 못했어요. 다른 사진으로 다시 시도해 주세요.') }
    reader.readAsDataURL(file)
  }

  return (
    <div className="device-frame">
      <PageHeader title="옷 사진 업로드" />

      <main className="px-5 py-6">
        {error && <p role="alert" className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
        {reading && <p role="status" className="mb-4 text-sm text-brand">사진을 준비하고 있어요…</p>}
        <p className="text-xs font-medium text-gray-500 mb-3">분석할 옷 종류</p>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8">
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

        <div className="space-y-3 mb-8">
          <OptionCard
            icon={<Camera className="w-6 h-6" />}
            title="사진 찍기"
            subtitle="카메라로 바로 촬영"
            onClick={() => camRef.current?.click()}
          />
          <OptionCard
            icon={<ImageIcon className="w-6 h-6" />}
            title="갤러리에서 선택"
            subtitle="사진을 가져온 뒤 옷 영역 선택"
            onClick={() => fileRef.current?.click()}
          />
          <OptionCard
            icon={<Palette className="w-6 h-6" />}
            title="색 직접 고르기"
            subtitle="사진 없이 색만 선택"
            onClick={() => navigate(`/manual-color?type=${itemType}`)}
          />
        </div>

        <section className="p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-brand" strokeWidth={2} />
            <p className="text-xs font-semibold text-brand">정확한 분석을 위한 팁</p>
          </div>
          <ul className="text-xs leading-relaxed text-gray-600 space-y-1">
            <li>· 옷이 화면을 크게 차지하도록 찍어주세요</li>
            <li>· 자연광에서 찍으면 색이 정확해요</li>
            <li>· 옷 외 배경은 단색일수록 좋아요</li>
          </ul>
        </section>
      </main>

      <input ref={camRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" disabled={reading} onChange={handleFile} />
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={reading} onChange={handleFile} />
    </div>
  )
}

function OptionCard({ icon, title, subtitle, onClick }: {
  icon: React.ReactNode; title: string; subtitle: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full p-5 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center gap-4 transition text-left"
    >
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </button>
  )
}
