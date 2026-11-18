import { useState, useMemo } from 'react'
import { Inbox, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import NotificationItem from '../components/NotificationItem'
import NotificationFilters from '../components/NotificationFilters'
import CreateAnnouncementModal from '../components/CreateAnnouncementModal'
import {
  type NotificationModel,
  type NotificationFilterType,
  getDateGroup,
} from '../utils/notificationValidation'
import { useActiveOrgId } from '@/hooks/useActiveOrgId'
import { UserRole, NotificationFilterEnum } from '@/config/enums'
import { useNotificationQueries } from '../api/useNotificationQueries'
import { useCreateAnnouncement, useRemoveNotification } from '../api/useNotificationMutation'

const PAGE_LIMIT = 20

export interface NotificationProps {
  readOnly?: boolean
  orgId?: string
}

export default function NotificationsView({
  readOnly = false,
  orgId: propOrgId,
}: NotificationProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<NotificationFilterType>('all')

  const { orgId, isAdmin, isOrganization } = useActiveOrgId(propOrgId)
  const [page, setPage] = useState(0)
  const offset = page * PAGE_LIMIT
  const createMutation = useCreateAnnouncement()
  const removeMutation = useRemoveNotification()

  const role = isAdmin
    ? UserRole.ADMIN
    : isOrganization
      ? UserRole.ORGANIZATION
      : null

  const apiFilterType = useMemo(() => {
    if (filter === 'global') return NotificationFilterEnum.GLOBAL
    if (filter === 'direct') return NotificationFilterEnum.PERSONAL
    return undefined
  }, [filter])

  const {
    data: rawNotifications = [],
    isLoading,
    isPlaceholderData,
  } = useNotificationQueries(
    {
      offset,
      limit: PAGE_LIMIT,
      type: apiFilterType,
    },
    propOrgId,
  )

  const notifications: NotificationModel[] = useMemo(() => {
    return rawNotifications.map((item) => ({
      id: item.notification_id,
      org_id: item.org_id ?? '',
      user_id: item.user_id,
      is_global: item.is_global,
      is_pinned: item.is_pinned,
      is_read: true,
      subject: item.subject,
      message: item.message,
      url: item.url,
      created_at: item.created_at,
    }))
  }, [rawNotifications])

  const canDeleteNotification = (item: NotificationModel): boolean => {
    if (readOnly) return false

    // Personal / direct notifications are always deletable by the recipient
    if (!item.is_global) return true

    // Global / org announcements depend on role
    if (isAdmin) return true
    if (isOrganization) return Boolean(item.org_id)

    return false
  }

  const handleCreateAnnouncement = async (payload: {
    orgId: string | null
    is_global: true
    subject: string
    message: string
    url?: string
    isPinned: boolean
  }) => {
    await createMutation.mutateAsync({
      orgId: payload.orgId,
      is_global: payload.is_global,
      subject: payload.subject,
      message: payload.message,
      url: payload.url,
      isPinned: payload.isPinned,
    })
    setPage(0)
  }

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleFilterChange = (nextFilter: NotificationFilterType) => {
    setFilter(nextFilter)
    setPage(0)
    setExpandedId(null)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const target = notifications.find((n) => n.id === id)
    if (!target || !canDeleteNotification(target)) return

    removeMutation.mutate(
      { notificationId: id },
      {
        onSuccess: () => {
          if (expandedId === id) setExpandedId(null)
        },
      },
    )
  }

  const hasPrevPage = page > 0
  const hasNextPage = notifications.length === PAGE_LIMIT

  const pinnedNotifications = useMemo(() => {
    return notifications.filter((n) => n.is_pinned)
  }, [notifications])

  const unpinnedNotifications = useMemo(() => {
    return notifications.filter((n) => !n.is_pinned)
  }, [notifications])

  const groupedUnpinnedNotifications = useMemo(() => {
    const groups: { [key in 'Today' | 'Yesterday' | 'Earlier']?: NotificationModel[] } = {}

    unpinnedNotifications.forEach((item) => {
      const group = getDateGroup(item.created_at)
      if (!groups[group]) groups[group] = []
      groups[group]!.push(item)
    })

    return groups
  }, [unpinnedNotifications])

  const directCount = notifications.filter((n) => !n.is_global).length
  const globalCount = notifications.filter((n) => n.is_global).length

  return (
    <main className="w-full max-w-4xl mx-auto space-y-8 pb-24 px-2 sm:px-0">

      {/* 1. Header Section */}
      <header className="space-y-4">
        <CardHeader className="p-0 space-y-1">
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            Notifications
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground whitespace-nowrap">
            Stay updated on upcoming contests, test results, and platform announcements.
          </CardDescription>
        </CardHeader>
        <Separator />
      </header>
      {role !== null && !readOnly && (
        <CreateAnnouncementModal
          role={role}
          orgId={orgId ?? null}
          onSubmit={handleCreateAnnouncement}
          isSubmitting={createMutation.isPending}
        />
      )}

      {/* 2. Filter Toolbar */}
      <Card className="rounded-2xl shadow-xs border-border">
        <CardContent className="p-3">
          <NotificationFilters
            activeFilter={filter}
            onFilterChange={handleFilterChange}
            directCount={directCount}
            globalCount={globalCount}
            totalCount={notifications.length}
          />
        </CardContent>
      </Card>

      {/* 3. Empty State or Notifications Feed */}
      {isLoading ? (
        <Card className="border-dashed shadow-none rounded-2xl">
          <CardHeader className="text-center py-16 space-y-2">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600" />
            <CardDescription className="text-xs">Loading notifications...</CardDescription>
          </CardHeader>
        </Card>
      ) : notifications.length === 0 ? (
        <Card className="border-dashed shadow-none rounded-2xl">
          <CardHeader className="text-center py-16 space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/60">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm font-bold">No notifications found</CardTitle>
            <CardDescription className="text-xs">
              You have no active notifications under this category.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-10">

          {/* A. Pinned Section */}
          {pinnedNotifications.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 border-amber-300 py-0.5 px-2">
                  📌 Pinned
                </Badge>
                <Separator className="flex-1 bg-amber-200/70" />
              </div>

              <div className="w-full">
                {pinnedNotifications.map((item) => (
                  <NotificationItem
                    key={item.id}
                    notification={item}
                    isExpanded={expandedId === item.id}
                    onToggle={() => toggleExpand(item.id)}
                    onDelete={
                      canDeleteNotification(item)
                        ? (e) => handleDelete(e, item.id)
                        : undefined
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {/* B. Chronological Feed Sections */}
          {(['Today', 'Yesterday', 'Earlier'] as const).map((groupKey) => {
            const items = groupedUnpinnedNotifications[groupKey]
            if (!items || items.length === 0) return null

            return (
              <section key={groupKey} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 border-border py-0.5 px-2">
                    {groupKey}
                  </Badge>
                  <Separator className="flex-1" />
                </div>

                <div className="w-full">
                  {items.map((item) => (
                    <NotificationItem
                      key={item.id}
                      notification={item}
                      isExpanded={expandedId === item.id}
                      onToggle={() => toggleExpand(item.id)}
                      onDelete={
                        canDeleteNotification(item)
                          ? (e) => handleDelete(e, item.id)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </section>
            )
          })}

        </div>
      )}

      {(hasPrevPage || hasNextPage) && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground font-medium">
            Showing <span className="font-bold text-foreground">{offset + 1}</span>–
            <span className="font-bold text-foreground">
              {offset + notifications.length}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage((p) => Math.max(0, p - 1))
                setExpandedId(null)
              }}
              disabled={!hasPrevPage || isPlaceholderData}
              className="h-8 rounded-xl text-xs font-bold gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>

            <span className="text-xs font-bold px-2 text-muted-foreground">
              Page {page + 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage((p) => p + 1)
                setExpandedId(null)
              }}
              disabled={!hasNextPage || isPlaceholderData}
              className="h-8 rounded-xl text-xs font-bold gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

    </main>
  )
}