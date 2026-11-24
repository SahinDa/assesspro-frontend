import type { 
    LeaderboardFilter,
    LeaderboardOptionsQuery,
 } from '../types/leaderboard.types';

export const leaderboardKeys = {
    all: ['leaderboard'] as const,
    currentPositions: () => [...leaderboardKeys.all, 'current-position'] as const,
    currentPositionList: (filters?: LeaderboardFilter) =>
    [...leaderboardKeys.currentPositions(), filters ?? {}] as const,
    leaderboardOptions : () => [...leaderboardKeys.all,'leaderboard-options'] as const,
    leaderboardoptionList : (filters?:LeaderboardOptionsQuery) =>
    [...leaderboardKeys.leaderboardOptions(),filters ?? {}] as const,
}