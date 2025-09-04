// src/api/axiosClient.ts
import axios from 'axios';
import { ENV } from '~/config/env';
import { useAuthStore } from '~/stores/authStore';
import { getAuthToken } from './authHeader';

// ENV.apiBase already includes /api/v1 in your config
export const axiosClient = axios.create({
  baseURL: ENV.apiBase,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ---- Interceptors (minimal, mobile-friendly) ----

// Add common headers if needed later (auth, trace-id, etc.)
axiosClient.interceptors.request.use((config) => {
  // example: config.headers['X-App-Channel'] = ENV.channel;
  // Attach bearer if we have it (no hard dependency at module load)
  const t = getAuthToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  try {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}

  return config;
});

// Normalize errors so screens get friendly messages
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    const detail = error?.response?.data?.detail;
    let message: string | undefined;

    if (Array.isArray(detail) && detail.length > 0) {
      // FastAPI/Pydantic v2 ValidationError format
      const first = detail[0];
      message = `Validation error at ${first?.loc?.join?.('.') ?? 'unknown'}: ${first?.msg ?? 'invalid input'}`;
    } else {
      const backendMsg = error?.response?.data?.detail || error?.response?.data?.message;
      message =
        typeof backendMsg === 'string'
          ? backendMsg
          : status === 0
            ? 'Network error'
            : status
              ? `Request failed (${status})`
              : 'Unexpected error';
    }

    // Keep the original error but attach a friendly message
    const normalized = new Error(message);
    normalized.cause = { status, url: error?.config?.url };
    throw normalized;
  }
);
