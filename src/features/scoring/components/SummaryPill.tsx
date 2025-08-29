// src/components/SummaryPill.tsx
// -----------------------------------------------------------------------------
// Purpose: Small presentational pill used in "Rack Summary". Reusable elsewhere.
// -----------------------------------------------------------------------------

import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '~/config/theme';

type Props = {
  label: string;
  value: number;
  className?: string;
};

export function SummaryPill({ label, value, className = '' }: Props) {
  return (
    <View
      className={['rounded-xl px-3 py-1', className].join(' ')}
      style={{ backgroundColor: theme.colors.surface.background }}>
      <Text className="font-medium text-zinc-700">
        {label}: <Text className="font-semibold">{value}</Text>
      </Text>
    </View>
  );
}
