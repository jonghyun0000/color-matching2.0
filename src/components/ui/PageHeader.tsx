import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  back?: boolean
  right?: React.ReactNode
}

export default function PageHeader({ title, back = true, right }: Props) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="flex items-center justify-between px-5 h-14">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {back && (
            <button onClick={() => navigate(-1)} className="-ml-2 p-2 text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-base font-semibold tracking-tight truncate">
            {title}
          </h1>
        </div>
        {right && <div className="flex items-center gap-1">{right}</div>}
      </div>
    </header>
  )
}
