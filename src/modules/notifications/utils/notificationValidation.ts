import { z } from 'zod'

export const notificationEntitySchema = z.object({
  id: z.string(),
  user_id: z.string().nullable().optional(),
  org_id: z.string(),
  is_global: z.boolean().default(false),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  url: z.string().nullable().optional(),
  is_pinned: z.boolean().default(false),
  is_read: z.boolean().default(false).optional(),
  created_at: z.string().or(z.date()),
})

export type NotificationModel = z.infer<typeof notificationEntitySchema>

export const createNotificationSchema = z.object({
  userId: z.string().optional().nullable(),
  orgId: z.string().min(1, 'Organization ID is required'),
  is_global: z.boolean().default(false),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(150),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isPinned: z.boolean().default(false),
})

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>

export type NotificationFilterType = 'all' | 'pinned' | 'direct' | 'global'

export function formatTimeAgo(timestamp: string | Date): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function getDateGroup(timestamp: string | Date): 'Today' | 'Yesterday' | 'Earlier' {
  const date = new Date(timestamp)
  const now = new Date()

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  if (isToday) return 'Today'
  if (isYesterday) return 'Yesterday'
  return 'Earlier'
}