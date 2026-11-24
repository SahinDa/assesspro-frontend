import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { leaderboardService } from '../services/leaderboardService';
import { leaderboardKeys } from './leaderboard.keys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import type {
    LeaderboardFilter,
    LeaderboardResponse,
    LeaderboardOptionsQuery,
    LeaderboardOptionResponse,
} from "../types/leaderboard.types"

export function useCurrentPositionsQueries(
    params: Omit<LeaderboardFilter, 'orgId'> = {
        offset: 0,
        limit: 10,
    },
    adminOrgId?: string,
){
    const { orgId } = useActiveOrgId(adminOrgId);

    return useQuery({
        queryKey: leaderboardKeys.currentPositionList({ ...params, orgId }),
        queryFn: () => leaderboardService.getCurrentPosition({ ...params, orgId }),
        select: (res): LeaderboardResponse => res.data,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2,
    });
}

export function useLeaderboardOptions(
    params: Omit<LeaderboardOptionsQuery, 'orgId'> = {},
    adminOrgId?: string,
){
    const { orgId } = useActiveOrgId(adminOrgId);
    return useQuery({
        queryKey: leaderboardKeys.leaderboardoptionList({ ...params, orgId }),
        queryFn: () => leaderboardService.getLeaderboardOptions({ ...params, orgId }),
        select: (res): LeaderboardOptionResponse => res.data,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2,
    });
}

