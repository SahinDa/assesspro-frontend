import { JoinRequestStatus } from '@/config/enums';
export interface StudentListQueryParams {
    limit?: number;
    offset?: number;
    orgId?: string;
  }

  export interface StudentCountQueryParams {
    orgId?: string;
  }

  export type JoinRequestDecisionStatus =
  | JoinRequestStatus.APPROVED
  | JoinRequestStatus.REJECTED;

  export interface HandleJoinRequestBodyDto {
    action: JoinRequestAction;
  }

  export interface HandleJoinRequestParams {
    requestId: string;
    payload: HandleJoinRequestPayload;
  }

  export interface RemoveOrgUserParams {
    userId: string;
  }

  //Response 
  export interface StudentUserSummary {
    userId: string;
    firstName: string;
    lastName: string | null;
    email: string;
    profilePic: string | null;
  }

  export interface ActiveOrgUserResponse extends StudentUserSummary {
    membershipId: string;
    role: number;
    joinedDate: string; 
  }

  export interface JoinRequestUserResponse extends StudentUserSummary {
    requestId: string;
    requestedAt: string;   
  }

  export interface OrgUsersCountResponse {
    activeCount: number;
    pendingCount: number;
    rejectedCount: number;
  }

  export interface HandleJoinRequestResponse {
    success: boolean;
    message: string;
  }

  export interface RemoveOrgUserResponse {
    success: boolean;
    message: string;
  }