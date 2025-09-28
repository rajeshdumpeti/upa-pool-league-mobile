// src/features/prematch/components/TeamRosterAccordion.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type PlayerItem = { id: number; name: string; skill?: number | null };

export default function TeamRosterAccordion({
  title,
  players,
}: {
  title: string;
  players: PlayerItem[];
}) {
  const [open, setOpen] = useState(true);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };

  return (
    <View className="mb-3 rounded-2xl bg-white p-3 shadow-sm">
      <Pressable
        onPress={toggle}
        className="flex-row items-center justify-between"
        accessibilityRole="button"
        accessibilityLabel={`${open ? 'Collapse' : 'Expand'} ${title}`}>
        <Text className="text-base font-semibold text-slate-900">{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#475569" />
      </Pressable>

      {open && (
        <View className="mt-2" style={{ gap: 8 }}>
          {players.map((p) => (
            <View
              key={p.id}
              className="flex-row items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
              <Text className="text-slate-800">{p.name}</Text>
              {p.skill != null ? <Text className="text-slate-500">Skill {p.skill}</Text> : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
