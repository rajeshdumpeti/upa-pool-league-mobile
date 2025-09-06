import React from 'react';
import { Modal, View, Text, FlatList, Pressable } from 'react-native';
import { TeamOut } from '~/api/teams';

export default function TeamPickerModal({
  visible,
  title,
  teams,
  onClose,
  onSelect,
}: {
  visible: boolean;
  title: string;
  teams: TeamOut[];
  onClose: () => void;
  onSelect: (team: TeamOut) => void;
}) {
  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-white">
        <View className="border-b border-slate-200 px-5 pb-3 pt-4">
          <Text className="text-center text-lg font-semibold text-slate-900">{title}</Text>
        </View>
        <FlatList
          className="px-5 pt-3"
          data={teams}
          keyExtractor={(t) => String(t.id)}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelect(item)}
              className="mb-3 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4"
              style={{
                shadowOpacity: 0.06,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}>
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Text className="font-semibold text-slate-700">
                  {item.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <Text className="flex-1 text-base font-semibold text-slate-800">{item.name}</Text>
              <Text className="text-blue-600">Choose</Text>
            </Pressable>
          )}
        />
        <View className="px-5 pb-6 pt-2">
          <Pressable
            onPress={onClose}
            className="h-12 items-center justify-center rounded-2xl bg-slate-100">
            <Text className="font-medium text-slate-700">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
