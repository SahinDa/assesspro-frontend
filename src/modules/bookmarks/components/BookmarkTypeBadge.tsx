import { Badge } from '@/components/ui/badge'
import { FileText, Layers, Bookmark } from 'lucide-react'

// Inlined metadata config: 1 = Test, 2 = Test Set (easily extensible)
const TYPE_CONFIG: Record<number, { label: string; singularLabel: string; icon: any; badgeStyle: string }> = {
  1: {
    label: 'Tests',
    singularLabel: 'Test',
    icon: FileText,
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  },
  2: {
    label: 'Test Sets',
    singularLabel: 'Test Set',
    icon: Layers,
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200/80',
  },
}

interface BookmarkTypeBadgeProps {
  type: number // 1: Test, 2: Test Set
}

export default function BookmarkTypeBadge({ type }: BookmarkTypeBadgeProps) {
  const meta = TYPE_CONFIG[type] || {
    label: 'Resources',
    singularLabel: 'Resource',
    icon: Bookmark,
    badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  const Icon = meta.icon

  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-semibold py-0.5 px-2 gap-1 rounded-md inline-flex items-center shrink-0 ${meta.badgeStyle}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{meta.singularLabel}</span>
    </Badge>
  )
}