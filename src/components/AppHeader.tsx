import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppHeader() {
  return (
    <SafeAreaView className="bg-[#003366]">
      <View className="items-center justify-center">
        <Text className="text-xl font-extrabold text-white">🎱 UPA Pool League</Text>
      </View>
      {/* Add optional right icon later (settings/notification) */}
    </SafeAreaView>
  );
}
