import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { theme } from '~/config/theme';

export default function StartMatchBar({
  canStart,
  reason,
  onStart,
}: {
  canStart: boolean;
  reason?: string;
  onStart: () => void;
}) {
  return (
    <View className="mt-2">
      <Pressable
        disabled={!canStart}
        onPress={onStart}
        className="h-12 w-full items-center justify-center rounded-2xl"
        style={{
          backgroundColor: canStart ? theme.colors.brand.accent : '#cbd5e1',
        }}
        accessibilityRole="button"
        accessibilityLabel="Start Match">
        <Text className="font-semibold text-white">Start Match</Text>
      </Pressable>
      {!canStart && reason ? (
        <Text className="mt-2 text-center text-zinc-500">{reason}</Text>
      ) : null}
    </View>
  );
}
