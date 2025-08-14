// src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';
import AppStack from './AppStack';
import LoginScreen from '../features/LoginScreen';

export default function RootNavigator() {
  const { isAuthenticated, hydrate } = useAuthStore();

  useEffect(() => {
    // Check if a token is stored on the device when the app starts
    hydrate();
  }, [hydrate]);

  // Conditionally render the correct navigator
  return isAuthenticated ? <AppStack /> : <LoginScreen />;
}
