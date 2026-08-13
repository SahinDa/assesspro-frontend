// src/modules/organization/components/UserSettingsDropdown.tsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Settings, LogOut, ShieldCheck, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface UserSettingsDropdownProps {
  userName: string
  userEmail: string
  avatarUrl?: string
}

export function UserSettingsDropdown({ userName, userEmail, avatarUrl }: UserSettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
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
    setTimeout(() => navigate(path), 0)
  }

  const handleLogout = () => {
    setIsOpen(false)
    setTimeout(() => navigate('/role-selection', { replace: true }), 0)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 h-auto rounded-xl hover:bg-slate-100 transition-all text-left outline-none cursor-pointer border-0 bg-transparent group"
      >
        <Avatar className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-xs shadow-inner">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} className="object-cover" />}
          <AvatarFallback className="bg-indigo-50 text-indigo-600 rounded-xl">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-slate-800 leading-tight">{userName}</p>
          <p className="text-[10px] text-slate-500 font-medium">Organization Admin</p>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
              onClick={() => handleNavigation('/dashboard/profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span>Your Profile</span>
            </button>
            <button
              onClick={() => handleNavigation('/dashboard/settings')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <Settings className="h-3.5 w-3.5 text-slate-400" />
              <span>Account Settings</span>
            </button>
            <button
              onClick={() => handleNavigation('/dashboard/security')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-left font-medium"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>Security & Access</span>
            </button>
          </div>

          <Separator className="bg-slate-100 my-1" />

          <button
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