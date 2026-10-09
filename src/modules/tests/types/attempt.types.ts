import { AnswerOption,SubmissionType , ViolationType} from '@/config/enum'
export interface BackendRunnerQuestion {
    question_id: string
    set_id: string
    question_text: string
    option_a: string
    option_b: string
    option_c: string
    option_d: string
    source?: string
    created_at?: string
    updated_at?: string
  }
  
  export interface BackendTestSetDetails {
    set_id: string
    test_id: string
    name: string
    description?: string
    set_number?: number
    total_questions: number
    timer_minutes: number
    positive_marking_value: number
    is_negative_marking: boolean
    negative_score_value: string // Note: comes as string e.g. "0.25"
    status: number
    created_at: string
    updated_at: string
    questions: BackendRunnerQuestion[]
  }
  
  export interface StartAttemptResponseData {
    attempt_id: string
    start_time: string
    end_time: string
    timer_minutes: number
    testsetDetails: BackendTestSetDetails
    message: string
  }

  export interface StartAttemptPayload{
    test_id:string;
    testset_id: string;
    orgId: string;
  }

export interface SingleAnswerDto {
  question_id: string
  selected_option: AnswerOption
}

export interface SaveProgressBulkDto {
  answers: SingleAnswerDto[]
}

export interface SaveProgressPayload {
  attemptId:string;
  payload:SaveProgressBulkDto
}

export interface SaveProgressResponse{
  message:string;
}
export interface FinalSubmitPayload{
  submitted_via:SubmissionType,
  answers:SingleAnswerDto[]
}
export interface SubmitAttemptPayload{
  attemptId:string,
  payload:FinalSubmitPayload,
}

export interface SubmitAttemptResponse{
  success: boolean,
  score: number,
  submitted_via: number,
  message: string,
}

export interface DisconnectAttemptPayload{
  attemptId:string;
  payload:FinalSubmitPayload
}

export interface DisconnectAttemptResponse{
  success: boolean,
  score: number,
  submitted_via: number,
  message: string,
}
export interface ReportViolationDto {
  violation_type: ViolationType;
  orgId: string;
}
export interface RecordViolationPayload{
  attemptId:string;
  payload:ReportViolationDto;
}

export interface RecordViolationResponse{
  status: string;
  message:string;
  current_score?: number,
  max_allowed?:number,
  terminated?: boolean
}