import { NavLink } from 'react-router-dom'
import { Home, Heart, Clock, Settings } from 'lucide-react'

const TABS = [
  { to: '/', label: '홈', icon: Home },
  { to: '/favorites', label: '즐겨찾기', icon: Heart },
  { to: '/history', label: '기록', icon: Clock },
  { to: '/settings', label: '설정', icon: Settings },
] as const

export default function BottomTabs() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-10">
      <ul className="flex h-16">
        {TABS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `h-full flex flex-col items-center justify-center gap-1 transition ${
                  isActive ? 'text-brand' : 'text-gray-400'
                }`
              }
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              <span className="text-[10.5px] font-medium">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
