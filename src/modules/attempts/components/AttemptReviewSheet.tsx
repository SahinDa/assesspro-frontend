import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AttemptSummaryItem, QuestionBreakdown } from '../utils/attemptValidation'

interface AttemptReviewSheetProps {
  attempt: AttemptSummaryItem
  questions: QuestionBreakdown[]
  isOrg: boolean
  onBack: () => void
}

export default function AttemptReviewSheet({
  attempt,
  questions,
  isOrg,
  onBack,
}: AttemptReviewSheetProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentQ = questions[currentIndex]

  const correctCount = questions.filter((q) => q.is_correct).length
  const wrongCount = questions.filter((q) => !q.is_correct && q.selected_option !== null).length
  const skippedCount = questions.filter((q) => q.selected_option === null).length

  const options = [
    { label: 'A', value: 1, text: currentQ?.option_a },
    { label: 'B', value: 2, text: currentQ?.option_b },
    { label: 'C', value: 3, text: currentQ?.option_c },
    { label: 'D', value: 4, text: currentQ?.option_d },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:px-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{attempt.set_name}</span>
              <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700">
                Attempt #{attempt.attempt_number}
              </Badge>
              {isOrg && (
                <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200">
                  Candidate: {attempt.student_name}
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-slate-500">{attempt.test_title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs py-1 px-3 font-bold">
            Score: {attempt.score.toFixed(2)} / {attempt.max_score}
          </Badge>
        </div>
      </div>

      {/* Proctoring Warning */}
      {attempt.violation_score > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-amber-900 text-xs">
          <div className="flex items-center gap-2 font-bold">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{attempt.violation_score} Proctoring Violation(s) Logged</span>
          </div>
          <Badge variant="outline" className="bg-amber-100/60 text-amber-800 border-amber-300 text-[10px]">
            Flagged Session
          </Badge>
        </div>
      )}

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Question Panel */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-xs">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  {currentQ.is_correct ? (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[11px] gap-1 shadow-none">
                      <CheckCircle2 className="h-3 w-3" /> Correct (+{currentQ.marks_awarded})
                    </Badge>
                  ) : currentQ.selected_option !== null ? (
                    <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[11px] gap-1 shadow-none">
                      <XCircle className="h-3 w-3" /> Incorrect ({currentQ.marks_awarded})
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[11px] gap-1 shadow-none">
                      <HelpCircle className="h-3 w-3" /> Skipped (0.0)
                    </Badge>
                  )}
                </div>

                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {currentQ.time_spent_seconds}s
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                {currentQ.question_text}
              </p>

              <div className="space-y-2.5">
                {options.map((opt) => {
                  const isUserPick = currentQ.selected_option === opt.value
                  const isCorrect = currentQ.correct_answer === opt.value

                  let borderClass = 'border-slate-200/90 bg-white text-slate-700'
                  let badgeClass = 'bg-slate-100 text-slate-600'

                  if (isCorrect) {
                    borderClass = 'border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-500/30'
                    badgeClass = 'bg-emerald-600 text-white'
                  } else if (isUserPick && !currentQ.is_correct) {
                    borderClass = 'border-rose-500 bg-rose-50/50 text-rose-950 ring-1 ring-rose-500/30'
                    badgeClass = 'bg-rose-600 text-white'
                  }

                  return (
                    <div
                      key={opt.label}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-medium transition-all ${borderClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${badgeClass}`}>
                          {opt.label}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold">
                        {isUserPick && !isCorrect && <span className="text-rose-600">Selected Answer</span>}
                        {isCorrect && <span className="text-emerald-700">Correct Answer</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {currentQ.explanation && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1">
                  <span className="font-bold text-indigo-900 block">Explanation:</span>
                  <p className="text-slate-600 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="rounded-xl text-xs h-8 px-3 gap-1 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentIndex === questions.length - 1}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="rounded-xl text-xs h-8 px-3 gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Palette Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-xs">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Question Palette
              </h3>

              <div className="grid grid-cols-3 gap-2 text-[11px] pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-emerald-600" />
                  <span className="text-slate-600">Correct ({correctCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-rose-500" />
                  <span className="text-slate-600">Wrong ({wrongCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md border border-slate-300 bg-slate-100" />
                  <span className="text-slate-600">Skipped ({skippedCount})</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((item, idx) => {
                  let tileClass = 'bg-slate-100 text-slate-600'
                  if (item.is_correct) tileClass = 'bg-emerald-600 text-white'
                  else if (item.selected_option !== null) tileClass = 'bg-rose-500 text-white'

                  return (
                    <button
                      key={item.question_id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 w-full rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${tileClass} ${
                        currentIndex === idx ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}