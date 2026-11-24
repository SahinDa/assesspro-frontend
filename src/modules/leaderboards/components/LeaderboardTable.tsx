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
  isLoading?: boolean
  showTestColumn?: boolean
  showTestSetColumn?: boolean
}

export default function LeaderboardTable({
  rankings,
  currentUserId,
  isLoading = false,
  showTestColumn = false,
  showTestSetColumn = false,
}: LeaderboardTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(rankings.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [rankings.length])

  const paginatedList = rankings.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const showAssessmentColumn = showTestColumn || showTestSetColumn

  if (!isLoading && rankings.length === 0) {
    return (
      <Card className="text-center py-12 px-4 border-dashed border-slate-200 bg-white shadow-none space-y-2 rounded-2xl">
        <Trophy className="h-8 w-8 text-slate-300 mx-auto" />
        <div className="text-sm font-bold text-slate-700">No participants found</div>
        <div className="text-xs text-slate-500">Standings will appear once candidates complete their attempts.</div>
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
              {showAssessmentColumn && (
                <TableHead className="text-xs font-bold text-slate-700 uppercase">
                  {showTestColumn ? 'Assessment' : 'Test Set'}
                </TableHead>
              )}
              <TableHead className="text-xs font-bold text-slate-700 uppercase">Score</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 uppercase">Time Taken</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 uppercase">Integrity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs divide-y divide-slate-100">
            {isLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`} className="hover:bg-transparent">
                    <TableCell className="text-center py-3.5">
                      <div className="h-7 w-7 rounded-lg mx-auto bg-slate-200/70 animate-pulse" />
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full shrink-0 bg-slate-200/70 animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-32 rounded-md bg-slate-200/70 animate-pulse" />
                          <div className="h-3 w-44 rounded-md bg-slate-100 animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    {showAssessmentColumn && (
                      <TableCell className="py-3.5">
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-36 rounded-md bg-slate-200/70 animate-pulse" />
                          {showTestColumn && showTestSetColumn && (
                            <div className="h-3 w-24 rounded-md bg-slate-100 animate-pulse" />
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="py-3.5">
                      <div className="h-4 w-14 rounded-md bg-slate-200/70 animate-pulse" />
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="h-6 w-20 rounded-md bg-slate-200/70 animate-pulse" />
                    </TableCell>
                    <TableCell className="py-3.5">
                      <div className="h-6 w-24 rounded-md bg-slate-200/70 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              : paginatedList.map((entry) => {
                  const isCurrentUser = currentUserId && entry.user_id === currentUserId
                  const hasViolations = entry.violation_score > 0
                  const firstName = entry.firstname ?? ''
                  const lastName = entry.lastname ?? ''
                  const initial = (firstName || entry.email || 'U').charAt(0).toUpperCase()

                  return (
                    <TableRow
                      key={entry.attempt_id || `${entry.user_id}-${entry.rank}`}
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
                          <Avatar className="h-9 w-9 rounded-full border border-slate-200 shrink-0 overflow-hidden aspect-square">
                            <AvatarImage
                              className="rounded-full object-cover w-full h-full aspect-square"
                              src={entry.profile_pic ?? undefined}
                              alt={firstName || entry.email}
                            />
                            <AvatarFallback className="h-full w-full rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center justify-center aspect-square">
                              {initial}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 max-w-[200px] sm:max-w-[240px]">
                            <div className="truncate font-bold text-slate-900 text-sm">
                              {firstName} {lastName} {isCurrentUser && '(You)'}
                            </div>
                            <div className="text-xs text-slate-500 font-normal truncate">
                              {entry.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Assessment / Test Set */}
                      {showAssessmentColumn && (
                        <TableCell className="py-3">
                          <div className="flex flex-col gap-0.5 max-w-[220px]">
                            {showTestColumn && (
                              <span className="truncate font-semibold text-slate-900 text-xs">
                                {entry.test_name}
                              </span>
                            )}
                            {showTestSetColumn && (
                              <span
                                className={`truncate ${
                                  showTestColumn
                                    ? 'text-[11px] font-normal text-slate-500'
                                    : 'text-xs font-semibold text-slate-800'
                                }`}
                              >
                                {entry.testset_name}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      )}

                      {/* Score */}
                      <TableCell className="py-3 font-black text-slate-900 text-sm">
                        {entry.score} <span className="text-xs font-normal text-slate-500">pts</span>
                      </TableCell>

                      {/* Duration */}
                      <TableCell className="py-3">
                        <Badge variant="outline" className="text-xs font-mono font-semibold text-slate-700 bg-slate-50 border-slate-200 py-0.5 px-2 gap-1.5 inline-flex items-center">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {formatDuration(entry.duration_seconds)}
                        </Badge>
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
      {!isLoading && rankings.length > pageSize && (
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
          <div className="text-xs text-slate-600">
            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * pageSize + 1}</span>–<span className="font-bold text-slate-900">{Math.min(currentPage * pageSize, rankings.length)}</span> of <span className="font-bold text-slate-900">{rankings.length}</span> participants
          </div>
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
            <Badge variant="outline" className="text-xs font-bold text-slate-800 px-2.5 py-1 border-slate-200 bg-slate-50 font-mono">
              {currentPage} / {totalPages}
            </Badge>
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