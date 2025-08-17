// src/api/axiosClient.ts
import axios from 'axios';
import { ENV } from '../config/env';

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
  return config;
});

// Normalize errors so screens get friendly messages
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const backendMsg = error?.response?.data?.detail || error?.response?.data?.message;
    const message =
      backendMsg ||
      (status === 0 ? 'Network error' : status ? `Request failed (${status})` : 'Unexpected error');

    // Keep the original error but attach a friendly message
    const normalized = new Error(message);
    normalized.cause = { status, url: error?.config?.url };
    throw normalized;
  }
);
