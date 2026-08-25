import { useState, useMemo } from 'react'
import { Search, X, Inbox, CheckCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
    // Safety check: Never delete global system notices
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

  // Pinned vs Regular Items
  const pinnedNotifications = useMemo(() => {
    return filteredNotifications.filter((n) => n.is_pinned)
  }, [filteredNotifications])

  const unpinnedNotifications = useMemo(() => {
    return filteredNotifications.filter((n) => !n.is_pinned)
  }, [filteredNotifications])

  // Date Grouping (Today, Yesterday, Earlier)
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
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-indigo-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-none">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Real-time announcements, contest updates, and assessment alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 gap-1.5 h-9 shrink-0 cursor-pointer"
          >
            <CheckCheck className="h-4 w-4 text-indigo-600" />
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {/* 2. Control Toolbar (Filters & Search) */}
      <Card className="p-3.5 border-slate-200 bg-white shadow-xs rounded-2xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
          {/* Top Filter Buttons: All, Pinned, Direct, Global */}
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

          {/* Search Field */}
          <div className="flex items-center w-full sm:w-64 md:w-72 shrink-0 h-10 px-3.5 gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-indigo-500 transition-colors">
            <Search className="h-4 w-4 text-slate-400 shrink-0 select-none pointer-events-none" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 border-none outline-none focus:outline-none focus:ring-0 shadow-none"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700 rounded-md shrink-0 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 3. Feed List */}
      {filteredNotifications.length === 0 ? (
        <Card className="text-center py-16 px-4 border-dashed border-slate-200 bg-white shadow-none space-y-2 rounded-2xl">
          <Inbox className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No notifications found</p>
          <p className="text-xs text-slate-500">
            {searchQuery
              ? 'Try adjusting your search query or resetting filters.'
              : 'You have no active notifications under this category.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          
          {/* A. Pinned Section */}
          {pinnedNotifications.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 border-amber-300 py-0.5 px-2">
                  📌 Pinned Announcements
                </Badge>
                <div className="flex-1 h-px bg-amber-200/70" />
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

          {/* B. Chronological Feed */}
          {filter !== 'pinned' && (['Today', 'Yesterday', 'Earlier'] as const).map((groupKey) => {
            const items = groupedUnpinnedNotifications[groupKey]
            if (!items || items.length === 0) return null

            return (
              <div key={groupKey} className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border-slate-200 py-0.5 px-2">
                    {groupKey}
                  </Badge>
                  <div className="flex-1 h-px bg-slate-200/70" />
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