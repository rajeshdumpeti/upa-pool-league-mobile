import { Ionicons } from '@expo/vector-icons';

export const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  PreMatch: 'time-outline',
  LiveScore: 'stats-chart-outline',
  PostMatch: 'checkmark-done-outline',
  Score: 'trophy-outline',
  Status: 'pulse-outline',
};
