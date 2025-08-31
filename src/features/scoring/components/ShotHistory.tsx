// src/features/scoring/components/ShotHistory.tsx
// -----------------------------------------------------------------------------
// Purpose: Compact per-rack shot history for the Live Score “History” card.
// - Groups shots by rackNumber
// - Shows who won the rack and the sequence of shots as small chips
// - Pure presentational; no store access
// -----------------------------------------------------------------------------

import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import type { Shot } from '~/stores/liveScoringStore';
import type { LiveMatch } from '../types';
import { theme } from '~/config/theme';

type Props = {
  match: LiveMatch;
  shots: Shot[]; // entire shots array from store (we’ll group by rack)
};

type Grouped = Record<number, Shot[]>;

export default function ShotHistory({ match, shots }: Props) {
  // group shots by rackNumber
  const byRack: Grouped = useMemo(() => {
    const map: Grouped = {};
    for (const s of shots) {
      (map[s.rackNumber] ||= []).push(s);
    }
    // keep chronological within each rack
    Object.values(map).forEach((list) => list.sort((a, b) => a.ts - b.ts));
    return map;
  }, [shots]);

  // quick helpers
  const nameFor = (playerId: number) =>
    playerId === match.home.id ? match.home.name : match.away.name;

  const chipBg = theme.colors.surface.background;
  const chipText = theme.colors.text.primary;
  const chipBorder = theme.colors.surface.border;

  return (
    <View>
      {match.racks.map((r) => {
        const seq = byRack[r.rackNumber] || [];
        return (
          <View key={r.id} className="mt-3">
            {/* Row header: Rack N — Winner */}
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-zinc-700">Rack {r.rackNumber}</Text>
              <Text className="text-zinc-600">Winner: {nameFor(r.winnerPlayerId)}</Text>
            </View>

            {/* Shots line */}
            {seq.length > 0 ? (
              <View className="flex-row flex-wrap">
                {seq.map((s, i) => {
                  const side = s.playerId === match.home.id ? 'H' : 'A';
                  return (
                    <View
                      key={s.id}
                      className="mb-2 mr-2 rounded-full px-2 py-1"
                      style={{ backgroundColor: chipBg, borderColor: chipBorder, borderWidth: 1 }}>
                      <Text className="text-[12px] font-medium" style={{ color: chipText }}>
                        {i + 1}. {side}:{s.symbol}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text className="text-[12px] text-zinc-400">No shots recorded for this rack.</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
