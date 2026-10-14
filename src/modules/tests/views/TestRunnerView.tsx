import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Clock,
  AlertTriangle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAttemptMutations } from '../api/useAttemptMutations'
import { attemptService } from '../services/attemptService'
import type { SingleAnswerDto, SaveProgressPayload, SubmitAttemptResponse } from '../types/attempt.types'
import {
  CorrectAnswer,
  AnswerOption,
  SubmissionType,
  ViolationType,
  VIOLATION_TITLES,
} from '@/config/enums'

export interface RunnerQuestion {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer?: number
}

export interface TestRunnerProps {
  attemptId: string
  questions?: any[]
  testName?: string
  setName?: string
  timerMinutes?: number
  positiveMarks?: number
  negativeMarks?: number
  isNegativeMarking?: boolean
  isPreview?: boolean
  onExit: () => void
  onSubmitAttempt?: (payload: {
    attemptId?: string
    answers: Record<string, number>
    timeSpentSeconds: number
    violations: Array<{ type: ViolationType; timestamp: number; label: string }>
  }) => void
}

// ---------------------------------------------------------------------------
// SHARED DELTA CALCULATION HELPER
// ---------------------------------------------------------------------------
function calculateAnswerDelta(
  currentAnswers: Record<string, number>,
  previouslySaved: Record<string, number>
): SingleAnswerDto[] {
  const delta: SingleAnswerDto[] = []

  // Newly selected or modified options
  for (const [question_id, selected_option] of Object.entries(currentAnswers)) {
    if (previouslySaved[question_id] !== selected_option) {
      delta.push({
        question_id,
        selected_option: selected_option as AnswerOption,
      })
    }
  }

  // Cleared responses
  for (const previouslySavedId of Object.keys(previouslySaved)) {
    if (currentAnswers[previouslySavedId] === undefined) {
      delta.push({
        question_id: previouslySavedId,
        selected_option: null as any,
      })
    }
  }

  return delta
}

