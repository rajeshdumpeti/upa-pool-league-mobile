// src/config/theme.ts
// Keep colors as plain strings (no const literal narrowing) so RN style types are happy.

export const colors = {
  brand: {
    primary: '#003366',
    primaryAlt: '#004080',
    accent: '#007AFF',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#64748b',
    inverse: '#ffffff',
  },
  surface: {
    background: '#F7F8FA',
    card: '#ffffff',
    border: '#e5e7eb',
  },
  state: {
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#dc2626',
    info: '#2563eb',
  },
};

export const radii = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 28 };

export const shadows = {
  card: {
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    android: { elevation: 2 },
  },
};

// Keep typography as simple JS objects; RN TextStyle accepts string for color.
export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: 0.2 },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '500' as const },
  caption: { fontSize: 12, color: colors.text.muted }, // <-- no TS error now
};

export const theme = { colors, radii, spacing, shadows, typography };
export type Theme = typeof theme;
