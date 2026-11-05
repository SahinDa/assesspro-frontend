import { Link } from 'react-router-dom'
import { Calendar, Trash2, Bookmark, ExternalLink, FileText, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const TYPE_CONFIG: Record<number, { label: string; icon: any; badgeStyle: string; iconBg: string }> = {
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

export default function BookmarksTable({
  bookmarks,
  onRemove,
  formatDate,
}: {
  bookmarks: any[]
  onRemove: (bookmark: any) => void
  formatDate: (iso: string) => string
}) {

  const getItemUrl = (bm: any) => {
    return bm.item_type === 1
      ? `/dashboard/tests/${bm.item_id}`
      : `/dashboard/test-sets/${bm.item_id}`
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-white space-y-2">
        <p className="text-xs font-semibold text-slate-700">No bookmarks found</p>
        <p className="text-xs text-slate-400">Save tests or test sets to quickly access them here.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Bookmarked On</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {bookmarks.map((bm) => {
              const meta = TYPE_CONFIG[bm.item_type] || {
                label: 'Resource',
                icon: Bookmark,
                badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
                iconBg: 'bg-slate-100 text-slate-600',
              }
              const Icon = meta.icon
              const targetUrl = getItemUrl(bm)

              return (
                <tr key={bm.bookmark_id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* Item Details */}
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${meta.iconBg}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={targetUrl}
                          className="inline-flex items-center gap-1.5 font-semibold text-slate-900 hover:text-indigo-600 transition-colors group-hover:underline underline-offset-2 truncate max-w-[280px]"
                        >
                          <span className="truncate">{bm.title}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </Link>
                        {bm.subtitle && (
                          <span className="text-[11px] text-slate-400 font-normal truncate block max-w-[280px]">
                            {bm.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold py-0.5 px-2 gap-1 rounded-md inline-flex items-center shrink-0 ${meta.badgeStyle}`}
                    >
                      <Icon className="h-3 w-3 shrink-0" />
                      <span>{meta.label}</span>
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-slate-500">
                    <div className="flex items-center gap-1.5 font-normal">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(bm.created_at)}</span>
                    </div>
                  </td>

                  {/* Remove Button */}
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemove(bm)}
                      className="h-7 px-2.5 rounded-lg text-xs font-semibold border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100 hover:text-rose-800 hover:border-rose-300 transition-all cursor-pointer shadow-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1 text-rose-500" />
                      Remove
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}