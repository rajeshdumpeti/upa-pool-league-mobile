// src/features/prematch/PreMatchScreen.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { usePreMatchState } from './hooks/usePreMatchState';
import type { TeamSide, CoinResult } from '../prematch/models/prematch';

// UI
import FormatPicker from './components/FormatPicker';
import CoinTossButton from './components/CoinTossButton';
import CoinTossModal from './components/CoinTossModal';
import PlayerPickerModal from './components/PlayerPickerModal';
import TeamRosterAccordion from './components/TeamRosterAccordion';
import StartMatchBar from './components/StartMatchBar';
import TeamSelectRow from './components/TeamSelectRow';
import { canStartMatch } from './utils/validators';
import type { TeamOut } from '~/api/teams';
// Data hooks (you said these already exist)
import { useMyTeams, useTeamRoster } from './hooks/useTeams';

// Live scoring + backend
import { useLiveScoringStore } from '~/stores/liveScoringStore';
import { TABS } from '~/navigation/routes';
import { createMatch } from '~/api/matches';
import type { LiveMatch } from '../scoring/types';

function PlayerChip({ label }: { label: string }) {
  return (
    <View className="mt-2 self-start rounded-full bg-slate-100 px-3 py-1">
      <Text className="text-xs font-medium text-slate-600">{label}</Text>
    </View>
  );
}

