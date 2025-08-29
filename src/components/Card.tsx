import React from 'react';
import { View, ViewProps, Platform } from 'react-native';
import { theme } from '~/config/theme';

export function Card({ style, ...props }: ViewProps) {
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: theme.colors.surface.card,
          borderRadius: theme.radii.xl,
          borderWidth: 1,
          borderColor: theme.colors.surface.border,
          padding: theme.spacing.lg,
          ...(Platform.OS === 'ios' ? theme.shadows.card.ios : theme.shadows.card.android),
        },
        style,
      ]}
    />
  );
}
