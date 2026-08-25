import { useState } from 'react'
import { Bell, Pin, CheckCircle2, ChevronRight, Globe, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { type NotificationModel, formatTimeAgo } from '../utils/notificationValidation'

interface NotificationBadgeProps {
  notifications: NotificationModel[]
  onViewAll?: () => void
  onSelectNotification?: (notification: NotificationModel) => void
}

export default function NotificationBadge({
  notifications,
  onViewAll,
  onSelectNotification,
}: NotificationBadgeProps) {
  const [open, setOpen] = useState(false)
  const totalCount = notifications.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative h-9 w-9 p-0 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs"
        >
          <Bell className="h-4 w-4" />
          {totalCount > 0 && (
            <div className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-rose-600 text-white font-mono font-bold text-[9px] flex items-center justify-center border-2 border-white select-none">
              {totalCount > 99 ? '99+' : totalCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl border-slate-200 bg-white shadow-xl">
        {/* Dropdown Header */}
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-bold text-sm text-slate-900">Notifications</div>
            <Badge variant="outline" className="text-[10px] font-bold bg-slate-100 text-slate-700 border-slate-200 px-1.5 py-0">
              {totalCount} Total
            </Badge>
          </div>
        </div>

        {/* Scrollable Mini List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center space-y-1.5">
              <CheckCircle2 className="h-6 w-6 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-600">You are all caught up</div>
              <div className="text-[11px] text-slate-400">No new notifications for your account.</div>
            </div>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  setOpen(false)
                  onSelectNotification?.(n)
                }}
                className={`p-3 rounded-xl transition-colors cursor-pointer ${
                  n.is_pinned ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      n.is_pinned
                        ? 'bg-amber-100 text-amber-800'
                        : n.is_global
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {n.is_pinned ? (
                      <Pin className="h-3.5 w-3.5 fill-amber-700 text-amber-700" />
                    ) : n.is_global ? (
                      <Globe className="h-3.5 w-3.5 text-indigo-600" />
                    ) : (
                      <User className="h-3.5 w-3.5 text-slate-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{n.subject}</div>
                      <div className="text-[10px] font-mono text-slate-400 shrink-0">
                        {formatTimeAgo(n.created_at)}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {n.message}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false)
                onViewAll?.()
              }}
              className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 h-8 rounded-lg justify-between px-3 cursor-pointer"
            >
              <div>Go to Notification Center</div>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}