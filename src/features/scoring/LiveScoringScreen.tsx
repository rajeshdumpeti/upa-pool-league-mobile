// src/features/scoring/LiveScoringScreen.tsx
import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '~/config/theme';
import { Card } from '~/components/Card';
import { Title } from '~/components/Title';
import { SummaryPill } from './components/SummaryPill';

import { useLiveScoringStore } from '~/stores/liveScoringStore';
import type { Shot, ShotSymbol } from '~/stores/liveScoringStore';
import type { LiveMatch } from './types';

import { computeRackTally, SHOT_KEYS, BREAK_KEYS } from './utils/scoring';
import ScoreStrip from './components/ScoreStrip';
import { useMatchScore } from './selectors/matchScore';

export default function LiveScoringScreen() {
  // read-only state
  const match = useLiveScoringStore((s) => s.match);
  const shots = useLiveScoringStore((s) => s.shots);
  const rackMeta = useLiveScoringStore((s) => s.rackMeta);

  // actions
  const hydrateMatch = useLiveScoringStore((s) => s.hydrateMatch);
  const startRack = useLiveScoringStore((s) => s.startRack);
  const setBreakMark = useLiveScoringStore((s) => s.setBreakMark);
  const addShot = useLiveScoringStore((s) => s.addShot);
  const removeLastShot = useLiveScoringStore((s) => s.removeLastShot);
  const completeRack = useLiveScoringStore((s) => s.completeRack);
  const resetRack = useLiveScoringStore((s) => s.resetRack);
  const ms = useMatchScore();

  // seed demo exactly once for local dev
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current || match) return;
    const demo: LiveMatch = {
      matchId: 'demo-1',
      format: '8-ball',
      raceToHome: 3,
      raceToAway: 3,
      home: { id: 1, name: 'Home Player', skill: 5 },
      away: { id: 2, name: 'Away Player', skill: 4 },
      currentRack: 1,
      racks: [],
      status: 'in_progress',
    };
    hydrateMatch(demo);
    startRack(1, demo.home.id);
    seededRef.current = true;
  }, [match, hydrateMatch, startRack]);

  const rackNumber = rackMeta?.rackNumber ?? 1;

  // stats for current rack only
  const tally = useMemo(() => computeRackTally(shots as Shot[], rackNumber), [shots, rackNumber]);

  // handlers
  const onStartRack = (breakerId: number) => {
    if (!match) return;
    startRack(rackNumber, breakerId);
  };
  const onAddShot = (playerId: number, symbol: ShotSymbol) => addShot(playerId, symbol);
  const onCompleteRack = (winnerId: number) => completeRack(winnerId, '');

  if (!match) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Preparing demo match…</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerClassName="pb-6">
      <ScoreStrip
        homeWins={ms.homeWins}
        awayWins={ms.awayWins}
        homeName={ms.homeName}
        awayName={ms.awayName}
        breakerName={ms.breakerName}
      />

      {/* Header */}
      <View className="px-5 pt-4">
        <Text className="text-lg font-semibold text-zinc-900">{match.format.toUpperCase()}</Text>
        <Text className="text-zinc-500">
          Race {match.home.name} to {match.raceToHome} vs {match.away.name} to {match.raceToAway}
        </Text>
      </View>

      {/* Current rack / breaker */}
      <Card className="mx-5 mt-4">
        <Title>Rack {rackNumber}</Title>
        <View className="mt-2 flex-row gap-3">
          <TouchableOpacity
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: theme.colors.surface.background }}
            onPress={() => onStartRack(match.home.id)}>
            <Text className="text-zinc-700">Break: {match.home.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: theme.colors.surface.background }}
            onPress={() => onStartRack(match.away.id)}>
            <Text className="text-zinc-700">Break: {match.away.name}</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3 flex-row items-center gap-2">
          <Text className="text-zinc-500">BRK:</Text>
          {BREAK_KEYS.map((b) => (
            <TouchableOpacity
              key={b}
              onPress={() => setBreakMark(b)}
              className="mr-2 h-8 items-center justify-center rounded-xl px-3"
              style={{
                backgroundColor:
                  rackMeta?.breakMark === b
                    ? theme.colors.brand.accent
                    : theme.colors.surface.background,
              }}>
              <Text
                style={{
                  color: rackMeta?.breakMark === b ? '#fff' : theme.colors.text.muted,
                  fontWeight: '600',
                }}>
                {b}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Shot pads */}
      <Card className="mx-5 mt-4">
        <Title>Shots</Title>
        <Text className="mt-1 text-zinc-500">Tap to record for a player</Text>

        {/* Home row */}
        <View className="mt-3">
          <Text className="mb-2 font-medium text-zinc-700">{match.home.name}</Text>
          <View className="flex-row flex-wrap gap-2">
            {SHOT_KEYS.map((s) => (
              <TouchableOpacity
                key={`h-${s}`}
                onPress={() => onAddShot(match.home.id, s)}
                className="h-10 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: theme.colors.surface.background }}>
                <Text className="font-semibold text-zinc-700">{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Away row */}
        <View className="mt-4">
          <Text className="mb-2 font-medium text-zinc-700">{match.away.name}</Text>
          <View className="flex-row flex-wrap gap-2">
            {SHOT_KEYS.map((s) => (
              <TouchableOpacity
                key={`a-${s}`}
                onPress={() => onAddShot(match.away.id, s)}
                className="h-10 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: theme.colors.surface.background }}>
                <Text className="font-semibold text-zinc-700">{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Controls */}
        <View className="mt-5 flex-row gap-8">
          <TouchableOpacity onPress={removeLastShot} className="flex-row items-center gap-2">
            <Ionicons name="send-outline" size={18} color={theme.colors.text.muted} />
            <Text className="text-zinc-500">Undo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetRack} className="flex-row items-center gap-2">
            <Ionicons name="refresh-outline" size={18} color={theme.colors.text.muted} />
            <Text className="text-zinc-500">Reset Rack</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Tally + complete */}
      <Card className="mx-5 mt-4">
        <Title>Rack Summary</Title>
        <View className="mt-2 flex-row flex-wrap gap-x-6 gap-y-2">
          <SummaryPill label="Innings" value={tally.innings} />
          <SummaryPill label="Safeties" value={tally.safeties} />
          <SummaryPill label="Timeouts" value={tally.timeouts} />
          <SummaryPill label="Fouls" value={tally.fouls} />
          <SummaryPill label="8s" value={tally.eights} />
        </View>

        <View className="mt-4 flex-row gap-3">
          <TouchableOpacity
            className="h-12 flex-1 items-center justify-center rounded-2xl"
            style={{ backgroundColor: theme.colors.brand.accent }}
            onPress={() => onCompleteRack(match.home.id)}>
            <Text className="font-semibold text-white">Rack to {match.home.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-12 flex-1 items-center justify-center rounded-2xl"
            style={{ backgroundColor: theme.colors.brand.accent }}
            onPress={() => onCompleteRack(match.away.id)}>
            <Text className="font-semibold text-white">Rack to {match.away.name}</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* History */}
      {match.racks.length > 0 && (
        <Card className="mx-5 mb-6 mt-4">
          <Title>History</Title>
          {match.racks.map((r) => (
            <View key={r.id} className="mt-2 flex-row justify-between">
              <Text className="text-zinc-600">Rack {r.rackNumber}</Text>
              <Text className="text-zinc-600">
                Winner: {r.winnerPlayerId === match.home.id ? match.home.name : match.away.name}
              </Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}
