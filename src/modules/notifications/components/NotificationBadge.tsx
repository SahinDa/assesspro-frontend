import { useState } from 'react'
import { Bell, Pin, CheckCircle2, ChevronRight, Globe, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
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
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-xl border-border bg-background hover:bg-muted text-foreground cursor-pointer shadow-2xs"
          aria-label="Open notifications dropdown"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full text-[9px] font-mono font-bold flex items-center justify-center border-2 border-background shadow-none select-none"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl border-border bg-popover shadow-xl overflow-hidden">
        {/* Dropdown Header */}
        <CardHeader className="p-3.5 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <CardTitle className="font-bold text-sm text-foreground">Notifications</CardTitle>
            <Badge variant="secondary" className="text-[10px] font-bold px-1.5 py-0 h-4">
              {notifications.length} Total
            </Badge>
          </div>

          {unreadCount > 0 && (
            <Badge variant="default" className="text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 px-1.5 py-0 h-4">
              {unreadCount} Unread
            </Badge>
          )}
        </CardHeader>

        <Separator />

        {/* Scrollable Mini Feed */}
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center space-y-1.5">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground mx-auto" />
              <CardTitle className="text-xs font-bold text-foreground">You are all caught up</CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                No new notifications for your account.
              </CardDescription>
            </div>
          ) : (
            <div className="p-1.5 space-y-1">
              {notifications.slice(0, 5).map((n) => (
                <Button
                  key={n.id}
                  variant="ghost"
                  onClick={() => {
                    setOpen(false)
                    onSelectNotification?.(n)
                  }}
                  className={`w-full h-auto p-2.5 rounded-xl justify-start text-left whitespace-normal font-normal transition-colors cursor-pointer ${
                    n.is_pinned
                      ? 'bg-amber-50/50 hover:bg-amber-50/90'
                      : !n.is_read
                      ? 'bg-muted/40 hover:bg-muted/70'
                      : 'hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5 w-full">
                    {/* Leading Category Badge Icon */}
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        n.is_pinned
                          ? 'bg-amber-100 text-amber-800'
                          : n.is_global
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {n.is_pinned ? (
                        <Pin className="h-3.5 w-3.5 fill-amber-700 text-amber-700" />
                      ) : n.is_global ? (
                        <Globe className="h-3.5 w-3.5 text-indigo-600" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Notification Details */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs truncate ${!n.is_read ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                          {n.subject}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                          {formatTimeAgo(n.created_at)}
                        </span>
                      </div>
                      <CardDescription className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {n.message}
                      </CardDescription>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer Navigation CTA */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <footer className="p-2 bg-muted/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOpen(false)
                  onViewAll?.()
                }}
                className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 h-8 rounded-lg justify-between px-3 cursor-pointer"
              >
                <span>Go to Notification Center</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </footer>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}