import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TeamPickerModal from './TeamPickerModal';
import type { TeamOut } from '~/api/teams';

export default function TeamSelectRow({
  label,
  value,
  onSelect,
}: {
  label: string;
  value?: string;
  onSelect: (t: TeamOut) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="mb-3 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
        accessibilityRole="button"
        accessibilityLabel={`Select ${label}`}>
        <View>
          <Text className="text-xs text-slate-500">{label}</Text>
          <Text className="mt-0.5 text-base font-semibold text-slate-800">
            {value || 'select team'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#64748b" />
      </Pressable>

      <TeamPickerModal
        visible={open}
        onClose={() => setOpen(false)}
        onPick={onSelect}
        title={label}
      />
    </>
  );
}
