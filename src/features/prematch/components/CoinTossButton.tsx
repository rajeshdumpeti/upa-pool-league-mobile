import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CoinTossButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
      <Text className="mb-3 font-semibold text-slate-900">{label}</Text>
      <View className="flex-row justify-center gap-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open coin toss"
          onPress={onPress}
          className="h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: '#0f4c81' }}>
          <Ionicons name="sync-outline" size={26} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
