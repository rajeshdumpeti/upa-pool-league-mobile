// src/features/scoring/components/ScoreStrip.tsx
// -----------------------------------------------------------------------------
// Purpose: Compact, presentational "score line" at top of Live Scoring.
// Now receives preformatted labels so backend can switch to "Team: Player"
// without changing this component.
// -----------------------------------------------------------------------------

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../config/theme';

type Props = {
  homeLabel: string; // e.g., "Sharks: Alex"
  awayLabel: string; // e.g., "Wolves: Jamie"
  homeWins: number;
  awayWins: number;
  breakerLabel: string; // e.g., "Break: Alex"
  className?: string;
};

export default function ScoreStrip({
  homeLabel,
  awayLabel,
  homeWins,
  awayWins,
  breakerLabel,
  className = '',
}: Props) {
  return (
    <View
      className={[
        'mx-5 mb-2 mt-4 rounded-2xl px-4 py-3',
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
          {homeLabel} <Text style={{ color: theme.colors.brand.accent }}>{homeWins}</Text>
          {'  —  '}
          <Text style={{ color: theme.colors.brand.accent }}>{awayWins}</Text> {awayLabel}
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
