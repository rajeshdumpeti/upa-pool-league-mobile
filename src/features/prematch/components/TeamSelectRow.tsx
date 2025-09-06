import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TeamSelectRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
      accessibilityRole="button"
      accessibilityLabel={`Select ${label}`}>
      <View>
        <Text className="text-xs text-slate-500">{label}</Text>
        <Text className="mt-0.5 text-base font-semibold text-slate-800">
          {value || 'select team'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#64748b" />
    </Pressable>
  );
}
