// app.config.ts
import 'dotenv/config';
import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'UPA Pool League',
  slug: 'upa-pool-league-mobile',
  version: '1.0.0',
  scheme: 'upa',
  runtimeVersion: { policy: 'sdkVersion' },
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: { image: './assets/splash.png', resizeMode: 'contain', backgroundColor: '#ffffff' },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.rajesh05db.upapoolleaguemobile',
    infoPlist: { ITSAppUsesNonExemptEncryption: false },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: { favicon: './assets/favicon.png' },
  owner: 'rajesh05db',
  updates: { url: 'https://u.expo.dev/306dee42-8182-4879-a279-defc819cdf69' },

  // Everything we need at runtime lives under extra
  extra: {
    // Channel configs still available if you want them
    dev: {
      API_BASE: process.env.EXPO_PUBLIC_API_BASE, // optional override
      CMS_BASE: process.env.EXPO_PUBLIC_CMS_BASE,
      LOCAL_IP: process.env.EXPO_PUBLIC_LOCAL_IP, // just IP preferred (e.g., 192.168.1.192)
    },
    test: {
      API_BASE: process.env.EXPO_PUBLIC_API_BASE,
      CMS_BASE: process.env.EXPO_PUBLIC_CMS_BASE,
    },
    prod: {
      API_BASE: process.env.EXPO_PUBLIC_API_BASE,
      CMS_BASE: process.env.EXPO_PUBLIC_CMS_BASE,
    },
    eas: { projectId: '306dee42-8182-4879-a279-defc819cdf69' },
  },
};

export default config;
