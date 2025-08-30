// -----------------------------------------------------------------------------
// Purpose: Compact, read-only banner that shows provided score + breaker,
//          plus a subtle progress bar for each side's race target.
// Presentation-only. Receives all data via props.
// -----------------------------------------------------------------------------

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '~/config/theme';

type Props = {
  className?: string;
  scoreText: string; // e.g., "Home 2/3 — 1/3 Away"
  breakerLabel: string; // e.g., "Break: Home Player" or "Break: —"
  homeProgress?: number; // 0..1
  awayProgress?: number; // 0..1
};

export default function ScoreStrip({
  className = '',
  scoreText,
  breakerLabel,
  homeProgress = 0,
  awayProgress = 0,
}: Props) {
  // clamp just in case
  const hp = Math.max(0, Math.min(1, homeProgress));
  const ap = Math.max(0, Math.min(1, awayProgress));

  return (
    <View
      className={['mx-5 mb-2 mt-3 rounded-2xl px-4 py-3', 'flex-col', className].join(' ')}
      style={{
        backgroundColor: theme.colors.surface.card,
        borderColor: theme.colors.surface.border,
        borderWidth: 1,
      }}>
      {/* Top row: score + breaker */}
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-base font-semibold" style={{ color: theme.colors.text.primary }}>
          {scoreText}
        </Text>

        <View className="flex-row items-center">
          <Ionicons
            name="golf-outline"
            size={18}
            color={theme.colors.text.muted}
            style={{ marginRight: 6 }}
          />
          <Text className="text-sm" style={{ color: theme.colors.text.muted }}>
            {breakerLabel}
          </Text>
        </View>
      </View>

      {/* Progress: two ultra-thin bars, one for each side */}
      <View className="mt-1">
        {/* Home */}
        <View
          style={{
            height: 4,
            borderRadius: 999,
            backgroundColor: theme.colors.surface.background,
            overflow: 'hidden',
          }}>
          <View
            style={{
              width: `${hp * 100}%`,
              height: '100%',
              backgroundColor: theme.colors.brand.accent,
            }}
          />
        </View>

        {/* Gap */}
        <View style={{ height: 4 }} />

        {/* Away */}
        <View
          style={{
            height: 4,
            borderRadius: 999,
            backgroundColor: theme.colors.surface.background,
            overflow: 'hidden',
          }}>
          <View
            style={{
              width: `${ap * 100}%`,
              height: '100%',
              backgroundColor: theme.colors.text.muted, // slightly different tone
              opacity: 0.9,
            }}
          />
        </View>
      </View>
    </View>
  );
}
