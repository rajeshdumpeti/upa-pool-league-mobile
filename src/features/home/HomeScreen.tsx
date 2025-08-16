import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { pingLive } from '../../api/health';

export default function HomeScreen() {
  const [result, setResult] = useState<string>('—');

  const onPing = async () => {
    try {
      const data = await pingLive();
      setResult(JSON.stringify(data));
    } catch (e: any) {
      setResult(`Error: ${e?.message ?? 'unknown'}`);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Home</Text>
      <Button title="Ping Backend" onPress={onPing} />
      <Text style={{ marginTop: 16 }}>{result}</Text>
    </View>
  );
}
