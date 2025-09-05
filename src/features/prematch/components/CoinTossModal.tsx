import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

export default function CoinTossModal({
  visible,
  onClose,
  onResult,
}: {
  visible: boolean;
  onClose: () => void;
  onResult: (side: 'heads' | 'tails') => void;
}) {
  // For Part 1 we don't animate; we just pick randomly on “Flip”.
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-2xl bg-white p-5">
          <Text className="mb-3 text-lg font-semibold">Coin Toss</Text>
          <Text className="mb-4 text-zinc-600">Flip a coin to decide the breaking team.</Text>
          <View className="flex-row justify-end gap-3">
            <Pressable onPress={onClose}>
              <Text className="text-zinc-600">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const side = Math.random() < 0.5 ? 'heads' : 'tails';
                onResult(side);
              }}>
              <Text className="font-semibold text-blue-600">Flip</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
