// src/features/scoring/components/ShotPad.tsx
// -----------------------------------------------------------------------------
// Purpose: Reusable, accessible shot-entry pad with grouped keys and safe UX.
// - Big touch targets, logical grouping, optional confirm for sensitive shots.
// - No store access; parent passes onShot(playerId, symbol).
// -----------------------------------------------------------------------------

import React, { useCallback } from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import type { ShotSymbol } from '~/stores/liveScoringStore';
import { theme } from '~/config/theme';
import { byCategory, needsConfirm, labelFor } from '../utils/shotMeta';

// Optional haptics (no hard dependency)
function tryHaptic(kind: 'light' | 'success' | 'warning' = 'light') {
  try {
    // Lazy require to avoid test/env issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Haptics = require('expo-haptics');
    const map: Record<typeof kind, any> = {
      light: Haptics.ImpactFeedbackStyle.Light,
      success: Haptics.NotificationFeedbackType.Success,
      warning: Haptics.NotificationFeedbackType.Warning,
    };
    if (kind === 'light') Haptics.impactAsync(map.light);
    else Haptics.notificationAsync(map[kind]);
  } catch {
    // noop if expo-haptics not installed / not available
  }
}

type Props = {
  title?: string;
  playerName: string;
  playerId: number;
  onShot: (playerId: number, symbol: ShotSymbol) => void;
  className?: string;
};

export default function ShotPad({
  title = 'Shots',
  playerName,
  playerId,
  onShot,
  className = '',
}: Props) {
  const confirmAndSend = useCallback(
    (sym: ShotSymbol) => {
      if (needsConfirm(sym)) {
        tryHaptic('warning');
        Alert.alert(
          labelFor(sym),
          `Record "${labelFor(sym)}" for ${playerName}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Record',
              style: 'default',
              onPress: () => {
                tryHaptic('success');
                onShot(playerId, sym);
              },
            },
          ],
          { userInterfaceStyle: 'light' }
        );
      } else {
        tryHaptic('light');
        onShot(playerId, sym);
      }
    },
    [onShot, playerId, playerName]
  );

  const Key = ({ sym }: { sym: ShotSymbol }) => (
    <Pressable
      onPress={() => confirmAndSend(sym)}
      className="h-12 flex-1 items-center justify-center rounded-xl"
      style={{
        backgroundColor: theme.colors.surface.background,
        borderColor: theme.colors.surface.border,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
      }}
      accessibilityRole="button"
      accessibilityLabel={`${labelFor(sym)} for ${playerName}`}
      testID={`shot-${sym}`}>
      <Text className="font-semibold" style={{ color: theme.colors.text.primary }}>
        {sym}
      </Text>
      <Text className="text-[11px]" style={{ color: theme.colors.text.muted }}>
        {labelFor(sym)}
      </Text>
    </Pressable>
  );

  const Group = ({
    cat,
    children,
    compact,
  }: {
    cat: string;
    children: React.ReactNode;
    compact?: boolean;
  }) => (
    <View className="mb-2">
      <Text className="mb-1 text-[11px] font-medium" style={{ color: theme.colors.text.muted }}>
        {cat.toUpperCase()}
      </Text>
      <View className={`flex-row ${compact ? '' : 'flex-wrap'}`}>{children}</View>
    </View>
  );

  return (
    <View className={className}>
      <Text className="mb-2 font-medium" style={{ color: theme.colors.text.primary }}>
        {playerName}
      </Text>

      {/* Offense row: 3 big keys */}
      <Group cat="Offense" compact>
        {byCategory('offense').map((s) => (
          <Key key={s.symbol} sym={s.symbol} />
        ))}
      </Group>

      {/* Safety row */}
      <Group cat="Safety" compact>
        {byCategory('safety').map((s) => (
          <Key key={s.symbol} sym={s.symbol} />
        ))}
      </Group>

      {/* Fouls row (wrap if needed) */}
      <Group cat="Fouls">
        {byCategory('foul').map((s) => (
          <Key key={s.symbol} sym={s.symbol} />
        ))}
      </Group>

      {/* Timeout + Special */}
      <Group cat="Other" compact>
        {[...byCategory('timeout'), ...byCategory('special')].map((s) => (
          <Key key={s.symbol} sym={s.symbol} />
        ))}
      </Group>
    </View>
  );
}
