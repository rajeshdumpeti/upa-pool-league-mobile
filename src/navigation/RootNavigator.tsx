// src/navigation/RootNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';

// Global Header
import AppHeader from '../components/AppHeader';

// Screens
import Home from '../features/home/HomeScreen';
import PreMatchScreen from '../features/scoring/PreMatchScreen';
import LiveScoringScreen from '../features/scoring/LiveScoringScreen';
import PostMatchReview from '../features/scoring/PostMatchReview';
import ScoringScreen from '../features/scoring/ScoringScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff', // icons white
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)', // dimmed white
        tabBarStyle: {
          backgroundColor: '#003366', // same as header
          borderTopWidth: 0, // clean, no divider line
          height: 70, // extra touch area (Apple style)
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'PreMatch') iconName = 'timer-outline';
          else if (route.name === 'LiveScore') iconName = 'pulse-outline';
          else if (route.name === 'PostMatch') iconName = 'clipboard-outline';
          else if (route.name === 'Score') iconName = 'stats-chart-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="PreMatch" component={PreMatchScreen} />
      <Tab.Screen name="LiveScore" component={LiveScoringScreen} />
      <Tab.Screen name="PostMatch" component={PostMatchReview} />
      <Tab.Screen name="Score" component={ScoringScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <AppHeader />, // Global header above all tabs
      }}>
      <Stack.Screen name="Main" component={BottomTabs} />
    </Stack.Navigator>
  );
}
