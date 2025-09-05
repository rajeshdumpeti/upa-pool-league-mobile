import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { GameFormat } from '../models/prematch';
import { theme } from '~/config/theme';

const FORMATS: GameFormat[] = ['8-ball', '9-ball', '10-ball'];

export default function FormatPicker({
  value,
  onChange,
}: {
  value: GameFormat;
  onChange: (f: GameFormat) => void;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-base font-semibold text-zinc-800">Game Format</Text>
      {FORMATS.map((f) => {
        const active = value === f;
        return (
          <Pressable
            key={f}
            onPress={() => onChange(f)}
            className="mb-3 h-12 w-full items-center justify-center rounded-2xl"
            style={{
              backgroundColor: active ? theme.colors.brand.accent : theme.colors.surface.background,
              borderWidth: 1,
              borderColor: active ? theme.colors.brand.accent : theme.colors.surface.border,
            }}
            accessibilityRole="button"
            accessibilityLabel={`Select ${f}`}>
            <Text style={{ color: active ? '#fff' : theme.colors.text.primary, fontWeight: '600' }}>
              {f}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
