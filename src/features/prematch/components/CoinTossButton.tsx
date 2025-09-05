import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { theme } from '~/config/theme';

export default function CoinTossButton({
  disabled,
  label,
  onPress,
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <View className="mb-3">
      <Text className="mb-2 text-base font-semibold text-zinc-800">Coin Toss</Text>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        className="h-12 w-full items-center justify-center rounded-2xl"
        style={{
          backgroundColor: disabled ? '#cbd5e1' : theme.colors.surface.background,
          borderWidth: 1,
          borderColor: theme.colors.surface.border,
        }}
        accessibilityRole="button"
        accessibilityLabel="Run coin toss">
        <Text style={{ fontWeight: '600', color: disabled ? '#666' : theme.colors.text.primary }}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}
