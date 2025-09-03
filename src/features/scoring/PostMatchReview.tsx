// src/features/postmatch/PostMatchReviewScreen.tsx
// -----------------------------------------------------------------------------
// Purpose: Basic review screen shown once a race is finished.
// Later: add edit notes, per-rack details, “submit to server” action.
// -----------------------------------------------------------------------------
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLiveScoringStore } from '~/stores/liveScoringStore';
import { Card } from '~/components/Card';
import { Title } from '~/components/Title';
import { theme } from '~/config/theme';
import { REMOTE_SCORING_ENABLED } from '~/config/flags';
import { TABS } from '~/navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { submitMatch } from '~/api/matches';

export default function PostMatchReviewScreen() {
  const m = useLiveScoringStore((s) => s.match);
  const clear = useLiveScoringStore((s) => s.clear);
  const nav = useNavigation<any>();
  const serverMatchId = useLiveScoringStore((s) => s.serverMatchId);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!m) return;

    // If remote disabled OR we never got a serverMatchId, just confirm + clear local
    if (!REMOTE_SCORING_ENABLED || !serverMatchId || typeof serverMatchId !== 'number') {
      Alert.alert(
        'Submit (local only)',
        'Remote is disabled or match has no server id yet. Clear local and finish?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => {
              clear();
              nav.navigate(TABS.PRE_MATCH as never);
            },
          },
        ]
      );
      return;
    }

    // Remote submit
    try {
      setSubmitting(true);
      const res = await submitMatch(serverMatchId);
      // Optional: basic success check
      if (res.status !== 'submitted') {
        throw new Error('Submit did not return expected status');
      }
      Alert.alert('Submitted', 'Match submitted to server.', [
        {
          text: 'OK',
          onPress: () => {
            clear(); // wipe local
            nav.navigate(TABS.PRE_MATCH as never);
          },
        },
      ]);
    } catch (err: any) {
      const msg = err?.message || 'Failed to submit match.';
      Alert.alert('Submit failed', msg);
    } finally {
      setSubmitting(false);
    }
  }, [m, clear, nav, serverMatchId]);

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
          onPress={onSubmit}
          className="h-12 flex-1 items-center justify-center rounded-2xl"
          disabled={submitting}
          style={{ backgroundColor: theme.colors.brand.accent, opacity: submitting ? 0.7 : 1 }}>
          <Text className="font-semibold text-white">{submitting ? 'Submitting…' : 'Submit'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
