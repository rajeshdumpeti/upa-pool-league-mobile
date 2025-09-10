import type { TeamSide } from '../models/prematch';
import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, FlatList, Pressable, Animated } from 'react-native';
import { tryHaptic } from '../utils/haptics';

type Player = { id: number; name: string; skill?: number | null };

export default function PlayerPickerModal({
  visible,
  teamLabel,
  players,
  onClose,
  onSelect,
}: {
  visible: boolean;
  // Allow the caller to pass 'Home' | 'Away' (normal) or 'Winner' as a fallback display
  teamLabel: TeamSide | 'Winner';
  players: Player[] | undefined;
  onClose: () => void;
  onSelect: (playerId: number) => void;
}) {
  const data = Array.isArray(players) ? players : [];
  const translateY = useRef(new Animated.Value(400)).current;
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      ]).start();
    } else {
      translateY.setValue(400);
      fade.setValue(0);
    }
  }, [visible, translateY, fade]);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <Animated.View className="flex-1 bg-black/40" style={{ opacity: fade }}>
        <View className="flex-1" />
        <Animated.View className="rounded-t-3xl bg-white" style={{ transform: [{ translateY }] }}>
          <View className="border-b border-slate-200 px-5 pb-3 pt-4">
            <Text className="text-center text-lg font-semibold text-slate-900">
              Select Breaker – {teamLabel} Team
            </Text>
          </View>

          {/* List */}
          <FlatList
            className="px-5 pt-3"
            data={data}
            keyExtractor={(p) => String(p.id)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  tryHaptic('success');
                  onSelect(item.id);
                }}
                className="mb-3 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4"
                style={{
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                }}
                accessibilityRole="button"
                accessibilityLabel={`Choose ${item.name} as breaker`}
                testID={`pick-${item.id}`}>
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <Text className="font-semibold text-slate-700">
                    {item.name.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-800">{item.name}</Text>
                  {item.skill != null && (
                    <Text className="text-xs text-slate-500">Skill {item.skill}</Text>
                  )}
                </View>
                <Text className="text-blue-600">Choose</Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <View className="px-5 pt-6">
                <Text className="text-center text-slate-500">No players available</Text>
              </View>
            }
          />

          {/* Footer */}
          <View className="px-5 pb-8 pt-2">
            <Pressable
              onPress={onClose}
              className="h-12 items-center justify-center rounded-2xl bg-slate-100"
              accessibilityRole="button"
              accessibilityLabel="Cancel player selection">
              <Text className="font-medium text-slate-700">Cancel</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
