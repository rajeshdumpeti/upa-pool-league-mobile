// src/config/env.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';

type Extra = {
  dev?: { API_BASE?: string; CMS_BASE?: string; LOCAL_IP?: string };
  test?: { API_BASE?: string; CMS_BASE?: string };
  prod?: { API_BASE?: string; CMS_BASE?: string };
  eas?: { projectId?: string };
  channel?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

// If you later use expo-updates with channels, prefer that at runtime.
// For now, default to 'dev' locally.
const inferredChannel =
  (extra as any)?.channel ?? (Constants as any)?.expoConfig?.updates?.channel ?? 'dev';

const CHANNEL: 'dev' | 'test' | 'prod' =
  inferredChannel === 'test' || inferredChannel === 'prod' ? inferredChannel : 'dev';

// Highest-priority overrides (local or EAS env)
const EXPLICIT_API = process.env.EXPO_PUBLIC_API_BASE;
const EXPLICIT_CMS = process.env.EXPO_PUBLIC_CMS_BASE;

// Build the dev URL based on device type
function resolveDevApiBase(): string {
  // explicit override (e.g., ngrok) wins
  if (EXPLICIT_API) return EXPLICIT_API;

  // Simulators
  if (Platform.OS === 'ios') return 'http://127.0.0.1:8080/api/v1';
  if (Platform.OS === 'android') return 'http://10.0.2.2:8000/api/v1';

  // Physical device: require a LAN IP in env/extra
  const localIp = extra.dev?.LOCAL_IP || process.env.EXPO_PUBLIC_LOCAL_IP;
  if (localIp) {
    // If you put the FULL URL in LOCAL_IP, keep it:
    if (/^https?:\/\//i.test(localIp)) return localIp;
    // If it's just an IP, build the URL:
    return `http://${localIp}:8000/api/v1`;
  }

  // Last resort fallback
  return extra.dev?.API_BASE || 'http://127.0.0.1:8080/api/v1';
}

function resolveApiBase(): string {
  if (EXPLICIT_API) return EXPLICIT_API;
  if (CHANNEL === 'dev') return resolveDevApiBase();
  if (CHANNEL === 'test') return extra.test?.API_BASE || 'https://api-test.example.com/api/v1';
  return extra.prod?.API_BASE || 'https://api.example.com/api/v1';
}

function resolveCmsBase(): string {
  if (EXPLICIT_CMS) return EXPLICIT_CMS;
  if (CHANNEL === 'dev') return extra.dev?.CMS_BASE || 'https://dev-cms.example.com';
  if (CHANNEL === 'test') return extra.test?.CMS_BASE || 'https://cms-test.example.com';
  return extra.prod?.CMS_BASE || 'https://cms.example.com';
}

export const ENV = {
  channel: CHANNEL,
  apiBase: resolveApiBase(),
  cmsBase: resolveCmsBase(),
};
