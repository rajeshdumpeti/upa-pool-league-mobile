// src/features/scoring/components/ScoreStrip.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '~/config/theme';

type Props = {
  className?: string;
  homeName: string;
  awayName: string;
  homeWins: number;
  awayWins: number;
  breakerLabel: string; // "Break: X" or "Break: —"
};

function ScoreStripBase({
  className = '',
  homeName,
  awayName,
  homeWins,
  awayWins,
  breakerLabel,
}: Props) {
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
          {homeName} <Text style={{ color: theme.colors.brand.accent }}>{homeWins}</Text>
          {'  —  '}
          <Text style={{ color: theme.colors.brand.accent }}>{awayWins}</Text> {awayName}
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

export default React.memo(ScoreStripBase);
