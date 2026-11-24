import { apiClient } from '@/lib/apiClient';
import { LEADERBOARD_ENDPOINTS } from '../constants/endpoints';
import { ApiResponse } from '@/types/api.types';
import type {
    LeaderboardFilter,
    LeaderboardResponse,
    LeaderboardOptionsQuery,
    LeaderboardOptionResponse,
    LeaderboardSearchQuery,
    LeaderboardSearchResponse,
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
    },
    search: async(params?:LeaderboardSearchQuery):Promise<ApiResponse<LeaderboardSearchResponse>> =>{
      const res = await apiClient.get<ApiResponse<LeaderboardSearchResponse>>(
        LEADERBOARD_ENDPOINTS.SEARCH,
        {params},
      )
    }
}