import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '~/navigation/stacks/HomeStack';
import { TouchableOpacity, Text, View } from 'react-native';
import { useAuthStore } from '~/stores/authStore';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export default function HomeScreen() {
  const { signOut } = useAuthStore();
  const navigation = useNavigation<Nav>();

  return (
    <View className="px-5 py-4">
      {/* your existing Home content */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Status')}
        className="mt-4 rounded-xl bg-blue-600 px-4 py-3">
        <Text className="text-center font-semibold text-white">Open Status</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={signOut} className="mt-4 rounded-xl bg-red-600 px-4 py-3">
        <Text className="text-center font-semibold text-white">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
