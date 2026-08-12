import { z } from 'zod'
import { UserRole, type UserRoleType } from '@/config/enums'

export const roleSelectionSchema = z.object({
  role: z.union([
    z.literal(UserRole.STUDENT),
    z.literal(UserRole.ORGANIZATION),
  ], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
})

export type RoleSelectionFormData = z.infer<typeof roleSelectionSchema>