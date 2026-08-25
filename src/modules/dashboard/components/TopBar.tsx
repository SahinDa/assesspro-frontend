import { UserRole, type UserRoleType } from '@/config/enums'
import { Building2, ShieldCheck, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserSettingsDropdown } from './UserSettingsDropdown'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  role?: UserRoleType
  orgName?: string
  userName: string
  userEmail: string
  avatarUrl?: string
  onSignOut?: () => void
}

export function TopBar({
  role = UserRole.STUDENT,
  orgName = 'MadLife Academy',
  userName,
  userEmail,
  avatarUrl,
  onSignOut,
}: TopBarProps) {
  const navigate = useNavigate()
  const isAdmin = role === UserRole.ADMIN

  const notificationPath =
    role === UserRole.ORGANIZATION
      ? '/dashboard/notifications'
      : role === UserRole.ADMIN
      ? '/admin/notifications'
      : '/student/notifications'

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Context badge */}
      <div className="flex items-center gap-3">
        {isAdmin ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white shadow-xs">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold tracking-wide">Platform Console</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-none">
                Organization
              </p>
              <p className="text-xs font-bold text-slate-900 leading-tight mt-0.5">
                {orgName}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right side: Notifications & User Settings Dropdown */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(notificationPath)}
          className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-900 relative cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </Button>

        <UserSettingsDropdown
          userName={userName}
          userEmail={userEmail}
          role={role}
          avatarUrl={avatarUrl}
          onSignOut={onSignOut}
        />
      </div>
    </header>
  )
}