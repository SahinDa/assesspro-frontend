import { z } from 'zod'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const inviteStudentsSchema = z.object({
  emails: z
    .array(z.string().email('Invalid email address'))
    .min(1, 'Please enter at least one valid email address'),
})

export type InviteStudentsFormData = z.infer<typeof inviteStudentsSchema>

/**
 * Parses raw text input into a sanitized list of emails.
 * Supports comma, space, semicolon, or newline separators.
 */
export function parseRawEmails(raw: string): string[] {
  return raw
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0)
}

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email)
}