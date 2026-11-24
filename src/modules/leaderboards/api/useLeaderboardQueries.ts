import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { leaderboardService } from '../services/leaderboardService';
import { leaderboardKeys } from './leaderboard.keys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import type {
    LeaderboardFilter,
    LeaderboardResponse,
    LeaderboardOptionsQuery,
    LeaderboardOptionResponse,
    LeaderboardSearchQuery,
    LeaderboardSearchResponse,
} from "../types/leaderboard.types"

export function useCurrentPositionsQueries(
    params: Omit<LeaderboardFilter, 'orgId'> = {
        offset: 0,
        limit: 10,
    },
    adminOrgId?: string,
    options?: { enabled?: boolean },
){
    const { orgId } = useActiveOrgId(adminOrgId);

    return useQuery({
        queryKey: leaderboardKeys.currentPositionList({ ...params, orgId }),
        queryFn: () => leaderboardService.getCurrentPosition({ ...params, orgId }),
        select: (res): LeaderboardResponse => res.data,
        enabled: options?.enabled ?? true,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2,
    });
}

export function useLeaderboardOptions(
    params: Omit<LeaderboardOptionsQuery, 'orgId'> = {},
    adminOrgId?: string,
    options?: { enabled?: boolean },
){
    const { orgId } = useActiveOrgId(adminOrgId);
    return useQuery({
        queryKey: leaderboardKeys.leaderboardoptionList({ ...params, orgId }),
        queryFn: () => leaderboardService.getLeaderboardOptions({ ...params, orgId }),
        select: (res): LeaderboardOptionResponse => res.data,
        enabled: options?.enabled ?? true,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2,
    });
}

export function useLeaderboardSearch(
    params: Omit<LeaderboardSearchQuery, 'orgId'>,
    adminOrgId?: string,
){
    const { orgId } = useActiveOrgId(adminOrgId);
    const trimmedKeyword = params.searchKeyword.trim();
    return useQuery({
        queryKey: leaderboardKeys.searchList({ ...params, orgId ,searchKeyword: trimmedKeyword}),
        queryFn: () => leaderboardService.search({ ...params, orgId, searchKeyword: trimmedKeyword}),
        select: (res): LeaderboardSearchResponse => res.data,
        enabled: trimmedKeyword.length > 0,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2,
    });
}

