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
  
    if (item.is_pinned) {
      return {
        icon: Pin,
        label: 'Pinned',
        iconClass: 'bg-amber-100 text-amber-800',
        badgeVariant: 'outline' as const,
        badgeClass: 'bg-amber-100/90 text-amber-800 border-amber-300 font-bold',
        cardClass: 'bg-amber-50/40 border-amber-200 shadow-xs',
      }
    }
  
    if (item.is_global) {
      return {
        icon: Globe,
        label: 'System Broadcast',
        iconClass: 'bg-indigo-100 text-indigo-800',
        badgeVariant: 'secondary' as const,
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold',
        cardClass: 'bg-card border-border shadow-xs',
      }
    }
  
    if (text.includes('contest') || text.includes('grand prix')) {
      return {
        icon: Trophy,
        label: 'Contest',
        iconClass: 'bg-purple-100 text-purple-800',
        badgeVariant: 'outline' as const,
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
        cardClass: 'bg-card border-border shadow-xs',
      }
    }
  
    if (text.includes('maintenance') || text.includes('urgent')) {
      return {
        icon: AlertTriangle,
        label: 'System Alert',
        iconClass: 'bg-rose-100 text-rose-800',
        badgeVariant: 'destructive' as const,
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
        cardClass: 'bg-card border-border shadow-xs',
      }
    }
  
    if (text.includes('verified') || text.includes('score') || text.includes('result')) {
      return {
        icon: ShieldCheck,
        label: 'Assessment',
        iconClass: 'bg-emerald-100 text-emerald-800',
        badgeVariant: 'outline' as const,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
        cardClass: 'bg-card border-border shadow-xs',
      }
    }
  
    return {
      icon: Bell,
      label: 'Direct',
      iconClass: 'bg-muted text-muted-foreground',
      badgeVariant: 'outline' as const,
      badgeClass: 'bg-muted/50 text-muted-foreground border-border font-semibold',
      cardClass: 'bg-card border-border shadow-xs',
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
        style={{
          paddingTop: '20px',
          paddingBottom: '20px',
          paddingLeft: '20px',
          paddingRight: '20px',
          marginBottom: '16px',
        }}
        className={`relative w-full transition-all duration-150 rounded-2xl cursor-pointer select-none overflow-hidden ${
          category.cardClass
        } ${
          isExpanded
            ? 'ring-1 ring-indigo-500/40 shadow-sm'
            : isUnread
            ? 'hover:border-slate-300'
            : 'opacity-90 hover:opacity-100'
        }`}
      >
        {/* Left accent bar for unread notifications */}
        {isUnread && (
          <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-l-2xl" />
        )}
  
        <div className="flex items-start gap-4">
          {/* Category Icon */}
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${category.iconClass}`}>
            <Icon className="h-5 w-5" />
          </div>
  
          {/* Content Box */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-sm tracking-tight truncate ${isUnread ? 'font-bold text-foreground' : 'font-semibold text-muted-foreground'}`}>
                  {notification.subject}
                </span>
                <Badge variant={category.badgeVariant} className={`text-[10px] px-2 py-0.5 shrink-0 ${category.badgeClass}`}>
                  {category.label}
                </Badge>
              </div>
  
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-[11px] font-mono text-muted-foreground bg-muted/40 border-border py-0.5 px-2 gap-1 inline-flex items-center">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(notification.created_at)}
                </Badge>
  
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-foreground' : ''
                  }`}
                />
              </div>
            </div>
  
            {/* Message Text */}
            <div className={`text-xs leading-relaxed text-muted-foreground ${isExpanded ? 'whitespace-pre-line text-foreground' : 'line-clamp-2'}`}>
              {notification.message}
            </div>
  
            {/* Action Row with explicit margins */}
            {(notification.url || isExpanded) && (
              <div 
                style={{ marginTop: '16px', paddingTop: '12px' }}
                className="flex items-center justify-between border-t border-border/50"
              >
                {notification.url ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8 text-xs font-semibold px-3 rounded-lg border-border bg-background hover:bg-muted text-indigo-600 hover:text-indigo-700 gap-1.5 cursor-pointer shadow-xs"
                  >
                    <a 
                      href={notification.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Open Link</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                ) : (
                  <span />
                )}
  
                {/* Dismiss / Lock notice */}
                {isExpanded && (
                  isGlobalSystem ? (
                    <Badge 
                      variant="outline" 
                      className="text-[11px] gap-1.5 text-muted-foreground border-border bg-background py-1 px-2.5 select-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Lock className="h-3 w-3 text-muted-foreground" />
                      <span>System notice</span>
                    </Badge>
                  ) : (
                    onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="h-8 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Dismiss</span>
                      </Button>
                    )
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }