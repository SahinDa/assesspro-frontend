import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/modules/dashboard/components/Sidebar'
import { TopBar } from '@/modules/dashboard/components/TopBar'
import { UserRole, type UserRoleType } from '@/config/enums'

interface AppLayoutProps {
  role: UserRoleType
}

export default function AppLayout({ role }: AppLayoutProps) {
  const isAdmin = role === UserRole.ADMIN

  const session = {
    orgName: isAdmin ? undefined : 'MadLife Academy',
    userName: isAdmin ? 'Platform Admin' : 'Sahin Dafader',
    userEmail: isAdmin ? 'admin@assesspro.io' : 'sahin.dafader@assesspro.com',
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar role={role} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar 
          role={role}
          orgName={session.orgName} 
          userName={session.userName} 
          userEmail={session.userEmail} 
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}