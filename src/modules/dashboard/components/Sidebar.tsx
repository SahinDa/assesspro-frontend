import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, FolderKanban, Trophy, CreditCard, 
  Building2, Users2, ShieldCheck, Settings, LogOut,
  Layers, BarChart3
} from 'lucide-react'
import { UserRole, type UserRoleType } from '@/config/enums'
import { cn } from '@/lib/utils'

interface SidebarProps {
  role: UserRoleType
}

export function Sidebar({ role }: SidebarProps) {
  const isAdmin = role === UserRole.ADMIN
  const isOrg = role === UserRole.ORGANIZATION

  // Role-based navigation configs
  const navItems = isAdmin
    ? [
        { label: 'Platform Overview', path: '/admin/overview', icon: LayoutDashboard },
        { label: 'Organizations', path: '/admin/organizations', icon: Building2 },
        { label: 'Global Students', path: '/admin/students', icon: Users2 },
        { label: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
      ]
    : isOrg
    ? [
        { label: 'Dashboard', path: '/dashboard/organization', icon: LayoutDashboard },
        { label: 'Tests', path: '/dashboard/tests', icon: FolderKanban },
        { label: 'Student Cohort', path: '/dashboard/students', icon: Users2 },
        { label: 'Leaderboards', path: '/dashboard/leaderboards', icon: Trophy },
        { label: 'Billing & Plan', path: '/dashboard/billing', icon: CreditCard },
      ]
    : [
        { label: 'My Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { label: 'Tests', path: '/student/modules', icon: FolderKanban},
        { label: 'Performance', path: '/student/performance', icon: BarChart3 },
        { label: 'Leaderboard', path: '/student/leaderboard', icon: Trophy },
      ]

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="p-5">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pb-6 border-b border-slate-100">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            {isAdmin ? <ShieldCheck className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">AssessPro</h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {isAdmin ? 'Super Admin' : isOrg ? 'Institute Portal' : 'Student App'}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer / Sign Out */}
      <div className="p-5 border-t border-slate-100">
        <button className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}