import { useState } from 'react'
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Award,
  MoreHorizontal,
  Edit3,
  Trash2,
  Plus,
  FolderPlus,
  Play,
  Eye,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import TestSetFormModal, { type TestSetItem } from '../components/TestSetFormModal'
import DeleteTestSetDialog from '../components/DeleteTestSetDialog'
import TestSetDetailsView from './TestSetDetailsView'
import { NegativeMarkingOption, CorrectAnswer, UserRole, type UserRoleType } from '@/config/enums'
import type { TestSetFormData } from '../utils/testSetValidation'

const INITIAL_MOCK_SETS: TestSetItem[] = [
  {
    id: 'set-1',
    name: 'Set 1 - Fundamental Algorithms',
    description: 'Covers graph traversals, greedy approaches, and dynamic programming basics.',
    total_questions: 15,
    timer_minutes: 45,
    positive_marking_value: 2,
    is_negative_marking: true,
    negative_score_value: NegativeMarkingOption.QUARTER,
    questions: [
      {
        question_text: "What is the time complexity of Dijkstra's algorithm with a binary min-heap?",
        option_a: 'O(V^2)',
        option_b: 'O((V + E) log V)',
        option_c: 'O(E log V)',
        option_d: 'O(V log E)',
        correct_answer: CorrectAnswer.B,
      },
    ],
  },
  {
    id: 'set-2',
    name: 'Set 2 - Advanced Data Structures',
    description: 'Segment trees, Fenwick trees, Disjoint Set Union, and Trie problem sets.',
    total_questions: 20,
    timer_minutes: 60,
    positive_marking_value: 2,
    is_negative_marking: true,
    negative_score_value: NegativeMarkingOption.HALF,
    questions: [],
  },
]

interface TestSetsViewProps {
  testId?: string
  testName?: string
  userRole?: UserRoleType
  onBack?: () => void
  onTakeTestSet?: (setId: string) => void
}

