const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  console.warn('VITE_API_BASE_URL is not set. Add it to apps/web/.env.local.');
}

export const env = {
  apiBaseUrl: apiBaseUrl ?? 'http://localhost:4000/api/v1',
} as const;
