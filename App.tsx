import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { useMatchStore } from './src/stores/matchStore';
import './global.css';

const queryClient = new QueryClient();

export default function App() {
  const setMatches = useMatchStore((state) => state.setMatches);

  useEffect(() => {
    // Mock Data
    setMatches([
      { id: '1', name: 'Team A vs Team B' },
      { id: '2', name: 'Team C vs Team D' },
     
    ]);
  }, [setMatches]);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
