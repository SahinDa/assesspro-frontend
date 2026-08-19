import { z } from 'zod'

export const baseTestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Test name is required')
    .min(2, 'Test name must be at least 2 characters long')
    .max(100, 'Test name cannot exceed 100 characters')
    .regex(
      /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/,
      'Test name can only contain letters, numbers, and single spaces (no special characters)'
    ),
  description: z.string().trim().optional(),
})

export type TestFormData = z.infer<typeof baseTestSchema>