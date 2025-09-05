import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { GameFormat } from '../models/prematch';

type Props = {
  value: '8-ball' | '9-ball' | '10-ball';
  onChange: (v: Props['value']) => void;
};

const FORMATS: Props['value'][] = ['8-ball', '9-ball', '10-ball'];

export default function FormatPicker({
  value,
  onChange,
}: {
  value: GameFormat;
  onChange: (f: GameFormat) => void;
}) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
      <Text className="mb-3 font-semibold text-slate-900">Game Format</Text>
      <View className="flex-row gap-3">
        {FORMATS.map((f) => {
          const active = f === value;
          return (
            <Pressable
              key={f}
              onPress={() => onChange(f)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${f}`}
              className={`flex-1 items-center justify-center rounded-2xl border ${
                active ? 'border-blue-700 bg-blue-600' : 'border-slate-200 bg-slate-50'
              }`}
              style={{
                // force a “square card” look; keeps a single row on small phones
                aspectRatio: 0.9,
                shadowOpacity: active ? 0.25 : 0.08,
                shadowRadius: active ? 7 : 5,
                shadowOffset: { width: 0, height: 3 },
                elevation: active ? 4 : 1,
              }}>
              <Text
                className={`text-base font-semibold ${active ? 'text-white' : 'text-slate-800'}`}>
                {f}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
