import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function ScoringScreen() {
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');

  const handleSubmit = () => {
    // Placeholder - later we will call the API mutation
    Alert.alert('Submitted', `Team 1: ${team1Score} | Team 2: ${team2Score}`);
  };

  return (
    <View className="p-4">
      <Text className="mb-4 text-lg font-bold">Enter Scores</Text>

      <Text className="mb-2">Team 1 Score</Text>
      <TextInput
        className="mb-4 rounded border border-gray-300 p-2"
        keyboardType="numeric"
        value={team1Score}
        onChangeText={setTeam1Score}
      />

      <Text className="mb-2">Team 2 Score</Text>
      <TextInput
        className="mb-4 rounded border border-gray-300 p-2"
        keyboardType="numeric"
        value={team2Score}
        onChangeText={setTeam2Score}
      />

      <Button title="Submit Score" onPress={handleSubmit} />
    </View>
  );
}
