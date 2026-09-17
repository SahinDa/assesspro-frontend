import type { UserRoleType } from '@/config/enums';

export interface ActiveOrganization {
  id: string;
  name: string;
}

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
  active_org_id:string | null;
  activeOrganization: ActiveOrganization | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  org_id?: string | null;
  org_name?: string | null;
  org_status?: OrganizationStatus | number | null;
}

export interface UpdateUserProfileDto {
  firstname?: string;
  lastname?: string;
  profile_pic?: string;
}