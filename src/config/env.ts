export const ENV = {
    API_BASE_URL:
      import.meta.env.VITE_API_URL ||
      'https://assesspro-backend-icbw.onrender.com/api',
    IS_PROD: import.meta.env.PROD,
  } as const;