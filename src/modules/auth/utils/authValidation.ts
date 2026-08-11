import { z } from 'zod'

export const signUpSchema = z.object({
  firstname: z.string().min(1, { message: "First name is required." }),
  lastname: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

// This line creates the TypeScript type automatically from your Zod schema
export type SignUpFormData = z.infer<typeof signUpSchema>