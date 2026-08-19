import { z } from 'zod'
import { CorrectAnswer, NegativeMarkingOption } from '@/config/enums'

export { CorrectAnswer, NegativeMarkingOption }

// Child schema matching CreateQuestionNestedDto
export const questionSchema = z.object({
  question_text: z
    .string()
    .trim()
    .min(10, 'Question text must be between 10 and 1000 characters long.')
    .max(1000, 'Question text must be between 10 and 1000 characters long.'),
  option_a: z
    .string()
    .trim()
    .min(1, 'Option A cannot be blank.')
    .max(250, 'Option A cannot exceed 250 characters.'),
  option_b: z
    .string()
    .trim()
    .min(1, 'Option B cannot be blank.')
    .max(250, 'Option B cannot exceed 250 characters.'),
  option_c: z
    .string()
    .trim()
    .min(1, 'Option C cannot be blank.')
    .max(250, 'Option C cannot exceed 250 characters.'),
  option_d: z
    .string()
    .trim()
    .min(1, 'Option D cannot be blank.')
    .max(250, 'Option D cannot exceed 250 characters.'),
  correct_answer: z.nativeEnum(CorrectAnswer, {
    errorMap: () => ({ message: 'Please select a valid correct answer option.' }),
  }),
})

// Parent schema matching CreateTestSetDto / UpdateTestSetDto
export const testSetSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Test set name must be between 3 and 255 characters.')
      .max(255, 'Test set name must be between 3 and 255 characters.'),
    description: z
      .string()
      .trim()
      .max(2000, 'Description cannot exceed 2000 characters.')
      .optional()
      .or(z.literal('')),
    total_questions: z.coerce
      .number({ invalid_type_error: 'Total questions count must be a whole number.' })
      .int('Total questions count must be a whole number.')
      .min(10, 'A test section must contain at least 10 questions.')
      .max(100, 'A single test section cannot exceed a maximum of 100 questions.'),
    timer_minutes: z.coerce
      .number({ invalid_type_error: 'Timer minutes must be a whole number.' })
      .int('Timer minutes must be a whole number.')
      .min(1, 'Timer duration must be at least 1 minute.'),
    positive_marking_value: z.coerce
      .number({ invalid_type_error: 'Positive marking value must be a whole number.' })
      .int('Positive marking value must be a whole number.')
      .min(1, 'Positive marks awarded must be at least 1.')
      .max(100, 'Positive marks awarded cannot exceed 100.'),
    is_negative_marking: z.boolean().default(false),
    negative_score_value: z.coerce
      .number()
      .pipe(
        z.nativeEnum(NegativeMarkingOption, {
          errorMap: () => ({ message: 'Invalid negative marking option selected.' }),
        })
      )
      .default(NegativeMarkingOption.ZERO),
    questions: z.array(questionSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.is_negative_marking && data.negative_score_value === NegativeMarkingOption.ZERO) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['negative_score_value'],
        message: 'Please select a penalty value greater than 0 for negative marking.',
      })
    }
  })

export type QuestionFormData = z.infer<typeof questionSchema>
export type TestSetFormData = z.infer<typeof testSetSchema>