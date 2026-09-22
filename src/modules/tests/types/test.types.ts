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

  export interface GetTestParams {
    testId: string;
    id?: string;
  }

  export interface TestDetailData {
    test_id: string;
    name: string;
    description: string | null;
    total_set: number;
    status: TestStatus | number;
    created_at: string;
    updated_at: string;
  }

  export interface UpdateTestDto {
    name?: string;
    description?: string;
    status?: TestStatus | number;
  }

  export interface UpdateTestParams {
    testId: string;
    data: UpdateTestDto;
  }

  export interface UpdateTestResponse{
    message: string;
  }

export interface ToggleTestStatusParams {
  testId: string;
}

export interface ToggleTestStatusResponse {
    message: string;
  }

 export interface DeleteTestParams{
    testId: string;
 } 

 export interface DeleteTestResponse {
    message: string;
  }