export default function TestSetsView({
  testId = 'test-1',
  testName = 'Algorithms & Data Structures',
  userRole = UserRole.ORGANIZATION,
  onBack,
  onTakeTestSet,
}: TestSetsViewProps) {
  const [testSets, setTestSets] = useState<TestSetItem[]>(INITIAL_MOCK_SETS)

  // Strict role separation: true ONLY for Student, false for Organization/Admin
  const isStudent = userRole === UserRole.STUDENT

  // State to track which set the Organization is inspecting in Details View
  const [selectedSetForDetails, setSelectedSetForDetails] = useState<TestSetItem | null>(null)

  // Organization-only modal states
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    testSet: TestSetItem | null
  }>({
    isOpen: false,
    testSet: null,
  })

  const [deletingSet, setDeletingSet] = useState<TestSetItem | null>(null)

  const handleSaveTestSet = (data: TestSetFormData, id?: string) => {
    if (id) {
      setTestSets((prev) =>
        prev.map((set) => {
          if (set.id === id) {
            const updated = { ...set, ...data }
            if (selectedSetForDetails?.id === id) {
              setSelectedSetForDetails(updated)
            }
            return updated
          }
          return set
        })
      )
    } else {
      const newSet: TestSetItem = {
        ...data,
        id: `set-${Date.now()}`,
      }
      setTestSets((prev) => [newSet, ...prev])
    }
  }

  const handleConfirmDelete = (id: string) => {
    setTestSets((prev) => prev.filter((s) => s.id !== id))
    setDeletingSet(null)
    if (selectedSetForDetails?.id === id) {
      setSelectedSetForDetails(null)
    }
  }

  // 1. ORGANIZATION ONLY: Render Details View for inspecting questions/configuration
  if (!isStudent && selectedSetForDetails) {
    return (
      <>
        <TestSetDetailsView
          testSet={selectedSetForDetails}
          testName={testName}
          onBack={() => setSelectedSetForDetails(null)}
          onEdit={() => {
            setModalState({ isOpen: true, testSet: selectedSetForDetails })
          }}
          onPreview={() => {
            onTakeTestSet?.(selectedSetForDetails.id)
          }}
        />

        {/* Organization Edit Modal */}
        <TestSetFormModal
          isOpen={modalState.isOpen}
          testSet={modalState.testSet}
          onClose={() => setModalState({ isOpen: false, testSet: null })}
          onSubmit={handleSaveTestSet}
        />
      </>
    )
  }

  // 2. MAIN TEST SETS GRID VIEW
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-8 w-8 p-0 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{testName}</h2>
            <Badge
              variant="secondary"
              className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded-lg px-2 border border-indigo-100"
            >
              {testSets.length} {testSets.length === 1 ? 'Set' : 'Sets'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {isStudent
              ? 'Review scoring rules, timer limits, and launch your test attempt.'
              : 'Configure test sets, inspect questions, grading criteria, and countdown timers.'}
          </p>
        </div>

        {/* Create Test Set: Organization Only */}
        {!isStudent && testSets.length > 0 && (
          <Button
            type="button"
            onClick={() => setModalState({ isOpen: true, testSet: null })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" /> Create Test Set
          </Button>
        )}
      </div>

      {/* Grid or Empty State */}
      {testSets.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-sm w-full bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
              <FolderPlus className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isStudent ? 'No Test Sets Published' : 'No Test Sets Yet'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isStudent
                  ? 'There are currently no active question sets configured for this test module.'
                  : 'Create a test set to configure questions, scoring, and timer rules for this assessment.'}
              </p>
            </div>

            {/* Empty State Create Button: Organization Only */}
            {!isStudent && (
              <Button
                type="button"
                onClick={() => setModalState({ isOpen: true, testSet: null })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl h-10 px-5 gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Create Test Set
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testSets.map((set) => (
            <Card
              key={set.id}
              onClick={() => {
                if (isStudent) {
                  onTakeTestSet?.(set.id)
                } else {
                  setSelectedSetForDetails(set)
                }
              }}
              className="group relative rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-sky-400 to-teal-400 opacity-80" />

              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Metric Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="text-[11px] font-medium text-slate-700 bg-slate-50 border-slate-200 gap-1 py-0.5"
                    >
                      <Clock className="h-3 w-3 text-slate-400" />
                      {set.timer_minutes}m
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[11px] font-medium text-slate-700 bg-slate-50 border-slate-200 gap-1 py-0.5"
                    >
                      <HelpCircle className="h-3 w-3 text-slate-400" />
                      {set.total_questions} Qs
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border-emerald-200 gap-1 py-0.5"
                    >
                      <Award className="h-3 w-3 text-emerald-500" />
                      +{set.positive_marking_value} Marks
                    </Badge>
                    {set.is_negative_marking && (
                      <Badge
                        variant="outline"
                        className="text-[11px] font-medium text-rose-700 bg-rose-50 border-rose-200 gap-1 py-0.5"
                      >
                        -{set.negative_score_value} Neg
                      </Badge>
                    )}
                  </div>

                  {/* 3-Dot Edit / Delete Menu: Organization Only */}
                  {!isStudent && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none border-0 bg-transparent">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-36 rounded-xl p-1 shadow-lg border-slate-200 bg-white z-30"
                        >
                          <DropdownMenuItem
                            onClick={() => setModalState({ isOpen: true, testSet: set })}
                            className="text-xs font-medium gap-2 rounded-lg cursor-pointer py-2 text-slate-700 hover:bg-slate-50"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-slate-100" />
                          <DropdownMenuItem
                            onClick={() => setDeletingSet(set)}
                            className="text-xs font-medium gap-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer py-2"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {set.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {set.description || (isStudent ? 'Standard examination instructions apply.' : 'No specific rules or instructions provided.')}
                  </p>
                </div>

                {/* Role-Based Footer Actions */}
                {isStudent ? (
                  <div className="pt-2 border-t border-slate-100">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTakeTestSet?.(set.id)
                      }}
                      className="w-full h-9 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-xs cursor-pointer transition-all"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Take Test Set</span>
                    </Button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {set.questions?.length || 0} / {set.total_questions} Questions
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedSetForDetails(set)
                      }}
                      className="h-8 rounded-lg text-xs font-semibold px-2.5 gap-1.5 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 cursor-pointer transition-all"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View Details</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Organization-Only Modals */}
      {!isStudent && (
        <>
          <TestSetFormModal
            isOpen={modalState.isOpen}
            testSet={modalState.testSet}
            onClose={() => setModalState({ isOpen: false, testSet: null })}
            onSubmit={handleSaveTestSet}
          />

          <DeleteTestSetDialog
            isOpen={Boolean(deletingSet)}
            testSet={deletingSet}
            onClose={() => setDeletingSet(null)}
            onConfirm={handleConfirmDelete}
          />
        </>
      )}
    </div>
  )
}