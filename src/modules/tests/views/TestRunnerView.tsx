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
import { CorrectAnswer } from '@/config/enums'

// 6 Proctoring Violation Enums
export enum ViolationType {
  TAB_SWITCH = 1,
  WINDOW_BLUR = 2,
  FULLSCREEN_EXIT = 3,
  CLIPBOARD_COPY = 4,
  CLIPBOARD_PASTE = 5,
  DEV_TOOLS = 6,
}

const VIOLATION_TITLES: Record<ViolationType, string> = {
  [ViolationType.TAB_SWITCH]: 'Tab Switch Detected',
  [ViolationType.WINDOW_BLUR]: 'Window Focus Lost',
  [ViolationType.FULLSCREEN_EXIT]: 'Fullscreen Mode Exited',
  [ViolationType.CLIPBOARD_COPY]: 'Clipboard Copy Disabled',
  [ViolationType.CLIPBOARD_PASTE]: 'Clipboard Paste Disabled',
  [ViolationType.DEV_TOOLS]: 'Developer Tools Access Attempt',
}

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
  testSetId: string
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

const MOCK_QUESTIONS: RunnerQuestion[] = [
  {
    id: 'q-1',
    question_text: "What is the time complexity of Dijkstra's algorithm implemented with a binary min-heap for a graph with V vertices and E edges?",
    option_a: 'O(V^2)',
    option_b: 'O((V + E) log V)',
    option_c: 'O(E log V)',
    option_d: 'O(V log E)',
    correct_answer: CorrectAnswer.B,
  },
  {
    id: 'q-2',
    question_text: 'Which standard data structure is utilized in Breadth-First Search (BFS) graph traversal?',
    option_a: 'Stack (LIFO)',
    option_b: 'Queue (FIFO)',
    option_c: 'Self-balancing Binary Search Tree',
    option_d: 'Priority Queue with max-heap',
    correct_answer: CorrectAnswer.B,
  },
  {
    id: 'q-3',
    question_text: 'In relational database transactions, which ACID property guarantees that committed transactions survive catastrophic server crashes?',
    option_a: 'Atomicity',
    option_b: 'Consistency',
    option_c: 'Isolation',
    option_d: 'Durability',
    correct_answer: CorrectAnswer.D,
  },
  {
    id: 'q-4',
    question_text: 'What is the worst-case time complexity of searching for a key in a balanced Red-Black Tree with N nodes?',
    option_a: 'O(1)',
    option_b: 'O(log N)',
    option_c: 'O(N)',
    option_d: 'O(N log N)',
    correct_answer: CorrectAnswer.B,
  },
  {
    id: 'q-5',
    question_text: 'Which network layer protocol is primarily responsible for mapping an IP address to a physical MAC hardware address?',
    option_a: 'DNS',
    option_b: 'ARP',
    option_c: 'DHCP',
    option_d: 'ICMP',
    correct_answer: CorrectAnswer.B,
  },
]

