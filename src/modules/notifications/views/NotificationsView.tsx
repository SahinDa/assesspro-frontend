import { useState, useMemo } from 'react'
import { Search, X, Inbox, CheckCheck } from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import NotificationItem from '../components/NotificationItem'
import NotificationFilters from '../components/NotificationFilters'
import {
  type NotificationModel,
  type NotificationFilterType,
  getDateGroup,
} from '../utils/notificationValidation'

const INITIAL_NOTIFICATIONS: NotificationModel[] = [
  {
    id: 'n-1',
    org_id: 'org-main',
    user_id: 'u-1',
    is_global: false,
    is_pinned: true,
    is_read: false,
    subject: 'National Coding Grand Prix 2026 Guidelines',
    message: 'Please ensure your webcam, microphone, and browser proctoring permissions are configured and granted 15 minutes before the session starts. Any tab switches during the test will trigger automated proctoring flags.',
    url: 'https://example.com/contest-guidelines',
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'n-2',
    org_id: 'org-main',
    user_id: 'u-1',
    is_global: false,
    is_pinned: false,
    is_read: false,
    subject: 'DSA Mock Test #4 Score Published',
    message: 'Your test submission has been fully evaluated.\n\n• Score: 94 / 100\n• Percentile: 98.6%\n• Time Taken: 42m 10s\n\nDetailed code analysis and test case breakdowns are ready for review.',
    url: 'https://example.com/reports/t-101',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'n-3',
    org_id: 'org-main',
    user_id: null,
    is_global: true,
    is_pinned: false,
    is_read: true,
    subject: 'Scheduled Infrastructure Maintenance',
    message: 'The assessment portal will undergo core infrastructure upgrades this Sunday from 02:00 AM to 03:00 AM UTC. Active test sessions will be paused safely.',
    url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'n-4',
    org_id: 'org-main',
    user_id: null,
    is_global: true,
    is_pinned: false,
    is_read: true,
    subject: 'New System Design Module Live',
    message: 'A fresh 4-part Distributed Architecture assessment module is now accessible in your curriculum catalog.',
    url: 'https://example.com/modules/sys-design',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
]

export default function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationModel[]>(INITIAL_NOTIFICATIONS)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<NotificationFilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const target = notifications.find((n) => n.id === id)
    if (target?.is_global) return

    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  // Filter & Search Logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (filter === 'pinned' && !item.is_pinned) return false
      if (filter === 'direct' && (item.is_global || item.is_pinned)) return false
      if (filter === 'global' && (!item.is_global || item.is_pinned)) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        return item.subject.toLowerCase().includes(q) || item.message.toLowerCase().includes(q)
      }
      return true
    })
  }, [notifications, filter, searchQuery])

  const pinnedNotifications = useMemo(() => {
    return filteredNotifications.filter((n) => n.is_pinned)
  }, [filteredNotifications])

  const unpinnedNotifications = useMemo(() => {
    return filteredNotifications.filter((n) => !n.is_pinned)
  }, [filteredNotifications])

  const groupedUnpinnedNotifications = useMemo(() => {
    const groups: { [key in 'Today' | 'Yesterday' | 'Earlier']?: NotificationModel[] } = {}

    unpinnedNotifications.forEach((item) => {
      const group = getDateGroup(item.created_at)
      if (!groups[group]) groups[group] = []
      groups[group]!.push(item)
    })

    return groups
  }, [unpinnedNotifications])

  const pinnedCount = notifications.filter((n) => n.is_pinned).length
  const directCount = notifications.filter((n) => !n.is_global && !n.is_pinned).length
  const globalCount = notifications.filter((n) => n.is_global && !n.is_pinned).length
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* 1. Header Section (Using shadcn CardHeader, CardTitle, and CardDescription) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardHeader className="p-0 space-y-1">
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">
                Notifications
              </CardTitle>
              {unreadCount > 0 && (
                <Badge variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-none">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Real-time announcements, contest updates, and assessment alerts.
            </CardDescription>
          </CardHeader>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs font-bold gap-1.5 h-9 rounded-xl shrink-0"
            >
              <CheckCheck className="h-4 w-4 text-indigo-600" />
              <span>Mark all as read</span>
            </Button>
          )}
        </div>
        <Separator />
      </div>

      {/* 2. Control Toolbar (Card + Input + Button) */}
      <Card className="rounded-2xl shadow-xs border-border">
        <CardContent className="p-3.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
            <NotificationFilters
              activeFilter={filter}
              onFilterChange={(newFilter) => {
                setFilter(newFilter)
                setSearchQuery('')
              }}
              pinnedCount={pinnedCount}
              directCount={directCount}
              globalCount={globalCount}
              totalCount={notifications.length}
            />

            {/* shadcn Input with Relative Search/Clear Icons */}
            <div className="relative w-full sm:w-64 md:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9 text-xs rounded-xl bg-muted/40 focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Empty State or Notifications Feed */}
      {filteredNotifications.length === 0 ? (
        <Card className="border-dashed shadow-none rounded-2xl">
          <CardHeader className="text-center py-16 space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/60">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm font-bold">No notifications found</CardTitle>
            <CardDescription className="text-xs">
              {searchQuery
                ? 'Try adjusting your search query or resetting filters.'
                : 'You have no active notifications under this category.'}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-6">
          
          {/* A. Pinned Group */}
          {pinnedNotifications.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 border-amber-300 py-0.5 px-2">
                  📌 Pinned Announcements
                </Badge>
                <Separator className="flex-1 bg-amber-200/70" />
              </div>

              <div className="space-y-2.5">
                {pinnedNotifications.map((item) => (
                  <NotificationItem
                    key={item.id}
                    notification={item}
                    isExpanded={expandedId === item.id}
                    onToggle={() => toggleExpand(item.id)}
                    onDelete={(e) => handleDelete(e, item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* B. Chronological Groups */}
          {filter !== 'pinned' && (['Today', 'Yesterday', 'Earlier'] as const).map((groupKey) => {
            const items = groupedUnpinnedNotifications[groupKey]
            if (!items || items.length === 0) return null

            return (
              <div key={groupKey} className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 border-border py-0.5 px-2">
                    {groupKey}
                  </Badge>
                  <Separator className="flex-1" />
                </div>

                <div className="space-y-2.5">
                  {items.map((item) => (
                    <NotificationItem
                      key={item.id}
                      notification={item}
                      isExpanded={expandedId === item.id}
                      onToggle={() => toggleExpand(item.id)}
                      onDelete={(e) => handleDelete(e, item.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })}

        </div>
      )}

    </div>
  )
}