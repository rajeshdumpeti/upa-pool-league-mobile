import React from 'react';
import { Alert, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useAuthStore } from '~/stores/authStore';
import { theme } from '~/config/theme';

function initialsFromEmail(email?: string | null) {
  if (!email) return 'U';
  const base = email.split('@')[0] || 'user';
  const parts = base
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(' ');
  const a = parts[0]?.[0] ?? 'U';
  const b = parts[1]?.[0] ?? '';
  return (a + b).toUpperCase();
}

export default function AccountScreen() {
  const email = useAuthStore((s) => s.user?.email ?? 'unknown');
  const signOut = useAuthStore((s) => s.signOut);

  const onSignOut = () =>
    Alert.alert('Sign out?', 'You will be returned to the sign-in screen.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.surface.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header / avatar */}
        <View className="items-center">
          <View
            className="h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.colors.brand.accent }}>
            <Text className="text-xl font-semibold" style={{ color: '#fff' }}>
              {initialsFromEmail(email)}
            </Text>
          </View>

          <Text className="mt-3 text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
            {email}
          </Text>
          <Text className="text-sm" style={{ color: theme.colors.text.muted }}>
            Signed in to UPA Pool League
          </Text>
        </View>

        {/* Card */}
        <View
          className="mt-6 rounded-2xl border p-4"
          style={{
            backgroundColor: theme.colors.surface.card,
            borderColor: theme.colors.surface.border,
          }}>
          <Text className="text-sm" style={{ color: theme.colors.text.muted }}>
            App version
          </Text>
          <Text className="mt-0.5 font-medium" style={{ color: theme.colors.text.primary }}>
            {Constants.expoConfig?.version ?? 'dev'}
          </Text>
        </View>

        {/* Sign out */}
        <TouchableOpacity
          className="mt-8 h-12 items-center justify-center rounded-2xl"
          onPress={onSignOut}
          style={{ backgroundColor: theme.colors.brand.accent }}>
          <Text className="font-semibold" style={{ color: '#fff' }}>
            Sign out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
