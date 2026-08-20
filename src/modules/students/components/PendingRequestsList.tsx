import { useState } from 'react'
import {
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { StudentUserItem } from '../views/OrgStudentsView'

interface PendingRequestsListProps {
  requests: StudentUserItem[]
  onApprove: (student: StudentUserItem) => void
  onReject: (student: StudentUserItem) => void
  onBatchApprove?: (ids: string[]) => void
  formatDate: (iso: string) => string
}

export default function PendingRequestsList({
  requests,
  onApprove,
  onReject,
  onBatchApprove,
  formatDate,
}: PendingRequestsListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(requests.length / pageSize))

  const paginatedRequests = requests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const isAllSelected =
    paginatedRequests.length > 0 &&
    paginatedRequests.every((r) => selectedIds.includes(r.id))

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = paginatedRequests.map((r) => r.id)
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      const newIds = paginatedRequests
        .map((r) => r.id)
        .filter((id) => !selectedIds.includes(id))
      setSelectedIds((prev) => [...prev, ...newIds])
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-white space-y-2">
        <p className="text-xs font-semibold text-slate-700">No pending join requests</p>
        <p className="text-xs text-slate-400">
          All student membership applications have been reviewed.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Batch Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-2.5 px-4 bg-amber-50/70 border border-amber-200/80 rounded-xl">
          <span className="text-xs font-semibold text-amber-900">
            {selectedIds.length} applicant{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                onBatchApprove?.(selectedIds)
                setSelectedIds([])
              }}
              className="h-8 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve Selected
            </Button>
          </div>
        </div>
      )}

      {/* Unified Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center cursor-pointer text-slate-400 hover:text-slate-700"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="h-4 w-4 text-indigo-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedRequests.map((student) => {
                const isSelected = selectedIds.includes(student.id)
                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-amber-50/40' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(student.id)}
                        className="flex items-center cursor-pointer text-slate-400 hover:text-slate-700"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-indigo-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs shrink-0">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[180px]">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <div className="flex items-center gap-1.5 font-normal">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{student.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <div className="flex items-center gap-1.5 font-normal">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{formatDate(student.joined_date)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold bg-amber-50 text-amber-700 border-amber-200 py-0.5"
                      >
                        Review Pending
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {/* Symmetrical Action Buttons */}
                      <div className="inline-flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReject(student)}
                          className="h-7 px-3 rounded-lg text-xs font-semibold border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100 hover:text-rose-800 hover:border-rose-300 transition-all cursor-pointer shadow-xs"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1 text-rose-500" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onApprove(student)}
                          className="h-7 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {requests.length > pageSize && (
          <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, requests.length)} of {requests.length}
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-7 w-7 p-0 rounded-lg cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs font-semibold text-slate-700 px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 w-7 p-0 rounded-lg cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}