export default function TestRunnerView({
  testSetId,
  testName = 'Algorithms & Data Structures',
  setName = 'Set 1 - Core Fundamentals',
  timerMinutes = 30,
  positiveMarks = 2,
  negativeMarks = 0.5,
  isNegativeMarking = true,
  isPreview = false,
  onExit,
  onSubmitAttempt,
}: TestRunnerProps) {
  const [isInitializing, setIsInitializing] = useState(true)
  const [questions, setQuestions] = useState<RunnerQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({})
  const [visitedQuestions, setVisitedQuestions] = useState<Record<string, boolean>>({})

  // Timer & Screen
  const [secondsRemaining, setSecondsRemaining] = useState(timerMinutes * 60)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenRequiredPrompt, setFullscreenRequiredPrompt] = useState(false)

  // 6 Violations Tracking
  const [violations, setViolations] = useState<Array<{ type: ViolationType; timestamp: number; label: string }>>([])
  const [activeWarning, setActiveWarning] = useState<{ type: ViolationType; message: string; count: number } | null>(null)
  
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSecondsRef = useRef(timerMinutes * 60)
  const hasInitializedFullscreen = useRef(false)

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
      // Browser blocked automatic request (needs direct user gesture)
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
      // Handled gracefully
    }
  }

  // ---------------------------------------------------------------------------
  // 2. INITIALIZE TEST
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const initializeExam = async () => {
      setIsInitializing(true)
      try {
        await new Promise((res) => setTimeout(res, 400))
        setQuestions(MOCK_QUESTIONS)
        setVisitedQuestions({ 'q-1': true })
      } finally {
        setIsInitializing(false)
      }
    }
    initializeExam()
  }, [testSetId])

  // Attempt fullscreen as soon as initialized
  useEffect(() => {
    if (!isInitializing && !hasInitializedFullscreen.current) {
      hasInitializedFullscreen.current = true
      enterFullscreen()
    }
  }, [isInitializing, enterFullscreen])

  // ---------------------------------------------------------------------------
  // 3. VIOLATION RECORDER
  // ---------------------------------------------------------------------------
  const triggerViolation = useCallback(
    (type: ViolationType, customMessage?: string) => {
      if (isSubmitted || isPreview) return

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
  // 4. LISTENERS FOR ALL 6 VIOLATION TYPES
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isInitializing || isSubmitted) return

    // 1. TAB_SWITCH (Visibility API)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation(ViolationType.TAB_SWITCH, 'Tab switch or window minimization detected.')
      }
    }

    // 2. WINDOW_BLUR (Lost Focus to another app/popup)
    const handleWindowBlur = () => {
      triggerViolation(ViolationType.WINDOW_BLUR, 'Focus lost from the test runner window.')
    }

    // 3. FULLSCREEN_EXIT
    const handleFullscreenChange = () => {
      const inFullscreen = Boolean(document.fullscreenElement)
      setIsFullscreen(inFullscreen)
      if (!inFullscreen && !isSubmitted) {
        setFullscreenRequiredPrompt(true)
        triggerViolation(ViolationType.FULLSCREEN_EXIT, 'Fullscreen mode was exited.')
      }
    }

    // 4. CLIPBOARD_COPY
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      triggerViolation(ViolationType.CLIPBOARD_COPY, 'Copying question content is prohibited.')
    }

    // 5. CLIPBOARD_PASTE
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
      triggerViolation(ViolationType.CLIPBOARD_PASTE, 'Pasting external content is prohibited.')
    }

    // 6. DEV_TOOLS (F12, Ctrl+Shift+I/J/C, Cmd+Option+I/J/C, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isDevKey =
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        ((e.ctrlKey || e.metaKey) && ['u', 'U'].includes(e.key))

      if (isDevKey) {
        e.preventDefault()
        triggerViolation(ViolationType.DEV_TOOLS, 'Developer tools shortcut detected and blocked.')
      }
    }

    // Disable Right-Click context menu to prevent inspecting
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
  }, [isInitializing, isSubmitted, triggerViolation])

  // ---------------------------------------------------------------------------
  // 5. COUNTDOWN TIMER & SUBMIT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isInitializing || isSubmitted) return

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinalSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isInitializing, isSubmitted])

  const handleFinalSubmit = () => {
    setShowSubmitModal(false)
    setIsSubmitted(true)

    // Exit fullscreen cleanly on finish
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }

    const payload = {
      answers,
      timeSpentSeconds: totalSecondsRef.current - secondsRemaining,
      violations,
    }

    if (!isPreview) {
      onSubmitAttempt?.(payload)
    }
  }

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
  // 6. INITIAL LOADING STATE
  // ---------------------------------------------------------------------------
  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">Entering Secure Test Runner...</p>
          <p className="text-xs text-slate-500">Initializing anti-cheat monitors and full-screen workspace.</p>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // 7. SUBMITTED RESULTS SUMMARY
  // ---------------------------------------------------------------------------
  if (isSubmitted) {
    let correctCount = 0
    let incorrectCount = 0

    questions.forEach((q) => {
      const selected = answers[q.id]
      if (selected !== undefined) {
        if (selected === q.correct_answer) {
          correctCount++
        } else {
          incorrectCount++
        }
      }
    })

    const unattemptedCount = questions.length - (correctCount + incorrectCount)
    const penaltyPerWrong = isNegativeMarking ? negativeMarks : 0
    const rawScore = correctCount * positiveMarks - incorrectCount * penaltyPerWrong
    const totalMaxScore = questions.length * positiveMarks

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
                  {rawScore.toFixed(2)} / {totalMaxScore}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Correct
                </span>
                <p className="text-lg font-bold text-emerald-600">
                  {correctCount} <span className="text-xs font-normal text-slate-400">Qs</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <XCircle className="h-3.5 w-3.5 text-rose-500" /> Incorrect
                </span>
                <p className="text-lg font-bold text-rose-600">
                  {incorrectCount} <span className="text-xs font-normal text-slate-400">Qs</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-amber-500" /> Unattempted
                </span>
                <p className="text-lg font-bold text-slate-700">
                  {unattemptedCount} <span className="text-xs font-normal text-slate-400">Qs</span>
                </p>
              </div>
            </div>

            {/* Proctoring Summary Table */}
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
  // 8. ACTIVE RUNNER WORKSPACE (FULLSCREEN VIEWPORT TAKEOVER)
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

            <Button
              type="button"
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-8 px-3.5 gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="h-3 w-3" />
              <span>Submit Test</span>
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

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full h-10 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-xs cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Final Attempt</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CONFIRMATION SUBMISSION DIALOG */}
        <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
          <DialogContent className="sm:max-w-[420px] rounded-3xl bg-white p-6 shadow-xl border-slate-200">
            <DialogHeader className="space-y-1 text-center sm:text-left">
              <DialogTitle className="text-base font-bold text-slate-900">
                Submit Test Attempt?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Review your attempt status before confirming final submission.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2.5 py-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 block">Total Questions</span>
                <strong className="text-slate-900 font-bold text-sm">{questions.length}</strong>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/70">
                <span className="text-emerald-700 block">Answered</span>
                <strong className="text-emerald-800 font-bold text-sm">{answeredCount}</strong>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/70">
                <span className="text-amber-700 block">Unanswered</span>
                <strong className="text-amber-800 font-bold text-sm">{notAnsweredCount}</strong>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200/70">
                <span className="text-purple-700 block">Marked for Review</span>
                <strong className="text-purple-800 font-bold text-sm">{reviewCount}</strong>
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSubmitModal(false)}
                className="rounded-xl text-xs"
              >
                Resume Test
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleFinalSubmit}
                className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Yes, Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}