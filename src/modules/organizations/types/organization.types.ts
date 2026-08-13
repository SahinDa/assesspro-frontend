import { z } from 'zod'

export const organizationInputSchema = z.object({
  name: z
    .string()
    .min(3, 'Organization name must be at least 3 characters long')
    .max(32, 'Organization name cannot exceed 32 characters'),
})

export type OrganizationInputDTO = z.infer<typeof organizationInputSchema>