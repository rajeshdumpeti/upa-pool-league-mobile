// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '~/config/theme';
// Global Header
import AppHeader from '~/components/AppHeader';

// Screens
import PreMatchScreen from '~/features/scoring/PreMatchScreen';
import LiveScoringScreen from '~/features/scoring/LiveScoringScreen';
import PostMatchReview from '~/features/scoring/PostMatchReview';
import ScoringScreen from '~/features/scoring/ScoringScreen';
import HomeStack from './stacks/HomeStack';
import { Ionicons } from '@expo/vector-icons';
import { tabIcons } from './tab-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = tabIcons[route.name] || 'ellipse';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        // screen backgrounds
        // sceneContainerStyle: { backgroundColor: theme.colors.surface.background },
        // tab bar
        tabBarStyle: {
          backgroundColor: theme.colors.surface.card,
          borderTopColor: theme.colors.surface.border,
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: theme.colors.brand.accent,
        tabBarInactiveTintColor: theme.colors.text.muted,
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="PreMatch" component={PreMatchScreen} />
      <Tab.Screen name="LiveScore" component={LiveScoringScreen} />
      <Tab.Screen name="PostMatch" component={PostMatchReview} />
      <Tab.Screen name="Score" component={ScoringScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <AppHeader />, // Global header above all tabs
      }}>
      <Stack.Screen name="Main" component={BottomTabs} />
    </Stack.Navigator>
  );
}
