export const STUDENT_ENDPOINTS = {
    ACTIVE_STUDENTS_LIST: '/organizations/list',
    STUDENTS_COUNT: '/organizations/count',
    PENDING_STUDENTS_LIST: '/organizations/join-requests/pending',
    REJECTED_STUDENTS_LIST: '/organizations/join-requests/rejected',
    HANDLE_STUDENTS_REQUEST: (requestId: string) =>
      `/organizations/join-requests/${requestId}/status`,
    REMOVE_STUDENT: (userId: string) => `/organizations/users/${userId}`,  
  } as const;