export default function PreMatchScreen() {
  const nav = useNavigation<any>();

  const {
    // state
    format,
    setFormat,
    coinResult,
    setCoinResult,
    breaker,
    setBreaker,

    // visibility
    coinModalOpen,
    setCoinModalOpen,
    breakerSheetOpen,
    setBreakerSheetOpen,

    // local fallback rosters (used if server rosters not loaded)
    homeRoster,
    awayRoster,

    // submit flags
    submitting,
    startSubmitting,
    stopSubmitting,
  } = usePreMatchState();

  // --- Team selection state ---
  // inside your screen component…
  // --- Team selection state ---
  // inside your screen component…
  // --- Team selection state (simple: store the picked team objects) ---
  const [homeTeam, setHomeTeam] = React.useState<TeamOut | null>(null);
  const [awayTeam, setAwayTeam] = React.useState<TeamOut | null>(null);
  // NEW: modal toggles for Game-1 pickers
  const [showHomePlayerPicker, setShowHomePlayerPicker] = React.useState(false);
  const [showAwayPlayerPicker, setShowAwayPlayerPicker] = React.useState(false);
  // NEW: explicit Game-1 player picks
  const [game1HomePlayerId, setGame1HomePlayerId] = React.useState<number | null>(null);
  const [game1AwayPlayerId, setGame1AwayPlayerId] = React.useState<number | null>(null);

  // derive server rosters for the chosen teams
  const homeRosterQ = useTeamRoster(homeTeam?.id);
  const awayRosterQ = useTeamRoster(awayTeam?.id);

  const effectiveHomeRoster = homeRosterQ.data?.length ? homeRosterQ.data : homeRoster;
  const effectiveAwayRoster = awayRosterQ.data?.length ? awayRosterQ.data : awayRoster;

  // Build a selection object to validate
  const selection = React.useMemo(
    () => ({
      format,
      homeTeamId: homeTeam?.id ?? null,
      awayTeamId: awayTeam?.id ?? null,
      game1HomePlayerId,
      game1AwayPlayerId,
      coin: coinResult
        ? { side: coinResult.face.toLowerCase() as any, winner: coinResult.winner }
        : null,
      breaker: breaker ? { team: breaker.team, playerId: breaker.playerId } : null,
    }),
    [format, homeTeam, awayTeam, game1HomePlayerId, game1AwayPlayerId, coinResult, breaker]
  );

  const startCheck = canStartMatch(selection);
  const canStart = startCheck.ok;
  const reason = startCheck.ok ? undefined : startCheck.reason;
  // Changing team invalidates that side's Game-1 pick and any breaker/toss
  useEffect(() => {
    setGame1HomePlayerId(null);
    if (breaker?.team === 'Home') {
      setBreaker(null as any);
    }
    if (coinResult) setCoinResult(null as any);
  }, [homeTeam?.id]);

  useEffect(() => {
    setGame1AwayPlayerId(null);
    if (breaker?.team === 'Away') {
      setBreaker(null as any);
    }
    if (coinResult) setCoinResult(null as any);
  }, [awayTeam?.id]);

  // Changing a Game-1 pick may invalidate breaker
  useEffect(() => {
    if (
      breaker &&
      breaker.playerId !== game1HomePlayerId &&
      breaker.playerId !== game1AwayPlayerId
    ) {
      setBreaker(null as any);
    }
  }, [game1HomePlayerId, game1AwayPlayerId, breaker, setBreaker]);

  const onStartMatch = async () => {
    // must have teams, players, breaker
    if (!homeTeam?.id || !awayTeam?.id) return;
    if (!game1HomePlayerId || !game1AwayPlayerId) return;
    if (!breaker?.playerId) return;

    startSubmitting();
    try {
      const chosenHomeId = homeTeam.id;
      const chosenAwayId = awayTeam.id;
      const homeTeamName = homeTeam.name ?? 'Home Team';
      const awayTeamName = awayTeam.name ?? 'Away Team';

      // Use the explicit picks (not first roster item)
      const homePlayer = effectiveHomeRoster.find((p) => p.id === game1HomePlayerId) ?? {
        id: game1HomePlayerId,
        name: 'Home Player',
        skill: 5,
      };

      const awayPlayer = effectiveAwayRoster.find((p) => p.id === game1AwayPlayerId) ?? {
        id: game1AwayPlayerId,
        name: 'Away Player',
        skill: 4,
      };

      // Server create (stub OK)
      let serverMatchId: number | undefined;
      try {
        const created = await createMatch({
          format,
          home_team: { id: chosenHomeId, name: homeTeamName },
          away_team: { id: chosenAwayId, name: awayTeamName },
          home_lineup: [{ order: 1, player: homePlayer }],
          away_lineup: [{ order: 1, player: awayPlayer }],
          coin_toss_winner_team_id: coinResult?.winner === 'Home' ? chosenHomeId : chosenAwayId,
        });
        serverMatchId = created.id;
      } catch (err) {
        console.warn('[PreMatch] createMatch failed, proceeding offline', err);
      }

      // Hydrate live match
      const match: LiveMatch = {
        matchId: String(serverMatchId ?? Date.now()),
        format,
        raceToHome: 3,
        raceToAway: 3,
        home: homePlayer,
        away: awayPlayer,
        currentRack: 1,
        racks: [],
        status: 'in_progress',
      };

      const { hydrateMatch, startRack, setServerMatchId } = useLiveScoringStore.getState();
      hydrateMatch(match);
      if (serverMatchId) setServerMatchId(serverMatchId);

      // breaker from coin toss picker
      startRack(1, breaker.playerId);
      nav.navigate(TABS.LIVE_SCORE as never);
    } finally {
      stopSubmitting();
    }
  };

  // winner roster to feed picker sheet
  const winnerSide: TeamSide | null = coinResult?.winner ?? null;
  const winnerRoster =
    winnerSide === 'Home' ? effectiveHomeRoster : winnerSide === 'Away' ? effectiveAwayRoster : [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="border-b border-slate-200 bg-white px-5 pb-3 pt-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="tennisball" size={20} color="#0f4c81" />
            <Text className="ml-2 text-lg font-semibold text-slate-900">Pre-Match Setup</Text>
          </View>
          <Ionicons name="help-circle-outline" size={22} color="#64748b" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Select teams */}
        <TeamSelectRow label="Home Team" value={homeTeam?.name} onSelect={(t) => setHomeTeam(t)} />
        <TeamSelectRow label="Away Team" value={awayTeam?.name} onSelect={(t) => setAwayTeam(t)} />
        {/* Game-1 quick chips under team rows */}
        {game1HomePlayerId ? (
          <PlayerChip
            label={`Game-1: ${
              effectiveHomeRoster.find((p) => p.id === game1HomePlayerId)?.name ?? 'Home Player'
            }${(() => {
              const sk = effectiveHomeRoster.find((p) => p.id === game1HomePlayerId)?.skill;
              return sk != null ? ` (Skill ${sk})` : '';
            })()}`}
          />
        ) : (
          <Text className="mt-2 text-xs text-slate-400">Pick Home Game-1 player</Text>
        )}

        {game1AwayPlayerId ? (
          <PlayerChip
            label={`Game-1: ${
              effectiveAwayRoster.find((p) => p.id === game1AwayPlayerId)?.name ?? 'Away Player'
            }${(() => {
              const sk = effectiveAwayRoster.find((p) => p.id === game1AwayPlayerId)?.skill;
              return sk != null ? ` (Skill ${sk})` : '';
            })()}`}
          />
        ) : (
          <Text className="mt-2 text-xs text-slate-400">Pick Away Game-1 player</Text>
        )}
        {/* Format */}
        <FormatPicker value={format} onChange={setFormat} />
        {/* Game 1 player picks */}
        <TeamRosterAccordion title="Home Team — pick Game 1 player" players={effectiveHomeRoster}>
          {/* You can keep Accordion; here’s a simple quick row */}
        </TeamRosterAccordion>
        <TeamRosterAccordion title="Away Team — pick Game 1 player" players={effectiveAwayRoster} />
        {/* Or simpler rows instead of full rosters: */}
        <View className="mb-3 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-xs text-slate-500">Home Player (Game 1)</Text>
          <Text
            className="mt-1 text-base font-semibold text-slate-800"
            onPress={() => {
              setBreakerSheetOpen(false);
              // reuse PlayerPickerModal for Home
              setCoinModalOpen(false);
              setShowHomePlayerPicker(true);
            }}>
            {game1HomePlayerId
              ? effectiveHomeRoster.find((p) => p.id === game1HomePlayerId)?.name
              : 'Choose player'}
          </Text>
        </View>
        <View className="mb-3 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-xs text-slate-500">Away Player (Game 1)</Text>
          <Text
            className="mt-1 text-base font-semibold text-slate-800"
            onPress={() => {
              setBreakerSheetOpen(false);
              setCoinModalOpen(false);
              setShowAwayPlayerPicker(true);
            }}>
            {game1AwayPlayerId
              ? effectiveAwayRoster.find((p) => p.id === game1AwayPlayerId)?.name
              : 'Choose player'}
          </Text>
        </View>
        {/* Coin toss */}

        <CoinTossButton
          label="Coin Toss"
          disabled={!game1HomePlayerId || !game1AwayPlayerId}
          helperWhenDisabled="Pick Game-1 players for both teams to flip the coin."
          onPress={() => setCoinModalOpen(true)}
        />
        {/* Rosters (effective ones) */}
        <TeamRosterAccordion
          title="Home Team Roster"
          players={effectiveHomeRoster.map((p) => ({
            ...p,
            skill: p.skill == null ? undefined : p.skill,
          }))}
        />
        <TeamRosterAccordion
          title="Away Team Roster"
          players={effectiveAwayRoster.map((p) => ({
            ...p,
            skill: p.skill == null ? undefined : p.skill,
          }))}
        />
        {/* Start */}
        <StartMatchBar
          canStart={canStart}
          reason={!canStart ? reason : undefined}
          onStart={onStartMatch}
        />
        <View className="h-6" />
      </ScrollView>

      {/* Coin toss modal */}
      <CoinTossModal
        visible={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        onResult={(result: CoinResult) => {
          setCoinResult(result);
          setCoinModalOpen(false);
          setBreakerSheetOpen(true);
        }}
      />

      {/* Breaker picker (winner roster) */}
      {/* Home player picker */}
      <PlayerPickerModal
        visible={showHomePlayerPicker}
        teamLabel="Home"
        players={effectiveHomeRoster}
        onClose={() => setShowHomePlayerPicker(false)}
        onSelect={(pid) => {
          setGame1HomePlayerId(pid);
          setShowHomePlayerPicker(false);
        }}
      />

      {/* Away player picker */}
      <PlayerPickerModal
        visible={showAwayPlayerPicker}
        teamLabel="Away"
        players={effectiveAwayRoster}
        onClose={() => setShowAwayPlayerPicker(false)}
        onSelect={(pid) => {
          setGame1AwayPlayerId(pid);
          setShowAwayPlayerPicker(false);
        }}
      />
    </SafeAreaView>
  );
}
