import axios from 'axios';
import type { AxiosError } from 'axios';
import { ENV } from '@/config/env';

/**
 * Central Axios HTTP Client.
 * All feature modules must use this instance for server communication.
 */
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Derive the request configuration type directly from apiClient itself.
 * This never fails, regardless of which Axios version is installed.
 */
type AxiosConfigType = NonNullable<Parameters<typeof apiClient>[0]>;

interface RetryableRequestConfig extends AxiosConfigType {
  _retry?: boolean;
}

/**
 * Concurrency lock and queue definitions for silent token refresh.
 */
let isRefreshing = false;

interface QueuedPromise {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let failedQueue: QueuedPromise[] = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest?.url || '';
    if (
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/signup')
    ) {
      return Promise.reject(error);
    }

    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    if (originalRequest) {
      originalRequest._retry = true;
    }
    isRefreshing = true;

    try {
      await apiClient.post('/auth/refresh');
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError: any) {
      processQueue(refreshError);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);