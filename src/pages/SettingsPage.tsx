import { ChevronRight, Trash2, Info, FileText, Mail } from 'lucide-react'

const APP_VERSION = '0.1.0'

export default function SettingsPage() {
  const handleClearCache = () => {
    if (!confirm('모든 즐겨찾기와 기록을 삭제할까요? 이 작업은 되돌릴 수 없습니다.')) return
    localStorage.removeItem('@dduckddak/favorites')
    localStorage.removeItem('@dduckddak/history')
    sessionStorage.removeItem('@dduckddak/temp-image')
    alert('데이터를 모두 삭제했습니다.')
  }

  return (
    <div>
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">설정</h1>
      </header>

      <main className="px-5">
        <Section title="앱 정보">
          <Row icon={Info} label="버전" value={APP_VERSION} />
          <Row icon={Mail} label="문의" value="dduckddak.app@gmail.com" />
        </Section>

        <Section title="문서">
          <RowLink icon={FileText} label="개인정보처리방침" onClick={() => alert('준비 중')} />
          <RowLink icon={FileText} label="이용약관" onClick={() => alert('준비 중')} />
        </Section>

        <Section title="데이터">
          <button
            onClick={handleClearCache}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left rounded-xl hover:bg-gray-50 transition text-red-500"
          >
            <Trash2 className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-medium">즐겨찾기·기록 전체 삭제</span>
          </button>
        </Section>

        <p className="text-center text-[11px] text-gray-400 mt-12 mb-4 leading-relaxed">
          뚝딱은 모든 분석을 기기에서만 처리하며,<br />
          사진을 서버로 전송하지 않습니다.
        </p>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <p className="text-xs font-semibold text-gray-500 mb-2 px-1">{title}</p>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {children}
      </div>
    </section>
  )
}

function Row({ icon: Icon, label, value }: {
  icon: typeof Info; label: string; value: string
}) {
  return (
    <div className="px-4 py-3.5 flex items-center gap-3 border-b border-gray-50 last:border-b-0">
      <Icon className="w-5 h-5 text-gray-400" strokeWidth={2} />
      <span className="text-sm font-medium flex-1">{label}</span>
      <span className="text-sm text-gray-500">{value}</span>
    </div>
  )
}

function RowLink({ icon: Icon, label, onClick }: {
  icon: typeof Info; label: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3.5 flex items-center gap-3 text-left border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition"
    >
      <Icon className="w-5 h-5 text-gray-400" strokeWidth={2} />
      <span className="text-sm font-medium flex-1">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </button>
  )
}
