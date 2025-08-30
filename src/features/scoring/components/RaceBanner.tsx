// src/features/scoring/components/RaceBanner.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '~/config/theme';

type Props = {
  winnerName: string;
  onContinue?: () => void;
};

export default function RaceBanner({ winnerName, onContinue }: Props) {
  return (
    <View
      className="mx-5 mt-3 rounded-2xl px-4 py-3"
      style={{
        backgroundColor: theme.colors.surface.card,
        borderColor: theme.colors.surface.border,
        borderWidth: 1,
      }}>
      <View className="flex-row items-center">
        <Ionicons name="trophy" size={18} color={theme.colors.brand.accent} />
        <Text className="ml-2 font-semibold" style={{ color: theme.colors.text.primary }}>
          Match complete — {winnerName} wins
        </Text>
      </View>

      {onContinue && (
        <Pressable
          onPress={onContinue}
          className="mt-3 items-center justify-center rounded-xl py-2"
          style={{ backgroundColor: theme.colors.brand.accent }}>
          <Text className="font-semibold text-white">Continue</Text>
        </Pressable>
      )}
    </View>
  );
}
