import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { UserRole, type UserRoleType } from '@/config/enums'
import AttemptFilterBar, { type SortOrder } from '../components/AttemptFilterBar'
import AttemptSummaryCard from '../components/AttemptSummaryCard'
import AttemptReviewSheet from '../components/AttemptReviewSheet'
import type {
  AttemptSummaryItem,
  QuestionBreakdown,
} from '../utils/attemptValidation'

const MOCK_TESTS = [
  {
    id: 'test-ml',
    title: 'Machine Learning & AI Masterclass',
    sets: [
      { id: 'set-ml-1', name: 'Set 1 - Linear Regression & Cost Functions' },
      { id: 'set-ml-2', name: 'Set 2 - Neural Networks & Backpropagation' },
      { id: 'set-ml-3', name: 'Set 3 - Attention Mechanisms & Transformers' },
    ],
  },
  {
    id: 'test-dsa',
    title: 'Algorithms & Advanced Data Structures',
    sets: [
      { id: 'set-dsa-1', name: 'Set 1 - Trees, Binary Heaps & Graphs' },
      { id: 'set-dsa-2', name: 'Set 2 - Dynamic Programming & Bitmasking' },
    ],
  },
]

const MOCK_ATTEMPTS: AttemptSummaryItem[] = [
  {
    attempt_id: 'att-101',
    test_id: 'test-ml',
    test_title: 'Machine Learning & AI Masterclass',
    set_id: 'set-ml-2',
    set_name: 'Set 2 - Neural Networks & Backpropagation',
    student_id: 'usr-sahin',
    student_name: 'Sahin Dafader',
    student_email: 'sahin@example.com',
    attempt_number: 2,
    start_time: '2026-09-02T15:00:00Z',
    end_time: '2026-09-02T15:28:10Z',
    time_spent_seconds: 1690,
    score: 28.5,
    max_score: 30,
    violation_score: 0,
  },
  {
    attempt_id: 'att-102',
    test_id: 'test-dsa',
    test_title: 'Algorithms & Advanced Data Structures',
    set_id: 'set-dsa-1',
    set_name: 'Set 1 - Trees, Binary Heaps & Graphs',
    student_id: 'usr-aarav',
    student_name: 'Aarav Patel',
    student_email: 'aarav.patel@example.com',
    attempt_number: 1,
    start_time: '2026-09-02T14:10:00Z',
    end_time: '2026-09-02T14:45:00Z',
    time_spent_seconds: 2100,
    score: 22.0,
    max_score: 30,
    violation_score: 3,
  },
  {
    attempt_id: 'att-103',
    test_id: 'test-ml',
    test_title: 'Machine Learning & AI Masterclass',
    set_id: 'set-ml-1',
    set_name: 'Set 1 - Linear Regression & Cost Functions',
    student_id: 'usr-priya',
    student_name: 'Priya Sharma',
    student_email: 'priya.sharma@example.com',
    attempt_number: 1,
    start_time: '2026-08-30T10:00:00Z',
    end_time: '2026-08-30T10:33:00Z',
    time_spent_seconds: 1980,
    score: 25.0,
    max_score: 30,
    violation_score: 0,
  },
]

const MOCK_QUESTIONS_BREAKDOWN: QuestionBreakdown[] = [
  {
    question_id: 'q-1',
    question_text: "What is the worst-case time complexity of Dijkstra's algorithm implemented with a binary min-heap for a graph with V vertices and E edges?",
    option_a: 'O(V^2)',
    option_b: 'O((V + E) log V)',
    option_c: 'O(E log V)',
    option_d: 'O(V log E)',
    selected_option: 2,
    correct_answer: 2,
    is_correct: true,
    marks_awarded: 2.0,
    time_spent_seconds: 45,
    explanation: 'Using a binary min-heap, extract-min is called V times taking O(V log V), and decrease-key is called up to E times taking O(E log V), giving total time O((V + E) log V).',
  },
  {
    question_id: 'q-2',
    question_text: 'Which standard data structure is utilized in Breadth-First Search (BFS) graph traversal?',
    option_a: 'Stack (LIFO)',
    option_b: 'Queue (FIFO)',
    option_c: 'Self-balancing BST',
    option_d: 'Priority Queue (Max-Heap)',
    selected_option: 1,
    correct_answer: 2,
    is_correct: false,
    marks_awarded: -0.5,
    time_spent_seconds: 30,
    explanation: 'BFS explores neighbor vertices in standard FIFO order, necessitating a Queue. Stacks are used for Depth-First Search (DFS).',
  },
  {
    question_id: 'q-3',
    question_text: 'In database management systems, which ACID property guarantees that committed transactions survive subsequent system crashes or power failures?',
    option_a: 'Atomicity',
    option_b: 'Consistency',
    option_c: 'Isolation',
    option_d: 'Durability',
    selected_option: null,
    correct_answer: 4,
    is_correct: false,
    marks_awarded: 0.0,
    time_spent_seconds: 15,
    explanation: 'Durability ensures that once a transaction has completed and committed, its modifications permanently persist in non-volatile storage.',
  },
]

interface TestAttemptsViewProps {
  userRole?: UserRoleType
}

export default function TestAttemptsView({ userRole = UserRole.STUDENT }: TestAttemptsViewProps) {
  const isOrg = userRole === UserRole.ORGANIZATION

  const [selectedTestId, setSelectedTestId] = useState<string>('ALL')
  const [selectedSetId, setSelectedSetId] = useState<string>('ALL')
  const [sortOrder, setSortOrder] = useState<SortOrder>('date_desc')

  const [activeAttempt, setActiveAttempt] = useState<AttemptSummaryItem | null>(null)

  const activeTest = useMemo(() => {
    return MOCK_TESTS.find((t) => t.id === selectedTestId)
  }, [selectedTestId])

  const availableSets = useMemo(() => {
    return activeTest ? activeTest.sets : []
  }, [activeTest])

  const handleTestChange = (val: string) => {
    setSelectedTestId(val)
    setSelectedSetId('ALL')
  }

  const filteredAttempts = useMemo(() => {
    return MOCK_ATTEMPTS.filter((item) => {
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
  }, [selectedTestId, selectedSetId, sortOrder])

  // Sub-view: Detailed Attempt Solution Sheet
  if (activeAttempt) {
    return (
      <AttemptReviewSheet
        attempt={activeAttempt}
        questions={MOCK_QUESTIONS_BREAKDOWN}
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
        tests={MOCK_TESTS}
        selectedTestId={selectedTestId}
        selectedSetId={selectedSetId}
        availableSets={availableSets}
        sortOrder={sortOrder}
        onTestChange={handleTestChange}
        onSetChange={setSelectedSetId}
        onSortChange={setSortOrder}
      />

      <div className="space-y-3">
        {filteredAttempts.length === 0 ? (
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