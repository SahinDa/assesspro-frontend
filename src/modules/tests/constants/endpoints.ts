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
  TOGGLETESTSTATUS:(testId:string) =>`/tests/${testId}/toggle-status`,

  // ===============================
  // Test-Set Level Endpoints
  // Base controller prefix: /tests
  // ===============================
  CREATE_TESTSET: (testId: string) => `/tests/testset/${testId}`,
  LIST_TESTSETS: (testId: string) => `/tests/${testId}/testset/list`,
  COUNT_TESTSETS: (testId: string) => `/tests/${testId}/testset/count`,
  GET_TESTSET_BY_ID: (testId: string, testSetId: string) => `/tests/${testId}/testset/${testSetId}`,
  UPDATE_TESTSET: (testId: string, testSetId: string) => `/tests/${testId}/testset/${testSetId}`,
  TOGGLE_TESTSET_STATUS: (testId: string, testSetId: string) => `/tests/${testId}/testset/${testSetId}/toggle-status`,
  DELETE_TESTSET: (testId: string, testSetId: string) => `/tests/${testId}/testset/${testSetId}`,
  TESTSETS_PER_TEST: '/tests/sets-per-test',
} as const;