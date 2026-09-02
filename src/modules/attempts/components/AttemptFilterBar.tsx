import { Filter, ArrowUpDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TestOption {
  id: string
  title: string
  sets: Array<{ id: string; name: string }>
}

export type SortOrder = 'date_desc' | 'date_asc' | 'score_desc' | 'score_asc'

interface AttemptFilterBarProps {
  tests: TestOption[]
  selectedTestId: string
  selectedSetId: string
  availableSets: Array<{ id: string; name: string }>
  sortOrder: SortOrder
  onTestChange: (val: string) => void
  onSetChange: (val: string) => void
  onSortChange: (val: SortOrder) => void
}

export default function AttemptFilterBar({
  tests,
  selectedTestId,
  selectedSetId,
  availableSets,
  sortOrder,
  onTestChange,
  onSetChange,
  onSortChange,
}: AttemptFilterBarProps) {
  const isSpecificTestSelected = selectedTestId !== 'ALL'

  // Resolve human-readable labels from current IDs
  const currentTestLabel =
    selectedTestId === 'ALL'
      ? 'All Tests'
      : tests.find((t) => t.id === selectedTestId)?.title ?? 'All Tests'

  const currentSetLabel =
    selectedSetId === 'ALL'
      ? 'All Test Sets'
      : availableSets.find((s) => s.id === selectedSetId)?.name ?? 'All Test Sets'

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <CardContent className="p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Cascading Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mr-1">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>Filters:</span>
            </div>

            {/* 1. Parent Test Dropdown */}
            <Select value={selectedTestId} onValueChange={onTestChange}>
              <SelectTrigger className="w-[210px] h-8 text-xs rounded-xl border-slate-200 bg-slate-50/50">
                <SelectValue placeholder="All Tests">
                  <span className="truncate">{currentTestLabel}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Tests</SelectItem>
                {tests.map((test) => (
                  <SelectItem key={test.id} value={test.id}>
                    {test.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 2. Test Set Dropdown (Appears only when a specific Test is chosen) */}
            {isSpecificTestSelected && (
              <Select value={selectedSetId} onValueChange={onSetChange}>
                <SelectTrigger className="w-[210px] h-8 text-xs rounded-xl border-slate-200 bg-indigo-50/40 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
                  <SelectValue placeholder="All Test Sets">
                    <span className="truncate">{currentSetLabel}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Test Sets</SelectItem>
                  {availableSets.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Right: Sort Order Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
              Sort by:
            </span>
            <Select value={sortOrder} onValueChange={(v) => onSortChange(v as SortOrder)}>
              <SelectTrigger className="w-[150px] h-8 text-xs rounded-xl border-slate-200 bg-white">
                <div className="flex items-center gap-1.5 truncate">
                  <ArrowUpDown className="h-3 w-3 text-slate-400 shrink-0" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="date_desc">Latest First</SelectItem>
                <SelectItem value="date_asc">Oldest First</SelectItem>
                <SelectItem value="score_desc">Highest Score</SelectItem>
                <SelectItem value="score_asc">Lowest Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}