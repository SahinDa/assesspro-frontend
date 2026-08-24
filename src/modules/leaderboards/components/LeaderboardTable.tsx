import { useState, useEffect } from 'react'
import { Trophy, Clock, ShieldAlert, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type LeaderboardRow, formatDuration } from '../utils/leaderboardValidation'

interface LeaderboardTableProps {
  rankings: LeaderboardRow[]
  currentUserId?: string
}

export default function LeaderboardTable({ rankings, currentUserId }: LeaderboardTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(rankings.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [rankings.length])

  const paginatedList = rankings.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (rankings.length === 0) {
    return (
      <Card className="text-center py-12 px-4 border-dashed border-slate-200 bg-white shadow-none space-y-2 rounded-2xl">
        <Trophy className="h-8 w-8 text-slate-300 mx-auto" />
        <p className="text-sm font-bold text-slate-700">No participants found</p>
        <p className="text-xs text-slate-500">Standings will appear once candidates complete their attempts.</p>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 bg-white shadow-xs overflow-hidden rounded-2xl w-full">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200/80">
            <TableRow className="border-slate-200/80 hover:bg-transparent">
              <TableHead className="w-16 text-center text-xs font-bold text-slate-700 uppercase">Rank</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 uppercase">Candidate</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 uppercase">Score</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 uppercase">Time Taken</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 uppercase">Integrity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs divide-y divide-slate-100">
            {paginatedList.map((entry) => {
              const isCurrentUser = currentUserId && entry.user_id === currentUserId
              const hasViolations = entry.violation_score > 0

              return (
                <TableRow
                  key={entry.user_id + entry.rank}
                  className={`transition-colors ${
                    isCurrentUser ? 'bg-indigo-50/60 font-semibold' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Rank Badge */}
                  <TableCell className="text-center py-3">
                    <Badge
                      variant="outline"
                      className="h-7 w-7 justify-center p-0 text-xs rounded-lg bg-slate-100 text-slate-900 border-slate-300 font-mono font-bold"
                    >
                      {entry.rank}
                    </Badge>
                  </TableCell>

                  {/* Candidate Name & Email */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-200 shrink-0">
                        <AvatarImage src={entry.profile_pic ?? undefined} alt={entry.firstname} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-900 text-xs font-bold">
                          {entry.firstname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 max-w-[200px] sm:max-w-[260px]">
                        <span className="truncate block font-bold text-slate-900 text-sm">
                          {entry.firstname} {entry.lastname} {isCurrentUser && '(You)'}
                        </span>
                        <span className="text-xs text-slate-500 font-normal truncate block">
                          {entry.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Score */}
                  <TableCell className="py-3 font-black text-slate-900 text-sm">
                    {entry.score} <span className="text-xs font-normal text-slate-500">pts</span>
                  </TableCell>

                  {/* Duration */}
                  <TableCell className="py-3 text-slate-700 font-mono font-semibold text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDuration(entry.duration_seconds)}</span>
                    </div>
                  </TableCell>

                  {/* Integrity Badge */}
                  <TableCell className="py-3">
                    {hasViolations ? (
                      <Badge
                        variant="outline"
                        className="text-xs font-bold py-0.5 px-2.5 gap-1 rounded-md bg-rose-50 text-rose-700 border-rose-200 inline-flex items-center"
                      >
                        <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                        <span>{entry.violation_score} Flagged</span>
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs font-bold py-0.5 px-2.5 gap-1 rounded-md bg-emerald-50 text-emerald-700 border-emerald-200 inline-flex items-center"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Clean Record</span>
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {rankings.length > pageSize && (
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
          <span>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong>–<strong>{Math.min(currentPage * pageSize, rankings.length)}</strong> of <strong>{rankings.length}</strong> participants
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 p-0 rounded-lg cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-bold text-slate-800 px-2 font-mono">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 p-0 rounded-lg cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}