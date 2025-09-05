import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CoinTossButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
      <Text className="mb-3 font-semibold text-slate-900">Coin Toss</Text>
      <View className="items-center">
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Open coin toss"
          className="h-20 w-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: '#e8efff',
            shadowOpacity: 0.18,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          }}>
          <Ionicons name="sync-circle" size={44} color="#2261ff" />
        </Pressable>
        <Text className="mt-2 text-sm font-medium text-slate-700">{label}</Text>
      </View>
    </View>
  );
}
