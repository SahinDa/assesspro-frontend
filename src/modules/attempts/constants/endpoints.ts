export const ATTEMPT_ENDPOINTS = {
    // ===============================
    // Attempt History & Details
    // Base controller prefix: /attempts
    // ===============================
    HISTORY: '/attempts/history',
    DETAILS: (attemptId: string) => `/attempts/${attemptId}/details`,
  } as const;