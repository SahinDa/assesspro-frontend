import { useState } from 'react'
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CorrectAnswer } from '@/config/enums'
import type { QuestionFormData } from '../utils/testSetValidation'

interface BulkQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (questions: QuestionFormData[]) => void
}

const SAMPLE_JSON = `[
  {
    "question_text": "What is the time complexity of Dijkstra's algorithm with a binary min-heap?",
    "option_a": "O(V^2)",
    "option_b": "O((V + E) log V)",
    "option_c": "O(E log V)",
    "option_d": "O(V log E)",
    "correct_answer": 2
  }
]`

export default function BulkQuestionModal({ isOpen, onClose, onImport }: BulkQuestionModalProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleParseAndImport = () => {
    try {
      setError(null)
      const parsed = JSON.parse(jsonInput)

      if (!Array.isArray(parsed)) {
        throw new Error('Input must be a JSON array of questions.')
      }

      if (parsed.length === 0) {
        throw new Error('Array cannot be empty.')
      }

      const sanitized: QuestionFormData[] = parsed.map((item, idx) => {
        if (!item.question_text || item.question_text.trim().length < 10) {
          throw new Error(`Question #${idx + 1}: question_text must be at least 10 characters long.`)
        }
        if (!item.option_a || !item.option_b || !item.option_c || !item.option_d) {
          throw new Error(`Question #${idx + 1}: all 4 options (option_a, option_b, option_c, option_d) are required.`)
        }
        if (![1, 2, 3, 4].includes(Number(item.correct_answer))) {
          throw new Error(`Question #${idx + 1}: correct_answer must be 1, 2, 3, or 4.`)
        }

        return {
          question_text: String(item.question_text).trim(),
          option_a: String(item.option_a).trim(),
          option_b: String(item.option_b).trim(),
          option_c: String(item.option_c).trim(),
          option_d: String(item.option_d).trim(),
          correct_answer: Number(item.correct_answer) as CorrectAnswer,
        }
      })

      onImport(sanitized)
      setJsonInput('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px] rounded-2xl bg-white p-6 shadow-xl border-slate-200">
        <DialogHeader className="space-y-1">
          <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-1">
            <UploadCloud className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-bold text-slate-900">Bulk Import Questions</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Paste a JSON array of question objects to import them into your test set.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">JSON Payload</span>
              <button
                type="button"
                onClick={() => setJsonInput(SAMPLE_JSON)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
              >
                Load Sample Template
              </button>
            </div>
            <Textarea
              rows={8}
              placeholder="Paste JSON array here..."
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value)
                if (error) setError(null)
              }}
              className="font-mono text-xs rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs border-slate-200 h-9 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleParseAndImport}
            className="rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-9 px-4 gap-1.5 shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Import Questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}