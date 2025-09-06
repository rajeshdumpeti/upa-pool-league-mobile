// src/features/prematch/PreMatchScreen.tsx
import React from 'react';
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
import TeamPickerModal from './components/TeamPickerModal';

// Data hooks (you said these already exist)
import { useMyTeams, useTeamRoster } from './hooks/useTeams';

// Live scoring + backend
import { useLiveScoringStore } from '~/stores/liveScoringStore';
import { TABS } from '~/navigation/routes';
import { createMatch } from '~/api/matches';
import type { LiveMatch } from '../scoring/types';

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
  const [homeTeamId, setHomeTeamId] = React.useState<number | null>(null);
  const [awayTeamId, setAwayTeamId] = React.useState<number | null>(null);
  const [homePickerOpen, setHomePickerOpen] = React.useState(false);
  const [awayPickerOpen, setAwayPickerOpen] = React.useState(false);

  // Teams & rosters from server
  const { data: myTeams = [] } = useMyTeams();
  const { data: homeRosterSrv = [] } = useTeamRoster(homeTeamId ?? undefined);
  const { data: awayRosterSrv = [] } = useTeamRoster(awayTeamId ?? undefined);

  // Effective rosters fed into UI
  const effectiveHomeRoster = (homeRosterSrv?.length ? homeRosterSrv : homeRoster) ?? [];
  const effectiveAwayRoster = (awayRosterSrv?.length ? awayRosterSrv : awayRoster) ?? [];

  const canStart = !!coinResult && !!breaker?.playerId;

  const onStartMatch = async () => {
    if (!breaker?.playerId) return;

    startSubmitting();
    try {
      const homeTeamName = myTeams.find((t) => t.id === homeTeamId)?.name ?? 'Home Team';
      const awayTeamName = myTeams.find((t) => t.id === awayTeamId)?.name ?? 'Away Team';

      // pick first player from each roster as the currently selected participants
      const homePlayerRaw = effectiveHomeRoster[0] ?? { id: 1, name: 'Home Player', skill: 5 };
      const awayPlayerRaw = effectiveAwayRoster[0] ?? { id: 2, name: 'Away Player', skill: 4 };

      const homePlayer = {
        ...homePlayerRaw,
        skill:
          typeof homePlayerRaw.skill === 'number' && homePlayerRaw.skill != null
            ? homePlayerRaw.skill
            : 5,
      };
      const awayPlayer = {
        ...awayPlayerRaw,
        skill:
          typeof awayPlayerRaw.skill === 'number' && awayPlayerRaw.skill != null
            ? awayPlayerRaw.skill
            : 4,
      };

      // Server create (stub OK)
      let serverMatchId: number | undefined;
      try {
        const created = await createMatch({
          format,
          home_team: { id: homeTeamId ?? 101, name: homeTeamName },
          away_team: { id: awayTeamId ?? 202, name: awayTeamName },
          home_lineup: [{ order: 1, player: homePlayer }],
          away_lineup: [{ order: 1, player: awayPlayer }],
          coin_toss_winner_team_id:
            coinResult?.winner === 'Home' ? (homeTeamId ?? 101) : (awayTeamId ?? 202),
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
        <TeamSelectRow
          label="Home Team"
          value={myTeams.find((t) => t.id === homeTeamId)?.name}
          onPress={() => setHomePickerOpen(true)}
        />
        <TeamSelectRow
          label="Away Team"
          value={myTeams.find((t) => t.id === awayTeamId)?.name}
          onPress={() => setAwayPickerOpen(true)}
        />

        {/* Format */}
        <FormatPicker value={format} onChange={setFormat} />

        {/* Coin toss */}
        <CoinTossButton label="Coin Toss" onPress={() => setCoinModalOpen(true)} />

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
          onStart={() => {
            onStartMatch();
          }}
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
      <PlayerPickerModal
        visible={breakerSheetOpen}
        teamLabel={winnerSide ?? 'Home'}
        players={winnerRoster}
        onClose={() => setBreakerSheetOpen(false)}
        onSelect={(playerId: number) => {
          if (winnerSide) {
            const selected = winnerRoster.find((p) => p.id === playerId);
            if (selected)
              setBreaker({
                team: winnerSide,
                playerId,
                playerName: selected.name,
              });
          }
          setBreakerSheetOpen(false);
        }}
      />

      {/* Team pickers */}
      <TeamPickerModal
        visible={homePickerOpen}
        title="Select Home Team"
        teams={myTeams}
        onClose={() => setHomePickerOpen(false)}
        onSelect={(team) => {
          setHomeTeamId(team.id);
          setHomePickerOpen(false);
        }}
      />
      <TeamPickerModal
        visible={awayPickerOpen}
        title="Select Away Team"
        teams={myTeams}
        onClose={() => setAwayPickerOpen(false)}
        onSelect={(team) => {
          setAwayTeamId(team.id);
          setAwayPickerOpen(false);
        }}
      />
    </SafeAreaView>
  );
}
