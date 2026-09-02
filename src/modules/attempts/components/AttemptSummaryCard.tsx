import { Calendar, Clock, ShieldAlert, CheckCircle2, User, ArrowRight, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDuration, type AttemptSummaryItem } from '../utils/attemptValidation'

interface AttemptSummaryCardProps {
  item: AttemptSummaryItem
  isOrg: boolean
  onInspect: () => void
}

export default function AttemptSummaryCard({
  item,
  isOrg,
  onInspect,
}: AttemptSummaryCardProps) {
  // Extract initials for the candidate avatar
  const getInitials = (name?: string) => {
    if (!name) return 'ST'
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-200 hover:shadow-xs transition-all">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Left Section */}
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Candidate Avatar (Shown for Organization) */}
          {isOrg && (
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100/80 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {getInitials(item.student_name)}
            </div>
          )}

          <div className="space-y-1">
            {/* Top Badge Row */}
            <div className="flex flex-wrap items-center gap-2">
              {isOrg ? (
                // Organization Headline: Candidate Name
                <>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {item.student_name || 'Anonymous Student'}
                  </span>
                  {item.student_email && (
                    <span className="text-[11px] text-slate-400 font-normal">
                      ({item.student_email})
                    </span>
                  )}
                </>
              ) : (
                // Student Headline: Test / Course Title
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold bg-indigo-50/70 text-indigo-700 border-indigo-200/80 py-0"
                >
                  {item.test_title}
                </Badge>
              )}

              <Badge
                variant="outline"
                className="text-[10px] font-semibold bg-slate-100 text-slate-700 border-slate-200 py-0"
              >
                Attempt #{item.attempt_number}
              </Badge>

              {item.violation_score > 0 ? (
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1 py-0"
                >
                  <ShieldAlert className="h-3 w-3 text-amber-600" />
                  {item.violation_score} Flag(s)
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1 py-0"
                >
                  <CheckCircle2 className="h-3 w-3" /> Clean
                </Badge>
              )}
            </div>

            {/* Test Set Title & Subtitle */}
            <div>
              <h3 className="text-sm font-bold text-slate-900">{item.set_name}</h3>
              {isOrg && (
                <p className="text-[11px] font-medium text-indigo-600">
                  {item.test_title}
                </p>
              )}
            </div>

            {/* Metadata (Date & Duration) */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium pt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                {new Date(item.end_time).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                {formatDuration(item.time_spent_seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Score and Inspect Button */}
        <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-3 sm:pt-0">
          <div className="text-left sm:text-right">
            <span className="text-sm font-black text-indigo-600 block">
              {Number(item.score).toFixed(2)} / {item.max_score}
            </span>
            <span className="text-[10px] font-medium text-slate-400">Total Score</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={onInspect}
            className="rounded-xl text-xs h-8 px-3 gap-1.5 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
          >
            <span>{isOrg ? 'Audit Submission' : 'View Solutions'}</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}