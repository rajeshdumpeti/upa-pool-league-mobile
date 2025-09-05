// src/features/prematch/PreMatchScreen.tsx
import React from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { usePreMatchState } from './hooks/usePreMatchState';

// UI building blocks (all default-exports you already added)
import FormatPicker from './components/FormatPicker';
import CoinTossButton from './components/CoinTossButton';
import CoinTossModal from './components/CoinTossModal';
import PlayerPickerModal from './components/PlayerPickerModal';
import TeamRosterAccordion from './components/TeamRosterAccordion';
import StartMatchBar from './components/StartMatchBar';

// Live scoring + backend
import { useLiveScoringStore } from '~/stores/liveScoringStore';
import { TABS } from '~/navigation/routes';
import { createMatch } from '~/api/matches';
import type { LiveMatch } from '../scoring/types';

// If your hook exports explicit types you can import them;
// keeping simple “any” here avoids compile coupling.
type TeamSide = 'Home' | 'Away';

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

    // rosters
    homeRoster,
    awayRoster,

    // submit flags
    submitting,
    startSubmitting,
    stopSubmitting,
  } = usePreMatchState();

  const canStart = !!breaker?.playerId;

  const onStartMatch = async () => {
    if (!breaker?.playerId) return;

    startSubmitting();
    try {
      const homePlayer = homeRoster[0]
        ? { ...homeRoster[0], skill: homeRoster[0].skill ?? 5 }
        : { id: 1, name: 'Home Player', skill: 5 };
      const awayPlayer = awayRoster[0]
        ? { ...awayRoster[0], skill: awayRoster[0].skill ?? 4 }
        : { id: 2, name: 'Away Player', skill: 4 };

      // Create match on server (P0 stub still fine)
      let serverMatchId: number | undefined;
      try {
        const created = await createMatch({
          format,
          home_team: { id: 101, name: 'Home Team' },
          away_team: { id: 202, name: 'Away Team' },
          home_lineup: [{ order: 1, player: homePlayer }],
          away_lineup: [{ order: 1, player: awayPlayer }],
          coin_toss_winner_team_id: coinResult?.winner === 'Home' ? 101 : 202,
        });
        serverMatchId = created.id;
      } catch (err) {
        console.warn('[PreMatch] createMatch failed, proceeding offline', err);
      }

      // Hydrate live match for scoring
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

      startRack(1, breaker.playerId);
      nav.navigate(TABS.LIVE_SCORE as never);
    } finally {
      stopSubmitting();
    }
  };

  // winner roster to feed picker sheet
  const winnerSide: TeamSide | null = coinResult?.winner ?? null;
  const winnerRoster = winnerSide === 'Home' ? homeRoster : winnerSide === 'Away' ? awayRoster : [];

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
        {/* 1) Format (fills the row with big segmented buttons) */}
        <FormatPicker value={format} onChange={setFormat} />

        {/* 2) Coin toss launcher with current selection preview */}
        <CoinTossButton label="Coin Toss" onPress={() => setCoinModalOpen(true)} />

        {/* 3) Rosters below as accordions */}
        <TeamRosterAccordion title="Home Team Roster" players={homeRoster} />
        <TeamRosterAccordion title="Away Team Roster" players={awayRoster} />

        {/* 4) Footer: Start Match */}
        <StartMatchBar
          canStart={canStart}
          onStart={() => {
            onStartMatch();
          }}
        />

        <View className="h-6" />
      </ScrollView>

      {/* Coin toss modal (animated) */}
      <CoinTossModal
        visible={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        onResult={(result) => {
          if (typeof result === 'string') {
            // If result is a string, convert it to the expected object shape
            setCoinResult({ face: result as 'Heads' | 'Tails', winner: 'Home' }); // Replace 'Home' with logic if needed
          } else {
            setCoinResult(result); // { face: 'Heads'|'Tails', winner: 'Home'|'Away' }
          }
          setCoinModalOpen(false);
          setBreakerSheetOpen(true); // immediately pick the breaker from winning team
        }}
      />

      {/* Breaker picker sheet (from bottom) */}
      <PlayerPickerModal
        visible={breakerSheetOpen}
        teamLabel={winnerSide ?? 'Home'}
        players={winnerRoster}
        onClose={() => setBreakerSheetOpen(false)}
        onSelect={(playerId: number) => {
          if (winnerSide) {
            const selectedPlayer = winnerRoster.find((p: any) => p.id === playerId);
            if (selectedPlayer) {
              setBreaker({ team: winnerSide, playerId, playerName: selectedPlayer.name });
            }
          }
          setBreakerSheetOpen(false);
        }}
      />
    </SafeAreaView>
  );
}
