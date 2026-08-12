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

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address').min(1, 'Email is required'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address').min(1, 'Email is required'),
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password is too short (min 8 characters)')
    .max(32, 'New password cannot exceed 32 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const verifyOtpSchema = z.object({
  email: z.string().email('Please provide a valid email address').min(1, 'Email is required'),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
})

// This line creates the TypeScript type automatically from your Zod schema
export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>