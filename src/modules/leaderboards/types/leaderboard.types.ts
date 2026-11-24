
export interface LeaderboardFilter {
  test_id?: string;
  testset_id?: string;
  orgId?: string;
  limit?: number;
  offset?: number;
}

export interface MetaResponse {
  total_items: number,
  limit: number,
  offset: number,
  has_more: boolean,
}

export interface LeaderboardRow {
  rank: number;
  attempt_id: string;
  test_id: string;
  test_name: string;
  testset_id: string;
  testset_name: string;
  user_id: string;
  score: number;
  violation_score: number;
  duration_seconds: number;
  firstname: string;
  lastname: string | null;
  email: string;
  profile_pic: string | null;
}


export interface LeaderboardResponse {
  data: LeaderboardRow[],
  meta: MetaResponse,
}

export interface LeaderboardOptionsQuery {
  orgId?: string;
  test_id?:string;
  isTestset?: boolean;
}

export interface LeaderboardOptionTestResponse {
  test_id:string;
  test_name:string;
}

export interface LeaderboardOptionTestsetResponse {
  testset_id,
  testset_name,
}

export type LeaderboardOptionResponse =
 | LeaderboardOptionTestResponse []
 | LeaderboardOptionTestsetResponse [];
