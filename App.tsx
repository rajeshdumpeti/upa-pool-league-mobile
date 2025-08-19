// App.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css';
import { theme as appTheme } from './src/config/theme';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/config/query';
// ⬇️ Use one of the two import lines explained above
import { StorageGate } from './src/bootstrap/StorageGate';

export default function App() {
  const navTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: appTheme.colors.surface.background, // global screen bg
    },
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StorageGate>
            <NavigationContainer theme={navTheme}>
              <AppNavigator />
              <StatusBar style="light" />
            </NavigationContainer>
          </StorageGate>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
