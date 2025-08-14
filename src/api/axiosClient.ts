// src/api/axiosClient.ts
import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { ENV } from '../config/env';

function resolveApiBase(): string {
  const base = ENV.apiBase;

  if (!__DEV__) return base;

  // Keep localhost for iOS Simulator; Android uses 10.0.2.2 (we'll do that later)
  if (Platform.OS === 'ios' && base.includes('localhost')) return base;

  // If running on a physical device in LAN mode, derive Metro host IP
  const host = Constants.expoConfig?.hostUri?.split(':')?.[0];
  if (host && base.startsWith('http://localhost')) {
    return base.replace('http://localhost', `http://${host}`);
  }

  return base;
}

export const axiosClient = axios.create({
  baseURL: resolveApiBase(),
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.warn('[API ERROR]', err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);
