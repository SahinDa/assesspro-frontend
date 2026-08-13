// src/modules/organization/components/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import type { UserRoleType } from '@/config/enums'
import { NAVIGATION_CONFIG } from '@/config/navbar.config'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface SidebarProps {
  role: UserRoleType
}

export function Sidebar({ role }: SidebarProps) {
  const navItems = NAVIGATION_CONFIG[role] || []

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand / Logo Area */}
      <div className="h-16 flex items-center px-6">
        <span className="text-sm font-bold text-white tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          AssessPro
        </span>
      </div>
      <Separator className="bg-slate-800/60" />

      {/* Nav Links with Shadcn ScrollArea */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border-0 rounded-full">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            )
          })}
        </nav>
      </ScrollArea>
    </aside>
  )
}