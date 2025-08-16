import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

type ScoreEvent =
  | { type: 'pot'; ball?: number; by: 'home' | 'away' }
  | { type: 'foul'; by: 'home' | 'away' }
  | { type: 'safety'; by: 'home' | 'away' }
  | { type: 'rack_end'; winner: 'home' | 'away' };

type Params = {
  LiveScoring: { matchId: string; meta?: { format?: string; coinToss?: string; tableNo?: string } };
};

export default function LiveScoringScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<RouteProp<Params, 'LiveScoring'>>();
  const { matchId, meta } = route.params || {};
  const [active, setActive] = useState<'home' | 'away'>(
    meta?.coinToss === 'Away' ? 'away' : 'home'
  );
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [events, setEvents] = useState<ScoreEvent[]>([]);

  const format = meta?.format ?? '8-ball';

  const headerSubtitle = useMemo(() => {
    const t = meta?.tableNo ? ` • Table ${meta.tableNo}` : '';
    return `${format}${t}`;
  }, [format, meta?.tableNo]);

  const addEvent = (evt: ScoreEvent) => {
    setEvents((prev) => [...prev, evt]);
    if (evt.type === 'pot') {
      // eslint-disable-next-line no-unused-expressions
      evt.by === 'home' ? setHomeScore((s) => s + 1) : setAwayScore((s) => s + 1);
    }
  };

  const undo = () => {
    setEvents((prev) => {
      if (!prev.length) return prev;
      const next = prev.slice(0, -1);
      const last = prev[prev.length - 1];
      if (last.type === 'pot') {
        // eslint-disable-next-line no-unused-expressions
        last.by === 'home'
          ? setHomeScore((s) => Math.max(0, s - 1))
          : setAwayScore((s) => Math.max(0, s - 1));
      }
      return next;
    });
  };

  const endRack = (winner: 'home' | 'away') => {
    setEvents((prev) => [...prev, { type: 'rack_end', winner }]);
    // later: navigate to Review screen or show a confirmation sheet
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      {/* Top bar */}
      <View className="border-b border-slate-200 bg-white px-5 pb-3 pt-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold text-slate-900">Live Scoring</Text>
            <Text className="mt-0.5 text-xs text-slate-500">{headerSubtitle}</Text>
          </View>
          <Pressable
            className="rounded-lg border border-slate-300 px-3 py-2"
            onPress={() => nav.goBack()}
            accessibilityLabel="Exit scoring">
            <Text className="text-xs text-slate-700">Exit</Text>
          </Pressable>
        </View>
      </View>

      {/* Players header card */}
      <View className="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <Pressable
            className={`mr-2 flex-1 rounded-xl border p-3 ${
              active === 'home' ? 'border-blue-900 bg-blue-900' : 'border-slate-300 bg-white'
            }`}
            onPress={() => setActive('home')}
            accessibilityLabel="Select Home player active">
            <Text className={`text-sm ${active === 'home' ? 'text-white' : 'text-slate-900'}`}>
              Home Player
            </Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons
                name="person-circle-outline"
                size={16}
                color={active === 'home' ? 'white' : '#334155'}
              />
              <Text
                className={`ml-1 text-xs ${active === 'home' ? 'text-white' : 'text-slate-500'}`}>
                At table
              </Text>
            </View>
          </Pressable>

          <Pressable
            className={`ml-2 flex-1 rounded-xl border p-3 ${
              active === 'away' ? 'border-blue-900 bg-blue-900' : 'border-slate-300 bg-white'
            }`}
            onPress={() => setActive('away')}
            accessibilityLabel="Select Away player active">
            <Text className={`text-sm ${active === 'away' ? 'text-white' : 'text-slate-900'}`}>
              Away Player
            </Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons
                name="person-circle-outline"
                size={16}
                color={active === 'away' ? 'white' : '#334155'}
              />
              <Text
                className={`ml-1 text-xs ${active === 'away' ? 'text-white' : 'text-slate-500'}`}>
                At table
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Score chips */}
        <View className="mt-4 flex-row items-center justify-center">
          <View className="mr-6 items-center">
            <Text className="text-xs text-slate-500">Home</Text>
            <Text className="text-3xl font-bold text-slate-900">{homeScore}</Text>
          </View>
          <Text className="text-slate-400">—</Text>
          <View className="ml-6 items-center">
            <Text className="text-xs text-slate-500">Away</Text>
            <Text className="text-3xl font-bold text-slate-900">{awayScore}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Big buttons row */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <View className="flex-row items-stretch">
            <Pressable
              className="mr-2 flex-1 items-center justify-center rounded-2xl bg-emerald-600 p-4"
              onPress={() => addEvent({ type: 'pot', by: active })}
              accessibilityLabel="Pocketed ball">
              <Ionicons name="ellipse" size={24} color="#fff" />
              <Text className="mt-1 font-semibold text-white">Ball</Text>
            </Pressable>

            <Pressable
              className="ml-2 flex-1 items-center justify-center rounded-2xl bg-rose-600 p-4"
              onPress={() => addEvent({ type: 'foul', by: active })}
              accessibilityLabel="Foul">
              <Ionicons name="alert-circle" size={24} color="#fff" />
              <Text className="mt-1 font-semibold text-white">Foul</Text>
            </Pressable>
          </View>

          <View className="mt-3 flex-row items-stretch">
            <Pressable
              className="mr-2 flex-1 items-center justify-center rounded-2xl bg-amber-500 p-4"
              onPress={() => addEvent({ type: 'safety', by: active })}
              accessibilityLabel="Safety">
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
              <Text className="mt-1 font-semibold text-white">Safety</Text>
            </Pressable>

            <Pressable
              className="ml-2 flex-1 items-center justify-center rounded-2xl bg-indigo-600 p-4"
              onPress={() => setActive((s) => (s === 'home' ? 'away' : 'home'))}
              accessibilityLabel="Change turn">
              <Ionicons name="swap-horizontal" size={24} color="#fff" />
              <Text className="mt-1 font-semibold text-white">Change</Text>
            </Pressable>
          </View>
        </View>

        {/* Event timeline (lightweight preview) */}
        <View className="rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-2 font-semibold text-slate-900">This Rack</Text>
          {events.length === 0 ? (
            <Text className="text-sm text-slate-500">No events yet. Start recording the rack.</Text>
          ) : (
            events.map((e, idx) => (
              <View key={`${idx}-${e.type}`} className="flex-row items-center py-1.5">
                <Ionicons
                  name={
                    e.type === 'pot'
                      ? 'ellipse'
                      : e.type === 'foul'
                        ? 'alert-circle'
                        : e.type === 'safety'
                          ? 'shield-checkmark'
                          : 'checkmark-circle'
                  }
                  size={16}
                  color={
                    e.type === 'foul' ? '#dc2626' : e.type === 'safety' ? '#f59e0b' : '#0f4c81'
                  }
                />
                <Text className="ml-2 text-sm text-slate-700">
                  {e.type === 'pot' && `${e.by.toUpperCase()} pocketed a ball`}
                  {e.type === 'foul' && `${e.by.toUpperCase()} committed a foul`}
                  {e.type === 'safety' && `${e.by.toUpperCase()} played a safety`}
                  {e.type === 'rack_end' && `${e.winner.toUpperCase()} won the rack`}
                </Text>
              </View>
            ))
          )}
        </View>
        <View className="h-24" />
      </ScrollView>

      {/* Bottom action bar */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 py-3">
        <View className="flex-row items-center">
          <Pressable
            onPress={undo}
            className={`mr-2 flex-row items-center rounded-xl border border-slate-300 px-4 py-3`}
            accessibilityLabel="Undo last">
            <Ionicons name="arrow-undo-outline" size={18} color="#334155" />
            <Text className="ml-2 font-medium text-slate-800">Undo</Text>
          </Pressable>

          <Pressable
            onPress={() => endRack('home')}
            className="mr-2 flex-1 items-center rounded-xl bg-blue-900 px-4 py-3"
            accessibilityLabel="End rack home">
            <Text className="font-bold text-white">End Rack – Home</Text>
          </Pressable>

          <Pressable
            onPress={() => endRack('away')}
            className="flex-1 items-center rounded-xl bg-blue-900 px-4 py-3"
            accessibilityLabel="End rack away">
            <Text className="font-bold text-white">End Rack – Away</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
