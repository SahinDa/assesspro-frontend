import { z } from 'zod'

export interface LeaderboardRow {
  rank: number
  attempt_id: string
  user_id: string
  score: number
  violation_score: number
  duration_seconds: number
  firstname: string
  lastname: string
  email: string
  profile_pic: string | null
}

export interface TestSetLeaderboardResponse {
  count: number
  list: LeaderboardRow[]
  hasNext?: boolean
}

export type LeaderboardSection = 'contest' | 'current'
export type CurrentPositionScope = 'test' | 'test_set'

export const leaderboardRowSchema = z.object({
  rank: z.number().int().positive(),
  attempt_id: z.string(),
  user_id: z.string(),
  score: z.number(),
  violation_score: z.number(),
  duration_seconds: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  profile_pic: z.string().nullable(),
})

export const testSetLeaderboardResponseSchema = z.object({
  count: z.number(),
  list: z.array(leaderboardRowSchema),
  hasNext: z.boolean().optional(),
})

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hrs > 0) return `${hrs}h ${mins}m`
  if (mins > 0) return `${mins}m ${secs}s`
  return `${secs}s`
}