import type { 
    getNoticationQuery
   } from '../types/notification.types';
  
 export const notificationKeys = {
    all : ['notification'] as const,
    lists : () => [...notificationKeys.all,'list'] as const,
    list : (params?:getNoticationQuery) => [...notificationKeys.lists(),params ?? {}] as const,
 }