export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/signup',
    VERIFYOTP:'/auth/verify-otp',
    FORGOTPASSWORD:'/auth/forgot-password',
    RESETPASSWORD:'/auth/reset-password',
    RESENDOTP:'/auth/resend-otp',
    LOGOUT:'/auth/logout',
    ME:'/users/me',
  } as const;