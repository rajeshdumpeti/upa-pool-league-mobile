// src/features/scoring/components/ShotPad.tsx
// -----------------------------------------------------------------------------
// Purpose: Reusable, accessible shot-entry pad with grouped keys and safe UX.
// Adds: pressed-border feedback + "last shot" line (read-only).
// -----------------------------------------------------------------------------

import React, { useCallback, useState } from 'react';
import { View, Text, Alert, Pressable, ScrollView, Platform } from 'react-native';
import type { ShotSymbol } from '~/stores/liveScoringStore';
import { theme } from '~/config/theme';
import { byCategory, needsConfirm, labelFor } from '../utils/shotMeta';

// Optional haptics (no hard dependency)
function tryHaptic(kind: 'light' | 'success' | 'warning' = 'light') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Haptics = require('expo-haptics');
    const map: Record<typeof kind, any> = {
      light: Haptics.ImpactFeedbackStyle.Light,
      success: Haptics.NotificationFeedbackType.Success,
      warning: Haptics.NotificationFeedbackType.Warning,
    };
    if (kind === 'light') Haptics.impactAsync(map.light);
    else Haptics.notificationAsync(map[kind]);
  } catch {}
}

type Props = {
  title?: string;
  playerName: string;
  playerId: number;
  onShot: (playerId: number, symbol: ShotSymbol) => void;
  className?: string;
  /** NEW (optional): last shot to display under player name */
  lastShotSymbol?: ShotSymbol | null;
  shotsLine?: string;
};

export default function ShotPad({
  title = 'Shots',
  playerName,
  playerId,
  onShot,
  className = '',
  lastShotSymbol,
  shotsLine,
}: Props) {
  const [pressed, setPressed] = useState<ShotSymbol | null>(null);

  const confirmAndSend = useCallback(
    (sym: ShotSymbol) => {
      const doSend = () => {
        setPressed(sym);
        tryHaptic('light');
        onShot(playerId, sym);
        setTimeout(() => setPressed((p) => (p === sym ? null : p)), 180);
      };

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
                doSend();
              },
            },
          ],
          { userInterfaceStyle: 'light' }
        );
      } else {
        doSend();
      }
    },
    [onShot, playerId, playerName]
  );

  const Key = ({ sym }: { sym: ShotSymbol }) => {
    const isLast = lastShotSymbol === sym; // ← NEW
    return (
      <Pressable
        onPress={() => confirmAndSend(sym)}
        className="h-12 flex-1 items-center justify-center rounded-xl"
        style={{
          backgroundColor: theme.colors.surface.background,
          borderColor: isLast ? theme.colors.brand.accent : theme.colors.surface.border, // ← NEW
          borderWidth: isLast ? 2 : 1, // ← NEW
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
  };

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
    <View className={className} pointerEvents="auto">
      {/* Player header + last-shot line */}
      <View className="mb-2">
        <Text className="font-medium" style={{ color: theme.colors.text.primary }}>
          {playerName}
        </Text>
        <Text className="text-[11px]" style={{ color: theme.colors.text.muted }}>
          Last: {lastShotSymbol ?? '—'}
        </Text>

        {/* NEW: running shots line */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-1">
          <Text
            className="text-[12px]"
            style={{
              color: theme.colors.text.primary,
              // monospace helps alignment; falls back gracefully where unavailable
              fontFamily: Platform.select({
                ios: 'Menlo',
                android: 'monospace',
                default: undefined,
              }),
            }}>
            {shotsLine && shotsLine.length > 0 ? shotsLine : '—'}
          </Text>
        </ScrollView>
      </View>

      {/* Offense row: X / O / M */}
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

      {/* Fouls row */}
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
