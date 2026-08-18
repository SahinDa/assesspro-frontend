// src/modules/organization/components/UserSettingsDropdown.tsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Settings, LogOut, ShieldCheck, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { UserRole, type UserRoleType } from '@/config/enums'

interface UserSettingsDropdownProps {
  userName: string
  userEmail: string
  role?: UserRoleType
  avatarUrl?: string
  onSignOut?: () => void
}

export function UserSettingsDropdown({
  userName,
  userEmail,
  role = UserRole.STUDENT,
  avatarUrl,
  onSignOut,
}: UserSettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const isAdmin = role === UserRole.ADMIN
  const isOrg = role === UserRole.ORGANIZATION

  const roleLabel = isAdmin
    ? 'Super Admin'
    : isOrg
    ? 'Organization Admin'
    : 'Student'

  const basePath = isAdmin
    ? '/admin'
    : isOrg
    ? '/dashboard'
    : '/student'

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigation = (path: string) => {
    setIsOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    setIsOpen(false)
    if (onSignOut) {
      onSignOut()
    } else {
      navigate('/signin', { replace: true })
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 transition-all text-left outline-none cursor-pointer border-0 bg-transparent"
      >
        <Avatar className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-xs shadow-inner">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} className="object-cover" />}
          <AvatarFallback className="bg-indigo-50 text-indigo-600 rounded-xl">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-slate-800 leading-tight">{userName}</p>
          <p className="text-[10px] text-slate-500 font-medium">{roleLabel}</p>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Content Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/85 shadow-xl p-1.5 bg-white z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900">{userName}</p>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">{userEmail}</p>
          </div>

          <div className="py-1 space-y-0.5">
            <button
              type="button"
              onClick={() => handleNavigation(`${basePath}/profile`)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span>Your Profile</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigation(`${basePath}/settings`)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <Settings className="h-3.5 w-3.5 text-slate-400" />
              <span>Account Settings</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigation(`${basePath}/security`)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>Security & Access</span>
            </button>
          </div>

          <Separator className="bg-slate-100 my-1" />

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 rounded-xl cursor-pointer hover:bg-rose-50/50 transition-colors text-left font-medium"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-500" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  )
}