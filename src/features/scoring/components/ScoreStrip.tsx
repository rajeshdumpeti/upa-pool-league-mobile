// -----------------------------------------------------------------------------
// Purpose: Compact, read-only banner that shows a provided score text + breaker.
// Presentation-only. Receives data via props.
// -----------------------------------------------------------------------------

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '~/config/theme';

type Props = {
  className?: string;
  scoreText: string; // e.g., "Home 2/3 — 1/3 Away"
  breakerLabel: string; // e.g., "Break: Home Player" or "Break: —"
};

export default function ScoreStrip({ className = '', scoreText, breakerLabel }: Props) {
  return (
    <View
      className={[
        'mx-5 mb-2 mt-3 rounded-2xl px-4 py-3',
        'flex-row items-center justify-between',
        className,
      ].join(' ')}
      style={{
        backgroundColor: theme.colors.surface.card,
        borderColor: theme.colors.surface.border,
        borderWidth: 1,
      }}>
      <View className="flex-row items-center">
        <Text className="text-base font-semibold" style={{ color: theme.colors.text.primary }}>
          {scoreText}
        </Text>
      </View>

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
  );
}
