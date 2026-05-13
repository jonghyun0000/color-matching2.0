import { Outlet } from 'react-router-dom'
import BottomTabs from './BottomTabs'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative pb-16">
      <Outlet />
      <BottomTabs />
    </div>
  )
}