export default function TestRunnerView({
  attemptId,
  questions: initialQuestions = [],
  testName = 'Algorithms & Data Structures',
  setName = 'Set 1 - Core Fundamentals',
  timerMinutes = 30,
  positiveMarks = 1,
  negativeMarks = 0,
  isNegativeMarking = false,
  isPreview = false,
  onExit,
  onSubmitAttempt,
}: TestRunnerProps) {
  const [questions] = useState<RunnerQuestion[]>(() =>
    (initialQuestions || []).map((q: any) => ({
      id: q.question_id || q.id,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
    }))
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({})
  const [visitedQuestions, setVisitedQuestions] = useState<Record<string, boolean>>({})

  const { saveProgress, submitAttempt } = useAttemptMutations()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)
  const isSavingRef = useRef(false)

  const [submissionResult, setSubmissionResult] = useState<SubmitAttemptResponse | null>(null)
  
  // Timer & Screen
  const [secondsRemaining, setSecondsRemaining] = useState(timerMinutes * 60)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenRequiredPrompt, setFullscreenRequiredPrompt] = useState(false)

  // Violations Tracking
  const [violations, setViolations] = useState<Array<{ type: ViolationType; timestamp: number; label: string }>>([])
  const [activeWarning, setActiveWarning] = useState<{ type: ViolationType; message: string; count: number } | null>(null)

  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSecondsRef = useRef(timerMinutes * 60)
  const hasInitializedFullscreen = useRef(false)

  const answersRef = useRef<Record<string, number>>(answers)
  const savedAnswersRef = useRef<Record<string, number>>({})
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  // ---------------------------------------------------------------------------
  // AUTO-SAVE DISPATCHER (DEADZONE + IN-FLIGHT MUTEX)
  // ---------------------------------------------------------------------------
  const triggerSaveProgress = useCallback(async () => {
    if (
      isSubmittingRef.current ||
      isSubmitted ||
      isPreview ||
      !attemptId ||
      isSavingRef.current ||
      secondsRemaining <= 10
    ) {
      return
    }

    const currentAnswers = answersRef.current
    const previouslySaved = savedAnswersRef.current
    const changedAnswers = calculateAnswerDelta(currentAnswers, previouslySaved)

    if (changedAnswers.length === 0) return

    const payload: SaveProgressPayload = {
      attemptId,
      payload: {
        answers: changedAnswers,
      },
    }

    try {
      isSavingRef.current = true
      await saveProgress.mutateAsync(payload)
      savedAnswersRef.current = { ...currentAnswers }
    } catch (err) {
      console.error('Failed to auto-save test progress:', err)
    } finally {
      isSavingRef.current = false
    }
  }, [attemptId, isSubmitted, isPreview, secondsRemaining, saveProgress])

  // ---------------------------------------------------------------------------
  // 1. AUTO FULLSCREEN REQUEST ON START
  // ---------------------------------------------------------------------------
  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
        setFullscreenRequiredPrompt(false)
      }
    } catch {
      setFullscreenRequiredPrompt(true)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
        setFullscreenRequiredPrompt(false)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch {
      // Ignored
    }
  }

  // ---------------------------------------------------------------------------
  // 2. INITIALIZE TEST
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!hasInitializedFullscreen.current) {
      hasInitializedFullscreen.current = true
      enterFullscreen()
    }
  }, [enterFullscreen])

  // ---------------------------------------------------------------------------
  // 3. VIOLATION RECORDER
  // ---------------------------------------------------------------------------
  const triggerViolation = useCallback(
    (type: ViolationType, customMessage?: string) => {
      if (isSubmittingRef.current || isSubmitted || isPreview) return

      const label = VIOLATION_TITLES[type] || 'Integrity Violation'
      const message = customMessage || `${label} has been logged.`

      setViolations((prev) => {
        const nextList = [...prev, { type, timestamp: Date.now(), label }]
        const occurrences = nextList.filter((v) => v.type === type).length

        setActiveWarning({
          type,
          message,
          count: occurrences,
        })
        return nextList
      })
    },
    [isSubmitted, isPreview]
  )

  // ---------------------------------------------------------------------------
  // 4. LISTENERS FOR VIOLATIONS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isSubmitted) return

    const handleVisibilityChange = () => {
      if (isSubmittingRef.current || isSubmitted) return
      if (document.hidden) {
        triggerViolation(ViolationType.TAB_SWITCH, 'Tab switch or window minimization detected.')
      }
    }

    const handleWindowBlur = () => {
      if (isSubmittingRef.current || isSubmitted) return
      triggerViolation(ViolationType.WINDOW_BLUR, 'Focus lost from the test runner window.')
    }

    const handleFullscreenChange = () => {
      const inFullscreen = Boolean(document.fullscreenElement)
      setIsFullscreen(inFullscreen)
      if (!inFullscreen && !isSubmitted && !isSubmittingRef.current) {
        setFullscreenRequiredPrompt(true)
        triggerViolation(ViolationType.FULLSCREEN_EXIT, 'Fullscreen mode was exited.')
      }
    }

    const handleCopy = (e: ClipboardEvent) => {
      if (isSubmittingRef.current || isSubmitted) return
      e.preventDefault()
      triggerViolation(ViolationType.CLIPBOARD_COPY, 'Copying question content is prohibited.')
    }

    const handlePaste = (e: ClipboardEvent) => {
      if (isSubmittingRef.current || isSubmitted) return
      e.preventDefault()
      triggerViolation(ViolationType.CLIPBOARD_PASTE, 'Pasting external content is prohibited.')
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmittingRef.current || isSubmitted) return
      const isDevKey =
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        ((e.ctrlKey || e.metaKey) && ['u', 'U'].includes(e.key))

      if (isDevKey) {
        e.preventDefault()
        triggerViolation(ViolationType.DEV_TOOLS, 'Developer tools shortcut detected and blocked.')
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('paste', handlePaste)
    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('paste', handlePaste)
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [isSubmitted, triggerViolation])

  // ---------------------------------------------------------------------------
  // TAB / BROWSER CLOSE FLUSH (DISCONNECT ATTEMPT)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleTabClose = () => {
      if (isSubmittingRef.current || isSubmitted || isPreview || !attemptId) {
        return
      }

      isSubmittingRef.current = true

      const currentAnswers = answersRef.current
      const previouslySaved = savedAnswersRef.current
      const unsavedAnswers = calculateAnswerDelta(currentAnswers, previouslySaved)

      // Call the service directly — DO NOT use useMutation / disconnectAttempt.mutate()
      attemptService.disconnectAttempt({
        attemptId,
        payload: {
          submitted_via: SubmissionType.DISCONNECTED,
          answers: unsavedAnswers,
        },
      }).catch((err) => {
        console.error('Failed to dispatch disconnect attempt:', err)
      })
    }

    window.addEventListener('pagehide', handleTabClose)
    window.addEventListener('beforeunload', handleTabClose)

    return () => {
      window.removeEventListener('pagehide', handleTabClose)
      window.removeEventListener('beforeunload', handleTabClose)
    }
  }, [attemptId, isSubmitted, isPreview])
  // ---------------------------------------------------------------------------
  // 5. SUBMIT HANDLER (DISARMS AUTO-SAVE & SUBMITS DELTA)
  // ---------------------------------------------------------------------------
  const handleFinalSubmit = useCallback(
    async (submissionType: SubmissionType = SubmissionType.MANUAL) => {
      if (isSubmittingRef.current || isSubmitted) return

      // Synchronous lock prevents duplicate execution
      isSubmittingRef.current = true
      setIsSubmitting(true)

      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
        autoSaveTimerRef.current = null
      }

      if (isPreview) {
        setShowSubmitModal(false)
        setIsSubmitted(true)
        return
      }

      if (!attemptId) {
        isSubmittingRef.current = false
        setIsSubmitting(false)
        return
      }

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }

      const currentAnswers = answersRef.current
      const previouslySaved = savedAnswersRef.current
      const unsavedAnswers = calculateAnswerDelta(currentAnswers, previouslySaved)

      try {
        const response = await submitAttempt.mutateAsync({
          attemptId,
          payload: {
            submitted_via: submissionType,
            answers: unsavedAnswers.length > 0 ? unsavedAnswers : undefined,
          },
        })

        if (response?.data) {
          setSubmissionResult(response.data)
        }

        setShowSubmitModal(false)
        setIsSubmitted(true)

        onSubmitAttempt?.({
          attemptId,
          answers: currentAnswers,
          timeSpentSeconds: totalSecondsRef.current - secondsRemaining,
          violations,
        })
      } catch (error) {
        console.error('Final submit failed:', error)
        isSubmittingRef.current = false
        setIsSubmitting(false)
      }
    },
    [
      attemptId,
      isSubmitted,
      isPreview,
      secondsRemaining,
      violations,
      submitAttempt,
      onSubmitAttempt,
    ]
  )

  // ---------------------------------------------------------------------------
  // 6. COUNTDOWN TIMER & AUTO-SUBMIT
  // ---------------------------------------------------------------------------
  const handleFinalSubmitRef = useRef(handleFinalSubmit)
  useEffect(() => {
    handleFinalSubmitRef.current = handleFinalSubmit
  }, [handleFinalSubmit])

  useEffect(() => {
    if (isSubmitted) return

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinalSubmitRef.current(SubmissionType.TIMEOUT)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isSubmitted])

  // ---------------------------------------------------------------------------
  // 7. AUTO-SAVE INTERVAL (EVERY 60 SECONDS)
  // ---------------------------------------------------------------------------
  const triggerSaveRef = useRef(triggerSaveProgress)
  useEffect(() => {
    triggerSaveRef.current = triggerSaveProgress
  }, [triggerSaveProgress])

  useEffect(() => {
    if (isSubmitted || isPreview || !attemptId) return

    autoSaveTimerRef.current = setInterval(() => {
      triggerSaveRef.current()
    }, 60 * 1000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
        autoSaveTimerRef.current = null
      }
    }
  }, [isSubmitted, isPreview, attemptId])

  const currentQ = questions[currentIndex]

  const handleSelectOption = (qId: string, val: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }))
  }

  const handleClearAnswer = (qId: string) => {
    setAnswers((prev) => {
      const copy = { ...prev }
      delete copy[qId]
      return copy
    })
  }

  const handleToggleReview = (qId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }))
  }

  const navigateTo = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index)
      const nextQ = questions[index]
      if (nextQ) {
        setVisitedQuestions((prev) => ({ ...prev, [nextQ.id]: true }))
      }
    }
  }

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const answeredCount = Object.keys(answers).length
  const reviewCount = Object.values(markedForReview).filter(Boolean).length
  const notVisitedCount = questions.filter((q) => !visitedQuestions[q.id]).length
  const notAnsweredCount = questions.length - answeredCount

  // ---------------------------------------------------------------------------
  // 8. SUBMITTED RESULTS SUMMARY
  // ---------------------------------------------------------------------------
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto p-4 sm:p-6 select-none">
        <div className="max-w-3xl mx-auto space-y-6 py-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 text-center">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-100 mb-1">
                {isPreview ? 'Preview Mode Completed' : 'Assessment Submitted'}
              </Badge>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{setName}</h2>
              <p className="text-xs text-slate-500">{testName}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-left">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-indigo-500" /> Score
                </span>
                <p className="text-lg font-bold text-indigo-600">
                  {submissionResult?.score?.toFixed(2) ?? '0.00'} / {submissionResult?.totalMarks ?? (questions.length * positiveMarks)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Correct
                </span>
                <p className="text-lg font-bold text-emerald-600">
                  {submissionResult?.correctAnswer ?? 0} <span className="text-xs font-normal text-slate-400">Qs</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <XCircle className="h-3.5 w-3.5 text-rose-500" /> Incorrect
                </span>
                <p className="text-lg font-bold text-rose-600">
                  {submissionResult?.wrongAnswer ?? 0} <span className="text-xs font-normal text-slate-400">Qs</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-amber-500" /> Unattempted
                </span>
                <p className="text-lg font-bold text-slate-700">
                  {submissionResult?.unattemptedAnswer ?? 0} <span className="text-xs font-normal text-slate-400">Qs</span>
                </p>
              </div>
            </div>

            {violations.length > 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-950">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    {violations.length} Anti-Cheat Warning(s) Logged
                  </span>
                  <Badge variant="outline" className="bg-amber-100/60 text-amber-800 border-amber-300">
                    Recorded in Session
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.values(ViolationType)
                    .filter((v): v is number => typeof v === 'number')
                    .map((typeVal) => {
                      const count = violations.filter((v) => v.type === typeVal).length
                      if (count === 0) return null
                      return (
                        <Badge
                          key={typeVal}
                          variant="outline"
                          className="bg-white/80 border-amber-300 text-amber-900 text-[11px] py-0.5"
                        >
                          {VIOLATION_TITLES[typeVal as ViolationType]}: {count}x
                        </Badge>
                      )
                    })}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Clean Proctoring Record — No suspicious activity detected.</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
              <Button
                type="button"
                onClick={onExit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-10 px-6 cursor-pointer"
              >
                Back to Test Sets
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // 9. ACTIVE RUNNER WORKSPACE (FULLSCREEN VIEWPORT TAKEOVER)
  // ---------------------------------------------------------------------------
  const optionKeys = [
    { key: 'option_a' as const, label: 'A', value: CorrectAnswer.A, text: currentQ?.option_a },
    { key: 'option_b' as const, label: 'B', value: CorrectAnswer.B, text: currentQ?.option_b },
    { key: 'option_c' as const, label: 'C', value: CorrectAnswer.C, text: currentQ?.option_c },
    { key: 'option_d' as const, label: 'D', value: CorrectAnswer.D, text: currentQ?.option_d },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto p-4 sm:p-6 select-none">
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* FULLSCREEN RE-ENTRY BANNER IF EXITED */}
        {fullscreenRequiredPrompt && (
          <div className="bg-amber-600 text-white px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-lg text-xs font-medium">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-200 shrink-0" />
              <span>Full-screen mode is required to maintain exam integrity.</span>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={enterFullscreen}
              className="bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold h-7 px-3 cursor-pointer shadow-xs"
            >
              Re-enter Fullscreen
            </Button>
          </div>
        )}

        {/* TOP HEADER */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
              title="Exit Test"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 line-clamp-1">{setName}</span>
                {isPreview ? (
                  <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                    Preview Mode
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Proctored Session
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{testName}</p>
            </div>
          </div>

          {/* TIMER & CONTROLS */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono tracking-wider ${
                secondsRemaining < 300
                  ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                  : 'bg-indigo-50/70 border-indigo-100 text-indigo-700'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* REAL-TIME VIOLATION WARNING BANNER */}
        {activeWarning && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-900 text-xs animate-shake">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-rose-950 flex items-center gap-2">
                  <span>{VIOLATION_TITLES[activeWarning.type]}</span>
                  <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded-md font-semibold">
                    Strike #{activeWarning.count}
                  </span>
                </p>
                <p className="text-[11px] text-rose-700">{activeWarning.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveWarning(null)}
              className="text-xs text-rose-600 hover:text-rose-950 font-bold px-2 py-1 rounded-lg hover:bg-rose-100 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* MAIN EXAM WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Question Area (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-xs">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      +{positiveMarks} Marks
                    </span>
                    {isNegativeMarking && (
                      <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">
                        -{negativeMarks} Neg
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => currentQ && handleToggleReview(currentQ.id)}
                    className={`h-8 px-2.5 text-xs font-semibold rounded-xl gap-1.5 cursor-pointer ${
                      currentQ && markedForReview[currentQ.id]
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>
                      {currentQ && markedForReview[currentQ.id] ? 'Marked' : 'Mark for Review'}
                    </span>
                  </Button>
                </div>

                {/* Question Statement */}
                <div className="text-sm font-semibold text-slate-900 leading-relaxed min-h-[60px]">
                  {currentQ?.question_text}
                </div>

                {/* Options */}
                <div className="space-y-2.5 pt-1">
                  {optionKeys.map((opt) => {
                    const isSelected = currentQ && answers[currentQ.id] === opt.value

                    return (
                      <div
                        key={opt.key}
                        onClick={() => currentQ && handleSelectOption(currentQ.id, opt.value)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 ring-1 ring-indigo-500/40'
                            : 'border-slate-200/90 bg-white hover:bg-slate-50/80 text-slate-800'
                        }`}
                      >
                        <div
                          className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.label}
                        </div>
                        <div className="flex-1">{opt.text}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Action Toolbar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!currentQ || answers[currentQ.id] === undefined}
                    onClick={() => currentQ && handleClearAnswer(currentQ.id)}
                    className="rounded-xl text-xs h-9 px-3 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Clear Response</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentIndex === 0}
                      onClick={() => navigateTo(currentIndex - 1)}
                      className="rounded-xl text-xs h-9 px-3 gap-1 border-slate-200 cursor-pointer disabled:opacity-40"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Previous</span>
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      disabled={currentIndex === questions.length - 1}
                      onClick={() => navigateTo(currentIndex + 1)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-9 px-4 gap-1 cursor-pointer disabled:opacity-40"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Question Palette (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-xs">
              <CardContent className="p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Question Palette
                </h3>

                <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-emerald-600" />
                    <span className="text-slate-600">Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-purple-600" />
                    <span className="text-slate-600">Review ({reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-amber-500" />
                    <span className="text-slate-600">Unanswered ({notAnsweredCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md border border-slate-300 bg-slate-100" />
                    <span className="text-slate-600">Not Visited ({notVisitedCount})</span>
                  </div>
                </div>

                {/* Palette Grid */}
                <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined
                    const isMarked = markedForReview[q.id]
                    const isVisited = visitedQuestions[q.id]
                    const isCurrent = currentIndex === idx

                    let tileClass = 'bg-slate-100 text-slate-700 border-slate-200'

                    if (isMarked) {
                      tileClass = 'bg-purple-600 text-white border-purple-700 font-bold'
                    } else if (isAnswered) {
                      tileClass = 'bg-emerald-600 text-white border-emerald-700 font-bold'
                    } else if (isVisited) {
                      tileClass = 'bg-amber-500 text-white border-amber-600 font-bold'
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => navigateTo(idx)}
                        className={`h-9 w-full rounded-xl text-xs flex items-center justify-center border transition-all cursor-pointer ${tileClass} ${
                          isCurrent ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>

                {/* Submit Final Button in Palette */}
                <div className="pt-2">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full h-10 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Final Attempt</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CONFIRMATION SUBMISSION MODAL */}
        <Dialog
          open={showSubmitModal}
          onOpenChange={(open) => {
            if (!isSubmitting) setShowSubmitModal(open)
          }}
        >
          <DialogContent className="sm:max-w-[400px] rounded-2xl bg-white p-5 shadow-xl border-slate-200 select-none">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                Submit Test Attempt?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Review your attempt summary before confirming submission.
              </DialogDescription>
            </DialogHeader>

            {/* Live Attempt Breakdown */}
            <div className="grid grid-cols-2 gap-2 py-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 text-[10px] font-medium block">Total Questions</span>
                <strong className="text-slate-900 font-bold text-sm">{questions.length}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70">
                <span className="text-emerald-700 text-[10px] font-medium block">Answered</span>
                <strong className="text-emerald-800 font-bold text-sm">{answeredCount}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70">
                <span className="text-amber-700 text-[10px] font-medium block">Unanswered</span>
                <strong className="text-amber-800 font-bold text-sm">{notAnsweredCount}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200/70">
                <span className="text-purple-700 text-[10px] font-medium block">Marked for Review</span>
                <strong className="text-purple-800 font-bold text-sm">{reviewCount}</strong>
              </div>
            </div>

            {/* Actions */}
            <DialogFooter className="pt-2 flex flex-row items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => setShowSubmitModal(false)}
                className="rounded-lg text-[11px] h-8 px-3 cursor-pointer border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Resume Test
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleFinalSubmit(SubmissionType.MANUAL)}
                className="rounded-lg text-[11px] h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer disabled:opacity-50 min-w-[90px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Submitting...
                  </>
                ) : (
                  'Yes, Submit'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}