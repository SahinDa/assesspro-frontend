import { Trash2, FileText, Layers, Bookmark } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const TYPE_CONFIG: Record<
  number,
  { label: string; icon: any; badgeStyle: string; iconBg: string }
> = {
  1: {
    label: 'Test',
    icon: FileText,
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    iconBg: 'bg-indigo-50 border-indigo-100 text-indigo-600',
  },
  2: {
    label: 'Test Set',
    icon: Layers,
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200/80',
    iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
  },
}

export default function RemoveBookmarkDialog({
  isOpen,
  bookmark,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  bookmark: any
  onClose: () => void
  onConfirm: () => void
}) {
  if (!bookmark) return null

  const meta = TYPE_CONFIG[bookmark.item_type] || {
    label: 'Resource',
    icon: Bookmark,
    badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
    iconBg: 'bg-slate-100 text-slate-600',
  }
  const Icon = meta.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-[400px] rounded-2xl bg-white p-5 shadow-xl border-slate-200 gap-4 overflow-hidden">
        {/* Header */}
        <DialogHeader className="space-y-1 text-left min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-xl border border-rose-100 bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
              <Trash2 className="h-4 w-4" />
            </div>
            <DialogTitle className="text-sm font-bold text-slate-900 truncate">
              Remove Bookmark
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 pt-0.5 leading-relaxed">
            Are you sure you want to remove this item from your saved bookmarks?
          </DialogDescription>
        </DialogHeader>

        {/* Item Preview Card (Contained with min-w-0) */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 min-w-0">
          <div
            className={`h-8 w-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${meta.iconBg}`}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <p
                className="text-xs font-semibold text-slate-900 line-clamp-2 break-words"
                title={bookmark.title}
              >
                {bookmark.title}
              </p>
              <Badge
                variant="outline"
                className={`text-[9px] font-semibold py-0 px-1.5 rounded-md shrink-0 whitespace-nowrap ${meta.badgeStyle}`}
              >
                {meta.label}
              </Badge>
            </div>

            {bookmark.subtitle && (
              <p className="text-[11px] text-slate-500 font-normal truncate block">
                {bookmark.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="pt-2 gap-2 sm:gap-2 border-t border-slate-100 flex-row justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs border-slate-200 h-8.5 px-3.5 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            className="rounded-xl text-xs font-semibold h-8.5 px-4 cursor-pointer shadow-xs bg-rose-600 hover:bg-rose-700 text-white"
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}