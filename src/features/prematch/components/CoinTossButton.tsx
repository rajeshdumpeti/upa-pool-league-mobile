import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  helperWhenDisabled?: string;
};

export default function CoinTossButton({ label, onPress, disabled, helperWhenDisabled }: Props) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
      <Text className="mb-3 font-semibold text-slate-900">{label}</Text>

      <View className="flex-row justify-center gap-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open coin toss"
          accessibilityState={{ disabled: !!disabled }}
          onPress={onPress}
          disabled={disabled}
          className="h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: '#0f4c81', opacity: disabled ? 0.5 : 1 }}>
          <Ionicons name="sync-outline" size={26} color="#fff" />
        </Pressable>
      </View>

      {disabled && helperWhenDisabled ? (
        <Text className="mt-3 text-center text-xs text-slate-500">{helperWhenDisabled}</Text>
      ) : null}
    </View>
  );
}
