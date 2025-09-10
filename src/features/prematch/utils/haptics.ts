export function tryHaptic(kind: 'light' | 'success' | 'warning' = 'light') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Haptics = require('expo-haptics');
    if (kind === 'light') return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (kind === 'success')
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    // noop outside Expo or if package not installed
  }
}
