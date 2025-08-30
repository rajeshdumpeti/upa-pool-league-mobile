// src/features/postmatch/PostMatchReviewScreen.tsx
// -----------------------------------------------------------------------------
// Purpose: Basic review screen shown once a race is finished.
// Later: add edit notes, per-rack details, “submit to server” action.
// -----------------------------------------------------------------------------
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLiveScoringStore } from '~/stores/liveScoringStore';
import { Card } from '~/components/Card';
import { Title } from '~/components/Title';
import { theme } from '~/config/theme';

export default function PostMatchReviewScreen() {
  const m = useLiveScoringStore((s) => s.match);
  const clear = useLiveScoringStore((s) => s.clear);

  if (!m) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No completed match to review.</Text>
      </View>
    );
  }

  const homeWins = m.racks.filter((r) => r.winnerPlayerId === m.home.id).length;
  const awayWins = m.racks.filter((r) => r.winnerPlayerId === m.away.id).length;

  return (
    <ScrollView className="flex-1" contentContainerClassName="pb-10">
      <Card className="mx-5 mt-4">
        <Title>Match Summary</Title>
        <Text className="mt-2 text-zinc-700">
          {m.home.name} {homeWins} — {awayWins} {m.away.name} ({m.format})
        </Text>
      </Card>

      <Card className="mx-5 mt-4">
        <Title>Racks</Title>
        {m.racks.map((r) => (
          <View key={r.id} className="mt-2 flex-row justify-between">
            <Text className="text-zinc-600">Rack {r.rackNumber}</Text>
            <Text className="text-zinc-600">
              Winner: {r.winnerPlayerId === m.home.id ? m.home.name : m.away.name}
            </Text>
          </View>
        ))}
      </Card>

      <View className="mx-5 mt-6 flex-row gap-3">
        <TouchableOpacity
          onPress={() => clear()}
          className="h-12 flex-1 items-center justify-center rounded-2xl"
          style={{ backgroundColor: theme.colors.surface.background }}>
          <Text className="font-semibold text-zinc-700">Clear Local</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // later: submit to server, then clear + navigate back to Pre-Match
            clear();
          }}
          className="h-12 flex-1 items-center justify-center rounded-2xl"
          style={{ backgroundColor: theme.colors.brand.accent }}>
          <Text className="font-semibold text-white">Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
