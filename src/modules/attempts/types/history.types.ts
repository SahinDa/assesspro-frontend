import {
    AttemptSortBy,
    SubmissionType,
    AnswerEvaluation,
  } from '@/config/enums';
  
  // ==========================================
  // 1. Common / Meta Interfaces
  // ==========================================
  
  export interface PaginationMeta {
    total_items: number;
    limit: number;
    offset: number;
    has_more: boolean;
  }
  
  // ==========================================
  // 2. Attempt History Interfaces
  // ==========================================
  
  export interface GetAttemptHistoryQueryParams {
    test_id?: string;
    testset_id?: string;
    orgId?: string;
    sort_by?: AttemptSortBy;
    limit?: number;
    offset?: number;
  }
  
  export interface AttemptHistoryItem {
    attemptId: string;
    userId: string;
    studentName: string;
    testId: string;
    testName: string;
    setId: string;
    setName: string;
    attemptNumber: number;
    finalScore: number;
    submittedVia: SubmissionType | number | null;
    startTime: string;
  }
  
  export interface GetAttemptHistoryResponse {
    data: AttemptHistoryItem[];
    meta: PaginationMeta;
  }
  
  // ==========================================
  // 3. Attempt Details & Review Interfaces
  // ==========================================
  
  export interface GetAttemptDetailsQueryParams {
    attemptId: string;
  }
  
  export interface QuestionOptions {
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  }
  
  export interface QuestionReviewItem {
    question_id: string;
    question_text: string;
    options: QuestionOptions;
    correct_answer: number;
    selected_option: number | null;
    is_correct_status: AnswerEvaluation | string | number;
    marks_awarded: number;
  }
  
  export interface GetAttemptDetailsResponse {
    attempt_id: string;
    test_id: string;
    test_name: string;
    set_id: string;
    set_name: string;
    final_score: number;
    submitted_via: SubmissionType | number | null;
    completed_at: string;
    questions: QuestionReviewItem[];
  }