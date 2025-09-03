// src/features/scoring/LiveScoringScreen.tsx
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { UPAModal } from '~/components/Modal';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getRaceState } from './selectors/raceState';
import { TABS } from '~/navigation/routes'; // adjust to your app

import { theme } from '~/config/theme';
import { Card } from '~/components/Card';
import { Title } from '~/components/Title';
import { SummaryPill } from './components/SummaryPill';

import { useLiveScoringStore } from '~/stores/liveScoringStore';
import type { Shot, ShotSymbol } from '~/stores/liveScoringStore';
import type { LiveMatch } from './types';

import { computeRackTally, BREAK_KEYS } from './utils/scoring';
import ScoreStrip from './components/ScoreStrip';

import { useShallow } from 'zustand/react/shallow';
import { getMatchScore } from './selectors/matchScore';
import { DEV_SEED_LIVE_SCORING } from '~/config/flags';
import ShotPad from './components/ShotPad';
import RackHistoryItem from './components/RackHistory';
export default function LiveScoringScreen() {
  const [finishOpen, setFinishOpen] = useState(false);
  const shownForMatchId = useRef<string | null>(null);

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

  const race = getRaceState(useLiveScoringStore.getState());
  const inputsDisabled = race.raceDone;
  const nav = useNavigation<any>();

  const navToPostMatch = () => {
    setFinishOpen(false);
    // If LiveScore tab itself hosts a stack:
    // nav.navigate(TABS.LIVE_SCORE as never, { screen: LIVE_SCORE_STACK.POST_MATCH } as never);

    // If PostMatch is its own tab/route, adjust accordingly:
    nav.navigate(TABS.POST_MATCH as never);
  };

  // seed demo exactly once for local dev
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current || match) return;
    if (!DEV_SEED_LIVE_SCORING) return;
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
  const serverMatchId = useLiveScoringStore((s) => s.serverMatchId);

  const ms = useLiveScoringStore(useShallow((state) => getMatchScore(state)));

  const breakerLabel = ms.breakerName ? `Break: ${ms.breakerName}` : 'Break: —';

  const homeWins = match?.racks.filter((r) => r.winnerPlayerId === match.home.id).length ?? 0;
  const awayWins = match?.racks.filter((r) => r.winnerPlayerId === match.away.id).length ?? 0;

  const raceDone =
    !!match &&
    ((match.raceToHome && homeWins >= match.raceToHome) ||
      (match.raceToAway && awayWins >= match.raceToAway));
  const winnerSide =
    !!match && match.raceToHome && homeWins >= match.raceToHome
      ? 'home'
      : !!match && match.raceToAway && awayWins >= match.raceToAway
        ? 'away'
        : undefined;

  // stats for current rack only
  const tally = useMemo(() => computeRackTally(shots as Shot[], rackNumber), [shots, rackNumber]);

  // open exactly once per matchId when raceDone flips to true
  useEffect(() => {
    if (!match) return;
    if (raceDone && shownForMatchId.current !== match.matchId) {
      setFinishOpen(true);
      shownForMatchId.current = match.matchId;
    }
  }, [raceDone, match]);

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
        homeName={ms.homeName ?? 'Home'}
        awayName={ms.awayName ?? 'Away'}
        homeWins={ms.homeWins}
        awayWins={ms.awayWins}
        breakerLabel={breakerLabel}
        // NEW
        homeProgress={ms.homeProgress}
        awayProgress={ms.awayProgress}
        homeOnHill={ms.homeOnHill}
        awayOnHill={ms.awayOnHill}
        raceDone={ms.raceDone}
        winnerSide={ms.winnerSide}
      />
      {__DEV__ && (
        <View className="mx-5 mt-1">
          <Text className="text-xs text-zinc-500">
            serverMatchId: {String(serverMatchId ?? '—')}
          </Text>
        </View>
      )}
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

        {/* Home */}
        <View className="mt-3" pointerEvents="box-none">
          <ShotPad
            className="relative"
            playerName={match.home.name}
            playerId={match.home.id}
            onShot={onAddShot}
          />
        </View>

        {/* Away */}
        <View className="mt-4" pointerEvents="box-none">
          <ShotPad
            className="relative"
            playerName={match.away.name}
            playerId={match.away.id}
            onShot={onAddShot}
          />
        </View>

        {/* Controls (unchanged) */}
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
            disabled={inputsDisabled}
            style={{
              backgroundColor: inputsDisabled ? '#cbd5e1' : theme.colors.brand.accent,
              opacity: inputsDisabled ? 0.7 : 1,
            }}
            onPress={() => onCompleteRack(match.home.id)}>
            <Text className="font-semibold text-white">Rack to {match.home.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-12 flex-1 items-center justify-center rounded-2xl"
            disabled={inputsDisabled}
            style={{
              backgroundColor: inputsDisabled ? '#cbd5e1' : theme.colors.brand.accent,
              opacity: inputsDisabled ? 0.7 : 1,
            }}
            onPress={() => onCompleteRack(match.away.id)}>
            <Text className="font-semibold text-white">Rack to {match.away.name}</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* History */}
      {match.racks.length > 0 && (
        <Card className="mx-5 mb-6 mt-4">
          <Title>History</Title>
          {match.racks.map((r, idx) => (
            <RackHistoryItem
              key={r.id}
              rack={r}
              home={match.home}
              away={match.away}
              defaultOpen={idx === match.racks.length - 1} // only newest rack opens
            />
          ))}
        </Card>
      )}
      <UPAModal
        visible={finishOpen}
        onRequestClose={() => setFinishOpen(false)}
        title="Race finished"
        actions={[
          {
            label: 'Stay Here',
            onPress: () => setFinishOpen(false),
            kind: 'secondary',
            testID: 'btn-stay',
          },
          {
            label: 'Review Summary',
            onPress: navToPostMatch,
            kind: 'primary',
            testID: 'btn-review',
          },
        ]}>
        {match && (
          <Text style={{ color: theme.colors.text.primary }}>
            ✓ Winner: {winnerSide === 'home' ? match.home.name : match.away.name}
          </Text>
        )}
      </UPAModal>
    </ScrollView>
  );
}
