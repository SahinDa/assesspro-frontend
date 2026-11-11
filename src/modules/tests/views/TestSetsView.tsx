import { useState } from 'react'
import { useParams } from 'react-router-dom'
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
  Loader2,
  Bookmark,
  Users,
} from 'lucide-react'
import TestRunnerView from './TestRunnerView'
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
import { UserRole, type UserRoleType, BookmarkType, BookmarkTarget, TestStatus } from '@/config/enums'
import type { TestSetFormData } from '../utils/testSetValidation'
import { useTestSetList, useTestSetCount } from '../api/useTestSetQueries'
import { useTestSetMutations } from '../api/useTestSetMutations'
import { testSetService } from '../services/testsetService'
import { useAttemptMutations } from '../api/useAttemptMutations'
import BookmarkToggleButton from '@/modules/bookmarks/components/BookmarkToggleButton'
import { useToggleBookmarkMutation } from '@/modules/bookmarks/api/useToggleBookmarkMutation'

interface TestSetsViewProps {
  testId?: string
  testName?: string
  userRole?: UserRoleType
  readOnly?: boolean
  onBack?: () => void
  onTakeTestSet?: (setId: string) => void
}

export default function TestSetsView({
  testId: propTestId,
  testName: propTestName,
  userRole = UserRole.ORGANIZATION,
  readOnly = false,
  onBack,
  onTakeTestSet,
}: TestSetsViewProps) {
  const { testId: routeTestId } = useParams<{ testId: string }>()
  const resolvedTestId = propTestId || routeTestId
  const displayName = propTestName || 'Test Details'

  const {
    data: testSets = [],
    isLoading,
    isError,
    error,
  } = useTestSetList(resolvedTestId)

  const { data: totalCount = 0 } = useTestSetCount(resolvedTestId)

  const {
    createTestSet,
    updateTestSet,
    deleteTestSet,
  } = useTestSetMutations()
  const { startAttempt } = useAttemptMutations()

  const {
    mutate: toggleBookmark,
    isPending: isBookmarkPending,
    variables: pendingBookmarkVars,
  } = useToggleBookmarkMutation()

  const [sessionData, setSessionData] = useState<any>(null)

  const isStudent = userRole === UserRole.STUDENT
  const isAdmin = userRole === UserRole.ADMIN || readOnly
  const isOrgAuthor = userRole === UserRole.ORGANIZATION && !readOnly

  const handleToggleBookmark = (set: TestSetItem, target?: BookmarkTarget) => {
    const setId = set.set_id || (set as any).id
    if (!setId) return

    toggleBookmark({
      item_id: setId,
      item_type: BookmarkType.TEST_SET,
      ...(!isStudent && { target_type: target ?? BookmarkTarget.ORGANIZATION }),
    })
  }

  const handleTakeTest = (set: TestSetItem) => {
    if (!resolvedTestId || !set.set_id) return

    startAttempt.mutate(
      { test_id: resolvedTestId, testset_id: set.set_id },
      {
        onSuccess: (res) => {
          onTakeTestSet?.(set.set_id)
          setSessionData(res.data)
        },
      }
    )
  }

  const [selectedSetForDetails, setSelectedSetForDetails] = useState<TestSetItem | null>(null)
  const [loadingEditSetId, setLoadingEditSetId] = useState<string | null>(null)

  const [modalState, setModalState] = useState<{
    isOpen: boolean
    testSet: TestSetItem | null
  }>({
    isOpen: false,
    testSet: null,
  })

  const [deletingSet, setDeletingSet] = useState<TestSetItem | null>(null)

  const handleEditFromCard = async (set: TestSetItem) => {
    const setId = set.set_id || (set as any).id || (set as any)._id

    if (Array.isArray(set.questions) && set.questions.length > 0) {
      setModalState({
        isOpen: true,
        testSet: {
          ...set,
          id: setId,
          set_id: setId,
        },
      })
      return
    }

    try {
      setLoadingEditSetId(setId)

      const res = await testSetService.getTestSet({
        testId: resolvedTestId!,
        testSetId: setId,
      })

      const fullData = res.data

      setModalState({
        isOpen: true,
        testSet: {
          ...set,
          ...fullData,
          id: setId,
          set_id: setId,
        },
      })
    } catch (err) {
      console.error('Failed to load full test set questions:', err)
      setModalState({
        isOpen: true,
        testSet: {
          ...set,
          id: setId,
          set_id: setId,
        },
      })
    } finally {
      setLoadingEditSetId(null)
    }
  }

  const handleSaveTestSet = (data: TestSetFormData, id?: string) => {
    if (!resolvedTestId) return

    if (id) {
      updateTestSet.mutate(
        {
          testId: resolvedTestId,
          testSetId: id,
          payload: data,
        },
        {
          onSuccess: () => {
            setModalState({ isOpen: false, testSet: null })
          },
        }
      )
    } else {
      createTestSet.mutate(
        {
          testId: resolvedTestId,
          payload: data,
        },
        {
          onSuccess: () => {
            setModalState({ isOpen: false, testSet: null })
          },
        }
      )
    }
  }

  const handleConfirmDelete = (id: string) => {
    if (!resolvedTestId) return

    deleteTestSet.mutate(
      {
        testId: resolvedTestId,
        testSetId: id,
      },
      {
        onSuccess: () => {
          setDeletingSet(null)
          if (selectedSetForDetails?.id === id) {
            setSelectedSetForDetails(null)
          }
        },
      }
    )
  }

  if (!resolvedTestId) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center p-4">
        <p className="text-sm font-semibold text-slate-800">No Test Selected</p>
        <p className="text-xs text-slate-500">Please select a valid test to inspect its test sets.</p>
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack} className="mt-2 text-xs">
            Go Back
          </Button>
        )}
      </div>
    )
  }

  if (isStudent && sessionData) {
    return (
      <TestRunnerView
        attemptId={sessionData.attempt_id}
        questions={sessionData.testsetDetails?.questions || []}
        timerMinutes={sessionData.timer_minutes || sessionData.testsetDetails?.timer_minutes}
        testName={displayName}
        setName={sessionData.testsetDetails?.name}
        positiveMarks={sessionData?.testsetDetails?.positive_marking_value}
        isNegativeMarking={sessionData?.testsetDetails?.is_negative_marking}
        negativeMarks={sessionData?.testsetDetails?.negative_score_value}
        onExit={() => setSessionData(null)}
      />
    )
  }

  if (!isStudent && selectedSetForDetails) {
    return (
      <>
        <TestSetDetailsView
          testId={resolvedTestId}
          testSetId={selectedSetForDetails.set_id}
          initialTestSet={selectedSetForDetails}
          testName={displayName}
          readOnly={!isOrgAuthor}
          showAnswers={!isStudent}
          onBack={() => setSelectedSetForDetails(null)}
          onEdit={(fullLoadedSet?: TestSetItem) => {
            if (!isAdmin) {
              const activeSet = fullLoadedSet || selectedSetForDetails
              const setId = activeSet.set_id || (activeSet as any).id

              setModalState({
                isOpen: true,
                testSet: {
                  ...activeSet,
                  id: setId,
                  set_id: setId,
                } as TestSetItem,
              })
            }
          }}
          onPreview={() => {
            onTakeTestSet?.(selectedSetForDetails.set_id)
          }}
        />

        {isOrgAuthor && (
          <TestSetFormModal
            isOpen={modalState.isOpen}
            testSet={modalState.testSet}
            onClose={() => setModalState({ isOpen: false, testSet: null })}
            onSubmit={handleSaveTestSet}
            isSubmitting={createTestSet.isPending || updateTestSet.isPending}
          />
        )}
      </>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-500 font-medium">Loading test sets...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-semibold text-rose-600">Failed to load test sets</p>
        <p className="text-xs text-slate-500">{(error as any)?.message || 'Please try again later'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{displayName}</h2>
            <Badge
              variant="secondary"
              className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded-lg px-2 border border-indigo-100"
            >
              {totalCount} {totalCount === 1 ? 'Set' : 'Sets'}
            </Badge>
            {isAdmin && (
              <Badge variant="outline" className="text-[10px] font-bold bg-amber-50 text-amber-800 border-amber-200">
                Audit View
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {isAdmin
              ? 'Inspect test sets and questions for moderation and compliance.'
              : isStudent
                ? 'Review scoring rules, timer limits, and launch your test attempt.'
                : 'Configure test sets, inspect questions, grading criteria, and countdown timers.'}
          </p>
        </div>

        {isOrgAuthor && testSets.length > 0 && (
          <Button
            type="button"
            onClick={() => setModalState({ isOpen: true, testSet: null })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" /> Create Test Set
          </Button>
        )}
      </div>

      {testSets.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-sm w-full bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
              <FolderPlus className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isAdmin ? 'No Sets Configured' : isStudent ? 'No Test Sets Published' : 'No Test Sets Yet'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAdmin
                  ? 'This test does not have any sets or questions attached.'
                  : isStudent
                    ? 'There are currently no active question sets configured for this test module.'
                    : 'Create a test set to configure questions, scoring, and timer rules for this assessment.'}
              </p>
            </div>

            {isOrgAuthor && (
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
          {testSets.map((set, index) => {
            const setId = set.set_id || (set as any).id || (set as any)._id
            const isSetLoading = loadingEditSetId === setId

            return (
              <Card
                key={setId || `set-${index}`}
                onClick={() => {
                  if (isStudent) {
                    handleTakeTest(set)
                    onTakeTestSet?.(set.set_id)
                  } else {
                    setSelectedSetForDetails(set)
                  }
                }}
                className="group relative rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-sky-400 to-teal-400 opacity-80" />

                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
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
                      {isStudent && set.is_student_bookmarked && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-semibold gap-1 py-0.5"
                        >
                          <Bookmark className="h-3 w-3 fill-amber-500 text-amber-500" /> Curated
                        </Badge>
                      )}
                    </div>

                    {/* Student Bookmark Toggle */}
                    {isStudent && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <BookmarkToggleButton
                          isBookmarked={Boolean(set.is_bookmarked)}
                          isLoading={
                            isBookmarkPending &&
                            (pendingBookmarkVars as any)?.item_id === setId
                          }
                          onToggle={() => handleToggleBookmark(set)}
                        />
                      </div>
                    )}

                    {/* Organization Bookmark Indicator & 3-Dot Actions */}
                    {isOrgAuthor && (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {(set.is_bookmarked || set.is_student_bookmarked) && (
                          <div
                            title={
                              set.is_bookmarked && set.is_student_bookmarked
                                ? 'Bookmarked for Org & Students'
                                : set.is_bookmarked
                                  ? 'Bookmarked for Org'
                                  : 'Bookmarked for Students'
                            }
                            className="h-7 px-2 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-1 text-[11px] font-semibold text-amber-700"
                          >
                            <Bookmark className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            {set.is_bookmarked && set.is_student_bookmarked ? (
                              <span>Org & Student</span>
                            ) : set.is_bookmarked ? (
                              <span>Org</span>
                            ) : (
                              <span>Student</span>
                            )}
                          </div>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none border-0 bg-transparent">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-52 rounded-xl p-1 shadow-lg border-slate-200 bg-white z-30"
                          >
                            <DropdownMenuItem
                              disabled={set.status !== undefined && set.status !== TestStatus.ACTIVE}
                              onClick={() =>
                                (set.status === undefined || set.status === TestStatus.ACTIVE) &&
                                handleToggleBookmark(set, BookmarkTarget.ORGANIZATION)
                              }
                              className={`text-xs font-medium gap-2 rounded-lg py-2 ${
                                set.status !== undefined && set.status !== TestStatus.ACTIVE
                                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                                  : 'cursor-pointer text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <Bookmark
                                className={`h-3.5 w-3.5 ${
                                  set.is_bookmarked ? 'fill-indigo-600 text-indigo-600' : 'text-indigo-600'
                                }`}
                              />
                              <span>{set.is_bookmarked ? 'Remove Org Bookmark' : 'Bookmark for Organization'}</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={set.status !== undefined && set.status !== TestStatus.ACTIVE}
                              onClick={() =>
                                (set.status === undefined || set.status === TestStatus.ACTIVE) &&
                                handleToggleBookmark(set, BookmarkTarget.STUDENT)
                              }
                              className={`text-xs font-medium gap-2 rounded-lg py-2 ${
                                set.status !== undefined && set.status !== TestStatus.ACTIVE
                                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                                  : 'cursor-pointer text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <Users
                                className={`h-3.5 w-3.5 ${
                                  set.is_student_bookmarked ? 'fill-amber-500 text-amber-500' : 'text-amber-500'
                                }`}
                              />
                              <span>{set.is_student_bookmarked ? 'Remove Student Bookmark' : 'Bookmark for Students'}</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1 bg-slate-100" />

                            <DropdownMenuItem
                              disabled={isSetLoading}
                              onClick={() => handleEditFromCard(set)}
                              className="text-xs font-medium gap-2 rounded-lg cursor-pointer py-2 text-slate-700 hover:bg-slate-50"
                            >
                              {isSetLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                              ) : (
                                <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                              )}
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

                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {set.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                      {set.description || (isStudent ? 'Standard examination instructions apply.' : 'No specific rules or instructions provided.')}
                    </p>
                  </div>

                  {isStudent ? (
                    <div className="pt-2 border-t border-slate-100">
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTakeTest(set)
                          onTakeTestSet?.(set.set_id)
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
                        <span>{isAdmin ? 'Inspect Questions' : 'View Details'}</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {isOrgAuthor && (
        <>
          <TestSetFormModal
            isOpen={modalState.isOpen}
            testSet={modalState.testSet}
            onClose={() => setModalState({ isOpen: false, testSet: null })}
            onSubmit={handleSaveTestSet}
            isSubmitting={createTestSet.isPending || updateTestSet.isPending}
          />

          <DeleteTestSetDialog
            isOpen={Boolean(deletingSet)}
            testSet={deletingSet}
            onClose={() => setDeletingSet(null)}
            onConfirm={handleConfirmDelete}
            isDeleting={deleteTestSet.isPending}
          />
        </>
      )}
    </div>
  )
}