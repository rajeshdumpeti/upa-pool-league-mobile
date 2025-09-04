import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuthStore } from '~/stores/authStore';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { error, busy, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // src/bootstrap/AuthGate.tsx  (PATCH the return branches)

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-2 text-lg font-semibold text-red-600">Sign-in error</Text>
        <Text className="text-center text-zinc-600">
          {String((error as unknown as Error).message || error)}
        </Text>
      </View>
    );
  }

  if (busy) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
        <Text className="mt-3 text-zinc-600">Signing in…</Text>
      </View>
    );
  }

  return <>{children}</>;
}
