import { Pin, Globe, Bell, LayoutGrid } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { type NotificationFilterType } from '../utils/notificationValidation'

interface NotificationFiltersProps {
  activeFilter: NotificationFilterType
  onFilterChange: (filter: NotificationFilterType) => void
  totalCount: number
  pinnedCount: number
  directCount: number
  globalCount: number
}

export default function NotificationFilters({
  activeFilter,
  onFilterChange,
  totalCount,
  pinnedCount,
  directCount,
  globalCount,
}: NotificationFiltersProps) {
  const tabs = [
    { id: 'all' as const, label: 'All', icon: LayoutGrid, count: totalCount },
    { id: 'pinned' as const, label: 'Pinned', icon: Pin, count: pinnedCount },
    { id: 'direct' as const, label: 'Direct', icon: Bell, count: directCount },
    { id: 'global' as const, label: 'Global', icon: Globe, count: globalCount },
  ]

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeFilter === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shrink-0 ${
              isActive
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 h-4 border-none ${
                  isActive
                    ? 'bg-slate-800 text-slate-200 font-black'
                    : 'bg-slate-200/70 text-slate-700 font-bold'
                }`}
              >
                {tab.count}
              </Badge>
            )}
          </button>
        )
      })}
    </div>
  )
}