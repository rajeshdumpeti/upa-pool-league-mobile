import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { GameFormat } from '../models/prematch';
import { Ionicons } from '@expo/vector-icons';

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
      <View className="mb-3 flex-row items-center">
        <Ionicons name="grid-outline" size={18} color="#0f4c81" />
        <Text className="ml-2 font-semibold text-slate-900">Game Format</Text>
      </View>{' '}
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
                height: 56,
                borderColor: active ? '#0f4c81' : '#cbd5e1',
                backgroundColor: active ? '#0f4c81' : '#fff',
              }}>
              <Text
                className="text-sm font-semibold"
                style={{ color: active ? '#fff' : '#0f172a' }}>
                {f.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text className="mt-2 text-xs text-slate-500">
        You can change the format until scoring starts.
      </Text>
    </View>
  );
}
