// src/lib/config.ts
export const config = {
    api: {
        baseUrl: import.meta.env.DEV
            ? import.meta.env.VITE_API_URL_DEVELOPMENT
            : import.meta.env.VITE_API_URL_PRODUCTION,
        timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    },
};