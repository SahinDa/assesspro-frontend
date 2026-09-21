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