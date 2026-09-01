import { useState, useEffect } from 'react'
import { Plus, Check, Trash2, HelpCircle, Settings2, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CorrectAnswer, NegativeMarkingOption } from '@/config/enums'
import { testSetSchema, type TestSetFormData, type QuestionFormData } from '../utils/testSetValidation'
import BulkQuestionModal from './BulkQuestionModal'

export interface TestSetItem extends TestSetFormData {
  id: string
}

interface TestSetFormModalProps {
  isOpen: boolean
  testSet?: TestSetItem | null
  onClose: () => void
  onSubmit: (data: TestSetFormData, id?: string) => void
}

const emptyQuestion: QuestionFormData = {
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: CorrectAnswer.A,
}

export default function TestSetFormModal({
  isOpen,
  testSet,
  onClose,
  onSubmit,
}: TestSetFormModalProps) {
  const isEditing = Boolean(testSet)
  const [activeTab, setActiveTab] = useState<'config' | 'questions'>('config')
  const [isBulkOpen, setIsBulkOpen] = useState(false)

  const [formData, setFormData] = useState<TestSetFormData>({
    name: '',
    description: '',
    total_questions: 10,
    timer_minutes: 30,
    positive_marking_value: 1,
    is_negative_marking: false,
    negative_score_value: NegativeMarkingOption.ZERO,
    questions: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setActiveTab('config')
      if (testSet) {
        setFormData({
          name: testSet.name,
          description: testSet.description || '',
          total_questions: testSet.total_questions,
          timer_minutes: testSet.timer_minutes,
          positive_marking_value: testSet.positive_marking_value,
          is_negative_marking: testSet.is_negative_marking,
          negative_score_value: testSet.negative_score_value,
          questions: testSet.questions || [],
        })
      } else {
        setFormData({
          name: '',
          description: '',
          total_questions: 10,
          timer_minutes: 30,
          positive_marking_value: 1,
          is_negative_marking: false,
          negative_score_value: NegativeMarkingOption.ZERO,
          questions: [],
        })
      }
      setErrors({})
    }
  }, [isOpen, testSet])

  const questionsCount = formData.questions.length
  const totalRequired = formData.total_questions || 0
  const isQuestionsComplete = questionsCount === totalRequired
  const questionsRemaining = Math.max(0, totalRequired - questionsCount)

  const handleAddQuestion = () => {
    if (questionsCount >= totalRequired) return
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...emptyQuestion }],
    }))
  }

  const handleRemoveQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const handleQuestionChange = (
    index: number,
    field: keyof QuestionFormData,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updated = [...prev.questions]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, questions: updated }
    })
  }

  const handleBulkImport = (importedQuestions: QuestionFormData[]) => {
    setFormData((prev) => {
      const remainingSlots = Math.max(0, prev.total_questions - prev.questions.length)
      const allowedBatch = importedQuestions.slice(0, remainingSlots)
      return {
        ...prev,
        questions: [...prev.questions, ...allowedBatch],
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Enforce exact question count validation
    if (!isQuestionsComplete) {
      setErrors((prev) => ({
        ...prev,
        questionsCount: `You must add exactly ${totalRequired} questions before saving. Current: ${questionsCount}/${totalRequired}.`,
      }))
      setActiveTab('questions')
      return
    }

    const result = testSetSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        const path = err.path.join('.')
        fieldErrors[path] = err.message
      })
      setErrors(fieldErrors)

      if (
        fieldErrors.name ||
        fieldErrors.total_questions ||
        fieldErrors.timer_minutes ||
        fieldErrors.positive_marking_value ||
        fieldErrors.negative_score_value
      ) {
        setActiveTab('config')
      } else {
        setActiveTab('questions')
      }
      return
    }

    onSubmit(result.data, testSet?.id)
    onClose()
  }

  const optionKeys = [
    { key: 'option_a' as const, label: 'A', value: CorrectAnswer.A },
    { key: 'option_b' as const, label: 'B', value: CorrectAnswer.B },
    { key: 'option_c' as const, label: 'C', value: CorrectAnswer.C },
    { key: 'option_d' as const, label: 'D', value: CorrectAnswer.D },
  ]

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[660px] max-h-[90vh] flex flex-col rounded-2xl bg-white p-6 shadow-xl border-slate-200">
          <DialogHeader className="space-y-1 shrink-0">
            <DialogTitle className="text-base font-bold text-slate-900">
              {isEditing ? 'Edit Test Set' : 'Create New Test Set'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 leading-relaxed">
              {isEditing
                ? 'Update your test set configuration, time limits, scoring criteria, and question items.'
                : `Configure rules and add all ${totalRequired} questions to enable test set creation.`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden space-y-4 pt-2">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as any)}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="grid grid-cols-2 w-full rounded-xl bg-slate-100 p-1 mb-2">
                <TabsTrigger
                  value="config"
                  className="text-xs font-semibold rounded-lg flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs cursor-pointer"
                >
                  <Settings2 className="h-3.5 w-3.5" /> Test Set Rules & Scoring
                </TabsTrigger>
                <TabsTrigger
                  value="questions"
                  className="text-xs font-semibold rounded-lg flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5" /> Questions ({questionsCount}/{totalRequired})
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2">
                {/* TAB 1: CONFIGURATION */}
                <TabsContent value="config" className="space-y-4 m-0">
                  {/* Set Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="set-name" className="text-xs font-semibold text-slate-700">
                      Test Set Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="set-name"
                      placeholder="e.g. Set 1 - Quantitative Aptitude & Reasoning"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
                      }}
                      className={`text-xs rounded-xl h-10 border-slate-200 focus-visible:ring-indigo-500 ${
                        errors.name ? 'border-rose-400 focus-visible:ring-rose-400' : ''
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="set-desc" className="text-xs font-semibold text-slate-700">
                      Test Set Instructions & Rules <span className="text-slate-400 font-normal">(Optional)</span>
                    </Label>
                    <Textarea
                      id="set-desc"
                      placeholder="Specific instructions, allowed aids, or syllabus boundaries for this test set..."
                      rows={2}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="text-xs rounded-xl border-slate-200 resize-none focus-visible:ring-indigo-500"
                    />
                  </div>

                  {/* Settings Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="total-q" className="text-xs font-semibold text-slate-700">
                        Total Questions <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="total-q"
                        type="number"
                        min={1}
                        max={100}
                        value={formData.total_questions}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          setFormData({ ...formData, total_questions: val })
                        }}
                        className="text-xs rounded-xl h-10 border-slate-200"
                      />
                      {errors.total_questions && (
                        <p className="text-[10px] text-rose-500 font-medium leading-tight">{errors.total_questions}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="timer-min" className="text-xs font-semibold text-slate-700">
                        Timer Duration (Mins) <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="timer-min"
                        type="number"
                        min={1}
                        value={formData.timer_minutes}
                        onChange={(e) => setFormData({ ...formData, timer_minutes: Number(e.target.value) })}
                        className="text-xs rounded-xl h-10 border-slate-200"
                      />
                      {errors.timer_minutes && (
                        <p className="text-[10px] text-rose-500 font-medium leading-tight">{errors.timer_minutes}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="pos-marks" className="text-xs font-semibold text-slate-700">
                        Marks / Question <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="pos-marks"
                        type="number"
                        min={1}
                        max={100}
                        value={formData.positive_marking_value}
                        onChange={(e) => setFormData({ ...formData, positive_marking_value: Number(e.target.value) })}
                        className="text-xs rounded-xl h-10 border-slate-200"
                      />
                      {errors.positive_marking_value && (
                        <p className="text-[10px] text-rose-500 font-medium leading-tight">{errors.positive_marking_value}</p>
                      )}
                    </div>
                  </div>

                  {/* Negative Marking Configuration */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Negative Marking</p>
                        <p className="text-[11px] text-slate-500">Deduct marks for incorrect attempts in this test set</p>
                      </div>
                      <Switch
                        checked={formData.is_negative_marking}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            is_negative_marking: checked,
                            negative_score_value: checked ? NegativeMarkingOption.QUARTER : NegativeMarkingOption.ZERO,
                          })
                        }
                      />
                    </div>

                    {formData.is_negative_marking && (
                      <div className="pt-2 border-t border-slate-200 space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Penalty Score Value</Label>
                        <Select
                          value={String(formData.negative_score_value)}
                          onValueChange={(val) =>
                            setFormData({ ...formData, negative_score_value: Number(val) as NegativeMarkingOption })
                          }
                        >
                          <SelectTrigger className="w-full h-9 rounded-xl text-xs bg-white border-slate-200">
                            <SelectValue placeholder="Select penalty mark" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200 bg-white">
                            <SelectItem value={String(NegativeMarkingOption.QUARTER)} className="text-xs">
                              -0.25 (Quarter mark deduction)
                            </SelectItem>
                            <SelectItem value={String(NegativeMarkingOption.HALF)} className="text-xs">
                              -0.50 (Half mark deduction)
                            </SelectItem>
                            <SelectItem value={String(NegativeMarkingOption.ONE)} className="text-xs">
                              -1.00 (Full mark deduction)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.negative_score_value && (
                          <p className="text-[10px] text-rose-500 font-medium">{errors.negative_score_value}</p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* TAB 2: QUESTIONS LIST */}
                <TabsContent value="questions" className="space-y-4 m-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-slate-700">Questions in this Test Set</p>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-semibold ${
                          isQuestionsComplete
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {questionsCount} / {totalRequired} Added
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={questionsCount >= totalRequired}
                        onClick={() => setIsBulkOpen(true)}
                        className="rounded-xl text-xs h-8 px-2.5 gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                      >
                        <UploadCloud className="h-3.5 w-3.5 text-slate-400" /> Bulk Import
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={questionsCount >= totalRequired}
                        onClick={handleAddQuestion}
                        className="rounded-xl text-xs h-8 px-2.5 gap-1.5 border-indigo-200 text-indigo-600 hover:bg-indigo-50 cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Question
                      </Button>
                    </div>
                  </div>

                  {errors.questionsCount && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errors.questionsCount}</span>
                    </div>
                  )}

                  {formData.questions.length === 0 ? (
                    <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
                      <p className="text-xs text-slate-500">
                        Please add {totalRequired} questions to enable creating this test set.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={handleAddQuestion}
                          className="text-xs text-indigo-600 font-semibold cursor-pointer"
                        >
                          + Add Manually
                        </Button>
                        <span className="text-slate-300 text-xs">•</span>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={() => setIsBulkOpen(true)}
                          className="text-xs text-slate-600 font-semibold cursor-pointer"
                        >
                          Bulk JSON Import
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.questions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3 transition-all hover:border-indigo-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 bg-slate-100 rounded-lg px-2 py-0.5">
                              Question {idx + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveQuestion(idx)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          <div className="space-y-1">
                            <Textarea
                              placeholder="Enter question statement (10-1000 characters)..."
                              rows={2}
                              value={q.question_text}
                              onChange={(e) => handleQuestionChange(idx, 'question_text', e.target.value)}
                              className="text-xs rounded-xl bg-slate-50/60 border-slate-200 focus-visible:ring-indigo-500 resize-none"
                            />
                            {errors[`questions.${idx}.question_text`] && (
                              <p className="text-[10px] text-rose-500 font-medium">
                                {errors[`questions.${idx}.question_text`]}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {optionKeys.map((opt) => {
                              const isSelected = q.correct_answer === opt.value
                              return (
                                <div key={opt.key} className="space-y-1">
                                  <div
                                    className={`flex items-center gap-2 rounded-xl border p-1.5 transition-all ${
                                      isSelected
                                        ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-300/60'
                                        : 'border-slate-200 bg-white'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleQuestionChange(idx, 'correct_answer', opt.value)}
                                      className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-emerald-600 text-white shadow-xs'
                                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                      }`}
                                      title="Click to mark as correct answer"
                                    >
                                      {isSelected ? <CheckCircle2 className="h-4 w-4" /> : opt.label}
                                    </button>
                                    <Input
                                      placeholder={`Option ${opt.label}`}
                                      value={q[opt.key]}
                                      onChange={(e) => handleQuestionChange(idx, opt.key, e.target.value)}
                                      className="text-xs h-7 border-0 shadow-none focus-visible:ring-0 p-0"
                                    />
                                  </div>
                                  {errors[`questions.${idx}.${opt.key}`] && (
                                    <p className="text-[10px] text-rose-500 font-medium px-1">
                                      {errors[`questions.${idx}.${opt.key}`]}
                                    </p>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="pt-3 gap-2 sm:gap-2 shrink-0 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-xl text-xs border-slate-200 h-9 cursor-pointer"
              >
                Cancel
              </Button>

              {/* Show submit button ONLY if all questions are filled, or show a guided helper button */}
              {isQuestionsComplete ? (
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-9 px-4 gap-1.5 shadow-xs cursor-pointer"
                >
                  {isEditing ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Save Test Set Changes
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" /> Create Test Set ({questionsCount}/{totalRequired})
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('questions')}
                  className="rounded-xl text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium h-9 px-3.5 gap-1.5 cursor-pointer"
                >
                  <span>
                    Add {questionsRemaining} more question{questionsRemaining > 1 ? 's' : ''} to create ({questionsCount}/{totalRequired})
                  </span>
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <BulkQuestionModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onImport={handleBulkImport}
      />
    </>
  )
}