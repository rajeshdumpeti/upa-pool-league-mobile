// src/features/scoring/PreMatchScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useLiveScoringStore } from '~/stores/liveScoringStore';
import { TABS, LIVE_SCORE_STACK } from '~/navigation/routes';
import type { LiveMatch } from './types';

type Format = '8-ball' | '9-ball' | '10-ball';
const FORMATS: Format[] = ['8-ball', '9-ball', '10-ball'];

export default function PreMatchScreen() {
  const nav = useNavigation<any>();

  // --- local form state ------------------------------------------------------
  const [format, setFormat] = useState<Format>('8-ball');
  const [tableNo, setTableNo] = useState<string>('');
  const [coinToss, setCoinToss] = useState<'Home' | 'Away' | null>(null);

  // --- handlers --------------------------------------------------------------
  const onStartMatch = () => {
    if (!coinToss) return; // guard: require a winner

    // Build a minimal LiveMatch payload for LiveScoring
    const match: LiveMatch = {
      matchId: String(Date.now()),
      format, // <-- from local state
      raceToHome: 3, // TODO: compute from rules/skills
      raceToAway: 3, // TODO: compute from rules/skills
      home: { id: 1, name: 'Home Player', skill: 5 }, // TODO: from lineup
      away: { id: 2, name: 'Away Player', skill: 4 }, // TODO: from lineup
      currentRack: 1,
      racks: [],
      status: 'in_progress',
    };

    // 1) hydrate the scoring store
    const { hydrateMatch, startRack } = useLiveScoringStore.getState();
    hydrateMatch(match);

    // 2) start rack 1 with the coin-toss winner
    const breakerId = coinToss === 'Home' ? match.home.id : match.away.id;
    startRack(1, breakerId);

    // (Optional) you can persist tableNo if you add it to store later
    // e.g., useLiveScoringStore.getState().setTableNo?.(tableNo || undefined);

    // 3) navigate to the LiveScore tab (and optionally the inner screen)
    // If your LiveScore tab contains a stack screen named LIVE_SCORING:
    nav.navigate(TABS.LIVE_SCORE as never, { screen: LIVE_SCORE_STACK.LIVE_SCORING } as never);
    // nav.navigate(TABS.LIVE_SCORE as never);
  };

  // --- UI --------------------------------------------------------------------
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Top bar */}
      <View className="border-b border-slate-200 bg-white px-5 pb-3 pt-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="tennisball" size={20} color="#0f4c81" />
            <Text className="ml-2 text-lg font-semibold text-slate-900">Pre-Match Setup</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons
              name="help-circle-outline"
              size={22}
              color="#64748b"
              accessibilityLabel="Help"
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Card: Game Format */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <View className="mb-3 flex-row items-center">
            <Ionicons name="grid-outline" size={18} color="#0f4c81" />
            <Text className="ml-2 font-semibold text-slate-900">Game Format</Text>
          </View>

          <View className="flex-row flex-wrap">
            {FORMATS.map((f) => {
              const active = f === format;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFormat(f)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${f}`}
                  className={`mb-2 mr-2 rounded-full border px-3 py-2 ${
                    active ? 'border-blue-900 bg-blue-900' : 'border-slate-300 bg-white'
                  }`}>
                  <Text className={`text-sm ${active ? 'text-white' : 'text-slate-900'}`}>{f}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text className="mt-2 text-xs text-slate-500">
            You can change the format until scoring starts.
          </Text>
        </View>

        {/* Card: Table + Coin Toss */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          {/* Table number */}
          <View className="mb-5">
            <View className="mb-2 flex-row items-center">
              <Ionicons name="cube-outline" size={18} color="#0f4c81" />
              <Text className="ml-2 font-semibold text-slate-900">Table Number (optional)</Text>
            </View>
            <TextInput
              value={tableNo}
              onChangeText={setTableNo}
              placeholder="e.g., 12"
              keyboardType="number-pad"
              placeholderTextColor="#94a3b8"
              className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-base"
            />
          </View>

          {/* Coin toss */}
          <View>
            <View className="mb-2 flex-row items-center">
              <Ionicons name="sync-circle-outline" size={18} color="#0f4c81" />
              <Text className="ml-2 font-semibold text-slate-900">Coin Toss</Text>
            </View>
            <View className="flex-row">
              {(['Home', 'Away'] as const).map((side) => {
                const active = coinToss === side;
                return (
                  <Pressable
                    key={side}
                    onPress={() => setCoinToss(side)}
                    accessibilityRole="button"
                    accessibilityLabel={`${side} team wins coin toss`}
                    className={`mr-2 rounded-full border px-4 py-2 ${
                      active ? 'border-blue-900 bg-blue-900' : 'border-slate-300 bg-white'
                    }`}>
                    <Text className={`text-sm ${active ? 'text-white' : 'text-slate-900'}`}>
                      {side} Team
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text className="mt-2 text-xs text-slate-500">
              Pick who breaks first. You can still review before starting.
            </Text>
          </View>
        </View>

        {/* Footer actions */}
        <View className="rounded-2xl bg-white p-4 shadow-sm">
          <View className="flex-col">
            <Pressable
              disabled={!coinToss}
              onPress={onStartMatch}
              className={`items-center justify-center rounded-xl py-3 ${
                coinToss ? 'bg-blue-900' : 'bg-slate-300'
              }`}
              accessibilityRole="button"
              accessibilityLabel="Start match">
              <Text className="text-base font-bold text-white">Start Match</Text>
            </Pressable>

            <Text className="mt-3 text-center text-xs text-slate-500">
              We’ll add lineup and rules validation in the next step.
            </Text>
          </View>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
