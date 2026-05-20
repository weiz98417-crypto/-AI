import { Outlet } from 'react-router-dom'
import TopAppBar from './TopAppBar'
import BottomNavBar from './BottomNavBar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopAppBar title="逛逛AI" showBack={false} />
      <main className="pt-12 pb-20">
        <Outlet />
      </main>
      <BottomNavBar />
    </div>
  )
}
