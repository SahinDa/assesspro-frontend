import { Filter, Search, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

interface AttemptFilterBarProps {
  tests: TestOption[]
  selectedTestId: string
  selectedSetId: string
  availableSets: Array<{ id: string; name: string }>
  searchQuery: string
  searchError: string | null
  isOrg: boolean
  onTestChange: (val: string) => void
  onSetChange: (val: string) => void
  onSearchChange: (val: string) => void
}

export default function AttemptFilterBar({
  tests,
  selectedTestId,
  selectedSetId,
  availableSets,
  searchQuery,
  searchError,
  isOrg,
  onTestChange,
  onSetChange,
  onSearchChange,
}: AttemptFilterBarProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <CardContent className="p-3.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mr-1">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>Filters:</span>
            </div>

            {/* Test / Course Selector */}
            <Select value={selectedTestId} onValueChange={onTestChange}>
              <SelectTrigger className="w-[190px] h-8 text-xs rounded-xl border-slate-200 bg-slate-50/50">
                <SelectValue placeholder="All Tests" />
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

            {/* Dependent Test Set Selector */}
            <Select
              value={selectedSetId}
              onValueChange={onSetChange}
              disabled={selectedTestId === 'ALL'}
            >
              <SelectTrigger className="w-[190px] h-8 text-xs rounded-xl border-slate-200 bg-slate-50/50 disabled:opacity-50">
                <SelectValue placeholder={selectedTestId === 'ALL' ? 'Select a test first' : 'All Test Sets'} />
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
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isOrg ? 'Search candidate or set...' : 'Search test or set...'}
              className="pl-8 h-8 text-xs rounded-xl border-slate-200"
            />
          </div>
        </div>

        {searchError && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-rose-500 pl-1 pt-1">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}