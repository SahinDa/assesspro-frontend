import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { UserRole, type UserRoleType } from '@/config/enums'
import AttemptFilterBar, { type SortOrder } from '../components/AttemptFilterBar'
import AttemptSummaryCard from '../components/AttemptSummaryCard'
import AttemptReviewSheet from '../components/AttemptReviewSheet'
import { useHistory } from '../api/useHistoryQueries'
import type {
  AttemptSummaryItem,
  QuestionBreakdown,
} from '../utils/attemptValidation'

interface TestOption {
  id: string
  title: string
  sets: Array<{ id: string; name: string }>
}

interface TestAttemptsViewProps {
  userRole?: UserRoleType
}

export default function TestAttemptsView({ userRole = UserRole.STUDENT }: TestAttemptsViewProps) {
  const isOrg = userRole === UserRole.ORGANIZATION

  const [selectedTestId, setSelectedTestId] = useState<string>('ALL')
  const [selectedSetId, setSelectedSetId] = useState<string>('ALL')
  const [sortOrder, setSortOrder] = useState<SortOrder>('date_desc')

  const [activeAttempt, setActiveAttempt] = useState<AttemptSummaryItem | null>(null)

  const { data: historyResponse, isLoading, isError } = useHistory()

  const attempts: AttemptSummaryItem[] = useMemo(() => {
    const list = historyResponse?.data ?? []
    return list.map((item) => ({
      attempt_id: item.attemptId,
      test_id: item.testId,
      test_title: item.testName || 'Untitled Test',
      set_id: item.setId,
      set_name: item.setName || 'Default Set',
      student_id: item.userId,
      student_name: item.studentName || 'Student',
      student_email: '',
      attempt_number: item.attemptNumber,
      start_time: item.startTime,
      end_time: item.startTime,
      time_spent_seconds: 0,
      score: item.finalScore ?? 0,
      max_score: 0,
      violation_score: 0,
    }))
  }, [historyResponse])

  
  const testOptions: TestOption[] = useMemo(() => {
    const record: Record<string, { id: string; title: string; sets: Record<string, string> }> = {}

    attempts.forEach((item) => {
      if (!item.test_id) return
      if (!record[item.test_id]) {
        record[item.test_id] = {
          id: item.test_id,
          title: item.test_title,
          sets: {},
        }
      }
      if (item.set_id && item.set_name) {
        record[item.test_id].sets[item.set_id] = item.set_name
      }
    })

    return Object.values(record).map((t) => ({
      id: t.id,
      title: t.title,
      sets: Object.entries(t.sets).map(([id, name]) => ({ id, name })),
    }))
  }, [attempts])

  const activeTest = useMemo(() => {
  return testOptions.find((t) => t.id === selectedTestId)
}, [testOptions, selectedTestId])

  const availableSets = useMemo(() => {
    return activeTest ? activeTest.sets : []
  }, [activeTest])

  const handleTestChange = (val: string) => {
    setSelectedTestId(val)
    setSelectedSetId('ALL')
  }

  const filteredAttempts = useMemo(() => {
    return attempts.filter((item) => {
      if (selectedTestId !== 'ALL' && item.test_id !== selectedTestId) return false
      if (selectedSetId !== 'ALL' && item.set_id !== selectedSetId) return false
      return true
    }).sort((a, b) => {
      if (sortOrder === 'date_desc') {
        return new Date(b.end_time).getTime() - new Date(a.end_time).getTime()
      }
      if (sortOrder === 'date_asc') {
        return new Date(a.end_time).getTime() - new Date(b.end_time).getTime()
      }
      if (sortOrder === 'score_desc') {
        return b.score - a.score
      }
      if (sortOrder === 'score_asc') {
        return a.score - b.score
      }
      return 0
    })
  }, [attempts,selectedTestId, selectedSetId, sortOrder])

  // Sub-view: Detailed Attempt Solution Sheet
  if (activeAttempt) {
    return (
      <AttemptReviewSheet
        attempt={activeAttempt}
        questions={[]}
        isOrg={isOrg}
        onBack={() => setActiveAttempt(null)}
      />
    )
  }

  // Primary view: Chronological Feed
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          {isOrg ? 'Assessment Submissions Roster' : 'My Attempt History'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isOrg
            ? 'Audit candidate exam attempts, proctoring records, and evaluation breakdowns.'
            : 'Track your personal test progression, score summaries, and question answers.'}
        </p>
      </div>

      <AttemptFilterBar
        tests={testOptions}
        selectedTestId={selectedTestId}
        selectedSetId={selectedSetId}
        availableSets={availableSets}
        sortOrder={sortOrder}
        onTestChange={handleTestChange}
        onSetChange={setSelectedSetId}
        onSortChange={setSortOrder}
      />

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="h-28 animate-pulse bg-slate-100 rounded-2xl border-none" />
            ))}
          </div>
        ) : isError ? (
          <Card className="rounded-2xl border-rose-200 bg-rose-50/50 p-8 text-center">
            <p className="text-xs font-semibold text-rose-600">
              Failed to load attempt history. Please try refreshing.
            </p>
          </Card>
        ): filteredAttempts.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-slate-200 p-12 text-center">
            <p className="text-xs font-semibold text-slate-500">
              No completed test attempts match your selected criteria.
            </p>
          </Card>
        ) : (
          filteredAttempts.map((item) => (
            <AttemptSummaryCard
              key={item.attempt_id}
              item={item}
              isOrg={isOrg}
              onInspect={() => setActiveAttempt(item)}
            />
          ))
        )}
      </div>
    </div>
  )
}