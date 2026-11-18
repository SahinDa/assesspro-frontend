export const NOTIFICATION_ENDPOINTS = {
   CREATE_ANNOUNCEMENT :'/notifications',
   GET_NOTIFICATIONS : '/notifications',
   REMOVED_NOTIFICATION: (notificationId:string) => `/notifications/${notificationId}`
} as const;