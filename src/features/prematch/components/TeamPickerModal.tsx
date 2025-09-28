import React from 'react';
import { Modal, View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useMyTeams } from '../hooks/useTeams';
import type { TeamOut } from '~/api/teams';

export default function TeamPickerModal({
  visible,
  onClose,
  onPick,
  title = 'Select Team',
}: {
  visible: boolean;
  onClose: () => void;
  onPick: (team: TeamOut) => void;
  title?: string;
}) {
  const { data, isLoading, isError } = useMyTeams();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="max-h-[60%] rounded-t-2xl bg-white p-4">
          <Text className="mb-3 text-lg font-semibold">{title}</Text>

          {isLoading && <ActivityIndicator />}
          {isError && <Text className="text-red-600">Failed to load teams</Text>}

          <FlatList
            data={data ?? []}
            keyExtractor={(t) => String(t.id)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onPick(item);
                  onClose();
                }}
                className="mb-2 rounded-xl border border-slate-200 p-3">
                <Text className="text-base font-medium">{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
