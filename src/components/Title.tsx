import React from 'react';
import { Text, TextProps } from 'react-native';
import { theme } from '~/config/theme';

export function Title(props: TextProps) {
  return <Text {...props} style={[theme.typography.h2, props.style]} />;
}
