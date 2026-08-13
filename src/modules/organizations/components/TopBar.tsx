// src/modules/organization/components/TopBar.tsx
import { Building2, Bell } from 'lucide-react'
import { UserSettingsDropdown } from './UserSettingsDropdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface TopBarProps {
  orgName: string
  orgLogoUrl?: string
  userName: string
  userEmail: string
  userAvatarUrl?: string
}

export function TopBar({ orgName, orgLogoUrl, userName, userEmail, userAvatarUrl }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Top Left: Organization Name */}
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 shadow-sm">
          {orgLogoUrl && <AvatarImage src={orgLogoUrl} alt={orgName} className="object-cover" />}
          <AvatarFallback className="bg-slate-100 text-indigo-600 rounded-xl">
            <Building2 className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">Organization</span>
          <h1 className="text-xs font-bold text-slate-900 tracking-tight mt-0.5">{orgName}</h1>
        </div>
      </div>

      {/* Top Right: Notifications & User Settings Dropdown */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </Button>

        <Separator orientation="vertical" className="h-6 bg-slate-200 mx-1" />

        <UserSettingsDropdown 
          userName={userName} 
          userEmail={userEmail} 
          avatarUrl={userAvatarUrl} 
        />
      </div>
    </header>
  )
}