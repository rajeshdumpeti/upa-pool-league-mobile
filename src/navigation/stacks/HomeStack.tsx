import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '~/features/home/HomeScreen';
import StatusScreen from '~/features/home/StatusScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  Status: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Status" component={StatusScreen} options={{ title: 'Status' }} />
    </Stack.Navigator>
  );
}
