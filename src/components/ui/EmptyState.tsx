import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-gray-400" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
      {description && (
        <p className="text-xs text-gray-500 leading-relaxed mb-6 max-w-xs">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="h-10 px-5 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-press transition"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
