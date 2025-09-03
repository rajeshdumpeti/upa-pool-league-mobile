// src/features/scoring/components/RackHistoryItem.tsx
// -----------------------------------------------------------------------------
// RackHistoryItem
// - Compact row for a rack; tap to expand.
// - Auto-expands only the most recently finished rack.
// - Shot lines are monospace and compact (em-dash when empty).
// - Pure UI. No store writes.
// -----------------------------------------------------------------------------

import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import type { LiveMatch } from '~/features/scoring/types';
import type { Shot } from '~/stores/liveScoringStore';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '~/config/theme';

type Props = {
  rack: LiveMatch['racks'][number];
  home: LiveMatch['home'];
  away: LiveMatch['away'];
  /** Pass true for the latest rack so it starts open; others stay collapsed */
  defaultOpen?: boolean;
};

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'System' });
const DASH = '—';

function sortByTime(shots?: Shot[]) {
  return (shots ? [...shots] : []).sort((a, b) => a.ts - b.ts);
}

function lineFor(shots: Shot[] | undefined, playerId: number) {
  if (!shots?.length) return '';
  return sortByTime(shots)
    .filter((s) => s.playerId === playerId)
    .map((s) => s.symbol)
    .join(' ');
}

export default function RackHistoryItem({ rack, home, away, defaultOpen }: Props) {
  const [open, setOpen] = useState(!!defaultOpen);

  const winnerName = rack.winnerPlayerId === home.id ? home.name : away.name;

  const { homeLine, awayLine } = useMemo(
    () => ({
      homeLine: lineFor(rack.shots, home.id),
      awayLine: lineFor(rack.shots, away.id),
    }),
    [rack.shots, home.id, away.id]
  );

  return (
    <View
      className="mt-3 rounded-2xl border"
      style={{
        borderColor: theme.colors.surface.border,
        backgroundColor: theme.colors.surface.card,
      }}
      accessibilityRole="button"
      accessibilityLabel={`Rack ${rack.rackNumber}, winner ${winnerName}, ${open ? 'expanded' : 'collapsed'}`}>
      {/* Header – bigger tap target */}
      <Pressable
        onPress={() => setOpen((v) => !v)}
        className="flex-row items-center justify-between px-4 py-3" // bigger padding
      >
        <Text className="font-medium" style={{ color: theme.colors.text.primary }}>
          Rack {rack.rackNumber}
        </Text>
        <View className="flex-row items-center">
          <Text className="mr-2 text-sm" style={{ color: theme.colors.text.muted }}>
            Winner: {winnerName}
          </Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={theme.colors.text.muted}
          />
        </View>
      </Pressable>

      {open && (
        <View className="border-t px-4 py-3" style={{ borderColor: theme.colors.surface.border }}>
          {/* Home line */}
          <Text className="text-xs" style={{ color: theme.colors.text.muted }}>
            {home.name}:
            <Text className="ml-1" style={{ color: theme.colors.text.primary, fontFamily: MONO }}>
              {homeLine || DASH}
            </Text>
          </Text>

          {/* Away line */}
          <Text className="mt-1 text-xs" style={{ color: theme.colors.text.muted }}>
            {away.name}:
            <Text className="ml-1" style={{ color: theme.colors.text.primary, fontFamily: MONO }}>
              {awayLine || DASH}
            </Text>
          </Text>

          {/* Footer stats */}
          <View className="mt-2 flex-row flex-wrap gap-x-4">
            <Text className="text-xs" style={{ color: theme.colors.text.muted }}>
              Innings: <Text style={{ color: theme.colors.text.primary }}>{rack.innings ?? 0}</Text>
            </Text>
            <Text className="text-xs" style={{ color: theme.colors.text.muted }}>
              Safeties:{' '}
              <Text style={{ color: theme.colors.text.primary }}>{rack.defensiveShots ?? 0}</Text>
            </Text>
            <Text className="text-xs" style={{ color: theme.colors.text.muted }}>
              Timeouts:{' '}
              <Text style={{ color: theme.colors.text.primary }}>{rack.timeouts ?? 0}</Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
