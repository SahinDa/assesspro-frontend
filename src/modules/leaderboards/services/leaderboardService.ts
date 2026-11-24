import { apiClient } from '@/lib/apiClient';
import { LEADERBOARD_ENDPOINTS } from '../constants/endpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
    LeaderboardFilter,
    LeaderboardResponse,
    LeaderboardOptionsQuery,
    LeaderboardOptionResponse,
} from "../types/leaderboard.types"


export const leaderboardService = {
    getCurrentPosition: async (
      params?: LeaderboardFilter,
    ): Promise<ApiResponse<LeaderboardResponse>> => {
      const res = await apiClient.get<ApiResponse<LeaderboardResponse>>(
        LEADERBOARD_ENDPOINTS.GET_CURRENT_POSITION,
        { params },
      );
      return res.data;
    },
    getLeaderboardOptions : async (
      params?:LeaderboardOptionsQuery,
    ):Promise<ApiResponse<LeaderboardOptionResponse>> =>{
      const res = await apiClient.get<ApiResponse<LeaderboardOptionResponse>>(
        LEADERBOARD_ENDPOINTS.GET_LEADERBOARD_OPTIONS,
        {params},
      )
      return res.data;
    }
}