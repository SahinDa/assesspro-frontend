export const TEST_ENDPOINTS = {
  // ===============================
  // Test-Level Endpoints
  // ===============================
  CREATE: '/tests',
  LIST: '/tests/list',
  COUNT: '/tests/count',
  GET_BY_ID: (testId: string) => `/tests/${testId}`,
  UPDATE: (testId: string) => `/tests/${testId}`,
  DELETE: (testId: string) => `/tests/${testId}`,

  // ===============================
  // Test-Set Level Endpoints
  // Base controller prefix: /tests
  // ===============================
  CREATE_SET: (testId: string) => `/tests/testset/${testId}`,
  LIST_SETS: (testId: string) => `/tests/${testId}/testset/list`,
  COUNT_SETS: (testId: string) => `/tests/${testId}/testset/count`,
  GET_SET_BY_ID: (testId: string, testSetId: string) => `/tests/${testId}/testset/${testSetId}`,
  UPDATE_SET: (testId: string, testSetId: string) => `/tests/${testId}/testset/${testSetId}`,
  TOGGLE_SET_STATUS: (testId: string, testSetId: string) => `/tests/${testId}/testset/${testSetId}/toggle-status`,
  DELETE_SET: (testId: string, testSetId: string) => `/tests/${testId}/testset/${testSetId}`,
  SETS_PER_TEST: '/tests/sets-per-test',
} as const;