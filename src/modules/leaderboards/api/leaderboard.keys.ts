import type { LeaderboardFilter } from '../types/leaderboard.types';

export const leaderboardKeys = {
    all: ['leaderboard'] as const,
    currentPositions: () => [...leaderboardKeys.all, 'current-position'] as const,
    currentPositionList: (filters?: LeaderboardFilter) =>
    [...leaderboardKeys.currentPositions(), filters ?? {}] as const,
}