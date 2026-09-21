// src/types/api.types.ts (or src/types/common.types.ts)

export interface ApiResponse<T> {
    error: boolean;
    statusCode: number;
    timestamp: string;
    data: T;
    message?: string;
  }
  
  export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
    totalCount?: number;
    page?: number;
    limit?: number;
  }