import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Award,
  Edit3,
  Eye,
  FileQuestion,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { TestSetItem } from '../components/TestSetFormModal'
import { CorrectAnswer } from '@/config/enums'

interface TestSetDetailsViewProps {
  testSet: TestSetItem
  testName?: string
  onBack: () => void
  onEdit: () => void
  onPreview?: () => void
}

const ENUM_TO_LETTER: Record<number, string> = {
  [CorrectAnswer.A]: 'A',
  [CorrectAnswer.B]: 'B',
  [CorrectAnswer.C]: 'C',
  [CorrectAnswer.D]: 'D',
}

export default function TestSetDetailsView({
  testSet,
  testName = 'Test Series',
  onBack,
  onEdit,
  onPreview,
}: TestSetDetailsViewProps) {
  const questions = testSet?.questions || []

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-indigo-600">{testName}</span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-xs text-slate-500 font-medium">Set Overview</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {testSet?.name || 'Unnamed Set'}
              </h2>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onPreview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" />
              <span>Preview Mode</span>
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={onEdit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-9 px-3 gap-1.5 shadow-xs cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Set & Questions</span>
          </Button>
        </div>
      </div>

      {/* Configuration Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Clock className="h-3.5 w-3.5 text-indigo-500" />
            <span>Duration</span>
          </div>
          <p className="text-base font-bold text-slate-900">{testSet?.timer_minutes ?? 0} Mins</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <HelpCircle className="h-3.5 w-3.5 text-sky-500" />
            <span>Total Questions</span>
          </div>
          <p className="text-base font-bold text-slate-900">
            {testSet?.total_questions ?? questions.length} Questions
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Award className="h-3.5 w-3.5 text-emerald-500" />
            <span>Marking Scheme</span>
          </div>
          <p className="text-base font-bold text-emerald-600">
            +{testSet?.positive_marking_value ?? 1} Marks
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Award className="h-3.5 w-3.5 text-rose-500" />
            <span>Negative Penalty</span>
          </div>
          <p className="text-base font-bold text-rose-600">
            {testSet?.is_negative_marking
              ? `-${testSet?.negative_score_value} Marks`
              : 'Disabled'}
          </p>
        </div>
      </div>

      {/* Description / Instructions */}
      {testSet?.description && (
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800 font-semibold block mb-0.5">Instructions & Syllabus:</strong>
          {testSet.description}
        </div>
      )}

      {/* Questions Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Question Catalog</h3>
            <Badge
              variant="outline"
              className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border-indigo-100"
            >
              {questions.length} / {testSet?.total_questions ?? questions.length} Ready
            </Badge>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 bg-white space-y-3">
            <div className="h-12 w-12 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileQuestion className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">No Questions Configured</p>
              <p className="text-[11px] text-slate-500">
                Add question statements and options to activate this test set.
              </p>
            </div>
            <Button
              type="button"
              onClick={onEdit}
              size="sm"
              className="rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-8 px-3 gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Questions</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const letter = ENUM_TO_LETTER[q.correct_answer] || 'A'

              return (
                <Card key={idx} className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-0.5">
                        Q{idx + 1}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border-emerald-200"
                      >
                        Correct: Option {letter}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                      {q.question_text}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {[
                        { key: 'A', text: q.option_a, enumVal: CorrectAnswer.A },
                        { key: 'B', text: q.option_b, enumVal: CorrectAnswer.B },
                        { key: 'C', text: q.option_c, enumVal: CorrectAnswer.C },
                        { key: 'D', text: q.option_d, enumVal: CorrectAnswer.D },
                      ].map((opt) => {
                        const isCorrect = q.correct_answer === opt.enumVal

                        return (
                          <div
                            key={opt.key}
                            className={`flex items-center gap-2 p-2 rounded-xl text-xs border ${
                              isCorrect
                                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-slate-50/60 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span
                              className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span className="truncate">{opt.text}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}