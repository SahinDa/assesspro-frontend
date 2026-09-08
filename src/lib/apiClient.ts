import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/config/env';

/**
 * Interface extending internal Axios request config to include retry tracking.
 */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }

  /**
 * Central Axios HTTP Client.
 * All feature modules must use this instance for server communication.
 */
export const apiClient = axios.create({
    baseURL: ENV.API_BASE_URL,
    withCredentials: true, // Required for HttpOnly cookie persistence across origins
    headers: {
      'Content-Type': 'application/json',
    },
  });


  /**
 * Concurrency lock and queue definitions for silent token refresh.
 */
let isRefreshing = false;

interface QueuedPromise {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let failedQueue: QueuedPromise[] = [];

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig;
  
      // A. If there is no response object (network failure) or status is NOT 401, pass it through
      if (!error.response || error.response.status !== 401) {
        return Promise.reject(error);
      }
  
      // B. If the request was already an auth route (login/signup/refresh), DO NOT retry
      const requestUrl = originalRequest.url || '';
      if (
        requestUrl.includes('/auth/refresh') ||
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/signup')
      ) {
        return Promise.reject(error);
      }
  
      // C. If this specific request has already been retried once, don't loop
      if (originalRequest._retry) {
        return Promise.reject(error);
      }
  
      // D. If a refresh is ALREADY running, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }
  
      // E. This is the first request to hit a 401: lock and execute refresh
      originalRequest._retry = true;
      isRefreshing = true;
  
      try {
        // Call refresh route. The browser automatically sends the HttpOnly refreshToken cookie.
        await apiClient.post('/auth/refresh');
  
        // Unblock all other requests that were paused in the queue
        processQueue(null);
  
        // Re-run this original failed request with the new cookie now set
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, reject all paused requests
        processQueue(refreshError as AxiosError);
  
        // Notify the app that the session is completely dead (refresh token expired)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
  
        return Promise.reject(refreshError);
      } finally {
        // Release lock regardless of success or failure
        isRefreshing = false;
      }
    },
  );