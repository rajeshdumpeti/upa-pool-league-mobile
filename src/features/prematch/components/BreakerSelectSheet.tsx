import React from 'react';
import { Modal, View, Text, FlatList, Pressable } from 'react-native';
import type { Player } from '../models/prematch';

export default function BreakerSelectSheet({
  visible,
  teamLabel,
  players,
  onSelect,
  onClose,
}: {
  visible: boolean;
  teamLabel: string;
  players: Player[];
  onSelect: (playerId: number) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[70%] rounded-t-3xl bg-white p-4">
          <View className="mb-3 h-1.5 w-10 self-center rounded-full bg-zinc-300" />
          <Text className="mb-2 text-base font-semibold">Select breaker ({teamLabel})</Text>
          <FlatList
            data={players}
            keyExtractor={(p) => String(p.id)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSelect(item.id)}
                className="h-12 flex-row items-center justify-between border-b border-zinc-100 px-1">
                <Text className="text-zinc-800">{item.name}</Text>
                {item.skill ? <Text className="text-zinc-500">S{item.skill}</Text> : null}
              </Pressable>
            )}
          />
          <Pressable onPress={onClose} className="mt-3 self-end">
            <Text className="text-blue-600">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
