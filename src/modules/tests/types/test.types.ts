import {
    OwnerType,
    TestStatus,
  } from '@/config/enums';
  

export interface CreateTestPayload {
    name:string;
    description?: string;
}

export interface CreateTestResponse {
    test_id: string;
    name: string;
    description?: string | null;
    total_set: number;
    owner_type: OwnerType; 
    owner_id: string;
    status: TestStatus;
    created_at: string;
    updated_at?: string;
}

export interface GetTestCountQueryParams {
    id?: string;
    status?: TestStatus | number;
  }

export interface TestCountData {
    count: number;
}

export interface GetTestListQueryParams {
    id?: string;
    status?: TestStatus | number;
    offset?: number;
    limit?: number;
}

  export interface TestListItem {
    test_id: string;
    name: string;
    description: string | null;
    total_set: number;
    status: TestStatus | number;
    created_at: string;
    updated_at: string;
  }  