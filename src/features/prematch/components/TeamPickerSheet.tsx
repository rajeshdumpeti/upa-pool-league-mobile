import React from 'react';
import { Modal, Pressable, View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type TeamOption = { id: number; name: string };

export default function TeamPickerSheet({
  visible,
  title = 'Select Team',
  teams,
  onClose,
  onSelect,
}: {
  visible: boolean;
  title?: string;
  teams: TeamOption[];
  onClose: () => void;
  onSelect: (t: TeamOption) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <View className="mt-auto rounded-t-3xl bg-white p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-slate-900">{title}</Text>
            <Pressable onPress={onClose} accessibilityLabel="Close">
              <Ionicons name="close" size={22} color="#475569" />
            </Pressable>
          </View>

          <FlatList
            data={teams}
            keyExtractor={(i) => String(i.id)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                className="h-12 flex-row items-center justify-between rounded-2xl px-3"
                style={{ backgroundColor: '#f8fafc', marginBottom: 8 }}>
                <View className="flex-row items-center">
                  <Ionicons name="ribbon-outline" size={18} color="#0f4c81" />
                  <Text className="ml-2 text-[16px] text-slate-900">{item.name}</Text>
                </View>
                <Ionicons name="add-circle-outline" size={18} color="#64748b" />
              </Pressable>
            )}
          />
          <View style={{ height: 12 }} />
        </View>
      </Pressable>
    </Modal>
  );
}
