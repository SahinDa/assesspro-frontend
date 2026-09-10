import { UserRoleType } from '@/config/enums';

export interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  oauth_provider: number | null;
  oauth_id: string | null;
  email_verified: boolean;
  role: UserRoleType;
  status: number;
  profile_pic: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileDto {
  firstname?: string;
  lastname?: string;
  profile_pic?: string;
}