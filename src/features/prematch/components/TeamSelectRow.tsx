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
    <View className="mb-3">
      <Text className="mb-1 text-[13px] font-semibold text-slate-700">{label}</Text>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${value ? `Selected ${value}` : 'Tap to choose team'}`}
        className="h-12 flex-row items-center justify-between rounded-2xl bg-slate-100 px-4">
        <View className="flex-row items-center">
          <Ionicons name="people-outline" size={18} color="#0f4c81" />
          <Text className="ml-2 text-[16px] text-slate-900">{value ?? 'Select team'}</Text>
        </View>
        <Ionicons
          name="chevron-up-outline"
          size={18}
          color="#64748b"
          style={{ transform: [{ rotate: '90deg' }] }}
        />
      </Pressable>
    </View>
  );
}
