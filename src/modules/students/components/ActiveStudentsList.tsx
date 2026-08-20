import { useState } from 'react'
import { Mail, Calendar, MoreHorizontal, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { StudentUserItem } from '../views/OrgStudentsView'

interface ActiveStudentsListProps {
  students: StudentUserItem[]
  onRemove: (student: StudentUserItem) => void
  formatDate: (iso: string) => string
}

export default function ActiveStudentsList({
  students,
  onRemove,
  formatDate,
}: ActiveStudentsListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(students.length / pageSize))

  const paginatedStudents = students.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  if (students.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-white space-y-2">
        <p className="text-xs font-semibold text-slate-700">No active students found</p>
        <p className="text-xs text-slate-400">Invite students or approve pending applications.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {paginatedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate max-w-[200px]">{student.name}</span>
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
                  <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 py-0.5">
                    Active
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none border-0 bg-transparent">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 rounded-xl p-1 shadow-lg border-slate-200 bg-white z-30">
                      <DropdownMenuItem
                        onClick={() => onRemove(student)}
                        className="text-xs font-medium gap-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer py-2"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        <span>Remove</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {students.length > pageSize && (
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, students.length)} of {students.length}
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
  )
}