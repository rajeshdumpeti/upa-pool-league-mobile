// src/features/HomeScreen.tsx
import { View, Text, FlatList, Button } from 'react-native';
import { useMatchStore } from '../stores/matchStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuthStore from '../stores/useAuthStore'; // 1. Import the auth store

// Define your stack param list
type RootStackParamList = {
  Home: undefined;
  Scoring: undefined;
  // add other routes here if needed
};

export default function HomeScreen() {
  const { matches } = useMatchStore();
  const logoutAction = useAuthStore((state) => state.logout); // 2. Get the logout action
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 items-center justify-center bg-white pt-12">
      <Text className="mb-4 text-2xl font-bold">Matches</Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="w-full border-b border-red-800 p-2">
            <Text className="text-lg">{item.name}</Text>
            <Text className="text-sm text-gray-500">
              {item.team1Score ?? '-'} : {item.team2Score ?? '-'}
            </Text>
          </View>
        )}
      />
      <View className="mb-4">
        <Button title="Go to Scoring" onPress={() => navigation.navigate('Scoring')} />
      </View>
      {/* 3. Add the logout button */}
      <View className="mt-4">
        <Button title="Log Out" onPress={logoutAction} color="red" />
      </View>
    </View>
  );
}
