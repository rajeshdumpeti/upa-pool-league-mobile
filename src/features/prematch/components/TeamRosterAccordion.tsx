import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Player } from '../models/prematch';

export default function TeamRosterAccordion({
  title,
  players,
  initiallyExpanded = false,
}: {
  title: string;
  players: Player[];
  initiallyExpanded?: boolean;
}) {
  const [open, setOpen] = useState(initiallyExpanded);
  return (
    <View className="mb-3 rounded-2xl border border-zinc-200 bg-white">
      <Pressable
        className="flex-row items-center justify-between p-4"
        onPress={() => setOpen((v) => !v)}>
        <Text className="text-base font-semibold text-zinc-800">{title}</Text>
        <Text className="text-zinc-500">{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View className="border-t border-zinc-100 px-4 py-2">
          {players.map((p) => (
            <View
              key={p.id}
              className="h-10 flex-row items-center justify-between border-b border-zinc-100">
              <Text className="text-zinc-800">{p.name}</Text>
              {p.skill ? <Text className="text-zinc-500">S{p.skill}</Text> : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
