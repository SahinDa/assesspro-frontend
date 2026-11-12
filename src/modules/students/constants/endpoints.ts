export const STUDENT_ENDPOINTS = {
    ACTIVE_STUDENTS_LIST: '/users/list',
    STUDENTS_COUNT: '/users/count',
    PENDING_STUDENTS_LIST: '/organizations/join-requests/pending',
    REJECTED_STUDENTS_LIST: '/organizations/join-requests/rejected',
    HANDLE_STUDENTS_REQUEST: (requestId: string) =>
      `/organizations/join-requests/${requestId}/status`,
  } as const;