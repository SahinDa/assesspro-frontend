import { 
    Pin, 
    Globe, 
    Bell, 
    ExternalLink, 
    Clock, 
    Trophy, 
    AlertTriangle, 
    ShieldCheck, 
    Trash2,
    ChevronDown,
    Lock
  } from 'lucide-react'
  import { Card } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  import { type NotificationModel, formatTimeAgo } from '../utils/notificationValidation'
  
  function getCategoryConfig(item: NotificationModel) {
    const text = (item.subject + ' ' + item.message).toLowerCase()
  
    // 1. Pinned Priority
    if (item.is_pinned) {
      return {
        icon: Pin,
        label: 'Pinned',
        iconClass: 'bg-amber-100 text-amber-800',
        badgeClass: 'bg-amber-100/90 text-amber-800 border-amber-300 font-black',
      }
    }
  
    // 2. Global System Broadcasts
    if (item.is_global) {
      return {
        icon: Globe,
        label: 'System Broadcast',
        iconClass: 'bg-indigo-100 text-indigo-800',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold',
      }
    }
  
    // 3. Contests
    if (text.includes('contest') || text.includes('grand prix')) {
      return {
        icon: Trophy,
        label: 'Contest',
        iconClass: 'bg-purple-100 text-purple-800',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 font-bold',
      }
    }
  
    // 4. System / Infrastructure Alerts
    if (text.includes('maintenance') || text.includes('urgent')) {
      return {
        icon: AlertTriangle,
        label: 'System Alert',
        iconClass: 'bg-rose-100 text-rose-800',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
      }
    }
  
    // 5. Test Results & Assessments
    if (text.includes('verified') || text.includes('score') || text.includes('result')) {
      return {
        icon: ShieldCheck,
        label: 'Assessment',
        iconClass: 'bg-emerald-100 text-emerald-800',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
      }
    }
  
    // 6. Direct User Notice (Default)
    return {
      icon: Bell,
      label: 'Direct',
      iconClass: 'bg-slate-100 text-slate-800',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200 font-bold',
    }
  }
  
  interface NotificationItemProps {
    notification: NotificationModel
    isExpanded?: boolean
    onToggle?: () => void
    onDelete?: (e: React.MouseEvent) => void
  }
  
  export default function NotificationItem({ 
    notification, 
    isExpanded = false, 
    onToggle, 
    onDelete 
  }: NotificationItemProps) {
    const category = getCategoryConfig(notification)
    const Icon = category.icon
    const isUnread = !notification.is_read
    const isGlobalSystem = notification.is_global
  
    return (
      <Card
        onClick={onToggle}
        className={`relative p-4 transition-all duration-150 border rounded-2xl cursor-pointer select-none ${
          notification.is_pinned
            ? 'bg-amber-50/40 border-amber-200 shadow-xs'
            : isExpanded
            ? 'bg-white border-indigo-200 shadow-sm'
            : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
        }`}
      >
        {/* Unread Accent Indicator */}
        {isUnread && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-2xl" />
        )}
  
        <div className="flex items-start gap-3.5 pl-0.5">
          {/* Category Icon */}
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${category.iconClass}`}>
            <Icon className="h-4 w-4" />
          </div>
  
          {/* Content Body */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`text-sm truncate ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                  {notification.subject}
                </div>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${category.badgeClass}`}>
                  {category.label}
                </Badge>
              </div>
  
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-[11px] font-mono text-slate-500 bg-slate-50 border-slate-200 py-0.5 px-2 gap-1 inline-flex items-center">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {formatTimeAgo(notification.created_at)}
                </Badge>
  
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-slate-700' : ''
                  }`}
                />
              </div>
            </div>
  
            {/* Message Text (Collapsed vs Expanded) */}
            <div className={`text-xs text-slate-600 leading-relaxed ${isExpanded ? 'whitespace-pre-line' : 'line-clamp-2'}`}>
              {notification.message}
            </div>
  
            {/* Action Row: Link CTA & Dismiss Action */}
            <div className="flex items-center justify-between pt-1">
              {notification.url ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-7 text-xs font-semibold px-2.5 rounded-lg border-slate-200 bg-white hover:bg-slate-100 text-indigo-600 hover:text-indigo-700 gap-1.5 cursor-pointer shadow-xs"
                >
                  <a 
                    href={notification.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Open Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              ) : (
                <div />
              )}
  
              {/* Delete / Dismiss Control (Hidden if Global) */}
              {isExpanded && (
                isGlobalSystem ? (
                  <div 
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 select-none py-1 px-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span>System notice (cannot dismiss)</span>
                  </div>
                ) : (
                  onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDelete}
                      className="h-7 px-2 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1 rounded-md cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Dismiss</span>
                    </Button>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }