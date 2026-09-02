import { z } from 'zod'

export const AttemptHistoryFilterSchema = z.object({
  testId: z.string().min(1, 'Please select a valid test category'),
  setId: z.string().min(1, 'Please select a valid test set'),
  searchQuery: z
    .string()
    .max(50, 'Search query must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s-_@.]*$/, 'Search query contains invalid characters')
    .default(''),
})

export type AttemptHistoryFilterValues = z.infer<typeof AttemptHistoryFilterSchema>

export interface AttemptSummaryItem {
  attempt_id: string
  test_id: string
  test_title: string
  set_id: string
  set_name: string
  student_id: string
  student_name?: string
  student_email?: string
  attempt_number: number
  start_time: string
  end_time: string
  time_spent_seconds: number
  score: number
  max_score: number
  violation_score: number
}

export interface QuestionBreakdown {
  question_id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  selected_option: number | null
  correct_answer: number
  is_correct: boolean
  marks_awarded: number
  time_spent_seconds: number
}

export const formatDuration = (secs: number) => {
  const mins = Math.floor(secs / 60)
  const rem = secs % 60
  return `${mins}m ${rem}s`
}