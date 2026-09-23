import {
    CorrectAnswer,
    NegativeMarkingOption,
    TestStatus,
    QuestionSource,
    TestSetStatus,
  } from '@/config/enums';

  export interface CreateQuestionNestedPayload {
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: CorrectAnswer; 
  }

  export interface CreateTestSetInput {
    name: string;
    description?: string;
    total_questions: number;
    timer_minutes: number;
    positive_marking_value: number;
    is_negative_marking: boolean;
    negative_score_value: NegativeMarkingOption; 
    questions: CreateQuestionInput[];
  }

  export interface CreateTestSetParams {
    testId: string;
    payload: CreateTestSetInput;
  }

  export interface QuestionResponse {
    question_id: string;
    set_id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: CorrectAnswer; 
    source: QuestionSource;
    created_at: string;
    updated_at: string | null;
  }

  export interface CreateTestSetResponse {
    set_id: string;
    test_id: string;
    name: string;
    description: string | null;
    set_number: number;
    total_questions: number;
    timer_minutes: number;
    positive_marking_value: number;
    is_negative_marking: boolean;
    negative_score_value: NegativeMarkingOption | string | number;
    status: TestSetStatus; 
    created_at: string;
    updated_at: string | null;
    questions: QuestionResponse[];
  }