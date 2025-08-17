// src/features/home/StatusScreen.tsx
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ENV } from '../../config/env';
import { Card } from '../../components/Card';
import { Title } from '../../components/Title';
import { theme } from '../../config/theme';
import { useHealth } from '../../hooks/useHealth';

export default function StatusScreen() {
  const { data: health, isLoading, isError, refetch } = useHealth();

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
      {/* Environment */}
      <Card className="mx-5 mt-5">
        <Title>Environment</Title>
        <View className="mt-3 space-y-2">
          <Row label="Channel" value={ENV.channel} />
          <Row label="API Base" value={ENV.apiBase} mono />
          <Row label="CMS Base" value={ENV.cmsBase} mono />
        </View>
      </Card>

      {/* Health */}
      <Card className="mx-5 mt-4">
        <View className="flex-row items-center justify-between">
          <Title>Backend Health</Title>
          <TouchableOpacity
            onPress={() => refetch()}
            className="rounded-full bg-blue-50 px-3 py-1.5">
            <Text className="font-medium text-blue-600">Refresh</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3">
          {isLoading ? (
            <View className="items-center py-6">
              <ActivityIndicator />
            </View>
          ) : isError ? (
            <Badge tone="red" text="Unable to reach API" />
          ) : health ? (
            <View className="space-y-2">
              <Row label="ok" value={String(health.ok)} />
              <Row label="service" value={health.service} />
              <Row label="check" value={health.check} />
              <Badge tone="green" text="Reachable" />
            </View>
          ) : (
            <Badge tone="amber" text="No data" />
          )}
        </View>
      </Card>
    </ScrollView>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <View className="mt-1 flex-row items-start justify-between">
      <Text className="text-slate-500">{label}</Text>
      <Text
        className={`${mono ? 'font-mono' : 'font-medium'} ml-3 flex-1 text-right text-slate-900`}>
        {value}
      </Text>
    </View>
  );
}

function Badge({ tone, text }: { tone: 'green' | 'red' | 'amber'; text: string }) {
  const toneMap: Record<'green' | 'red' | 'amber', string> = {
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <View className={`mt-2 rounded-full border px-3 py-1 ${toneMap[tone]}`}>
      <Text className="text-sm">{text}</Text>
    </View>
  );
}
