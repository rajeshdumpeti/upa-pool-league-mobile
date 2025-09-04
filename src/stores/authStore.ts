import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { login, me } from '~/api/auth';

type User = { email: string } | null;

type AuthState = {
  token: string | null;
  user: User;
  busy: boolean;
  error?: string | null;
  setToken: (t: string | null) => Promise<void>;
  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const TOKEN_KEY = 'auth.token';

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  busy: false,
  error: null,

  setToken: async (t) => {
    if (t) await SecureStore.setItemAsync(TOKEN_KEY, t);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: t });
  },

  hydrate: async () => {
    const t = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!t) return;
    set({ token: t, busy: true });
    try {
      const info = await me();
      set({ user: { email: info.email }, busy: false });
    } catch {
      await get().setToken(null);
      set({ user: null, busy: false });
    }
  },

  signIn: async (email, password) => {
    set({ busy: true, error: null });
    try {
      const { access_token } = await login({ email, password });
      await get().setToken(access_token);
      const info = await me();
      set({ user: { email: info.email }, busy: false });
    } catch (e: any) {
      set({ error: e?.message || 'Login failed', busy: false });
      await get().setToken(null);
    }
  },

  signOut: async () => {
    await get().setToken(null);
    set({ user: null });
  },
}));
