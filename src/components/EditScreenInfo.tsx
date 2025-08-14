import { Text, View } from 'react-native';

export const EditScreenInfo = () => {
  const title = 'UPA POOL LEAGUE APP';
  const description =
    'Welcome to the UPA Pool League app! This app is designed to help you manage your pool league activities, view schedules, and track scores.';

  return (
    <View>
      <View className="mx-12 items-center">
        <Text className="rounded-lg bg-red-900 p-4 text-center text-lg leading-6">{title}</Text>
        <View className="styles.codeHighlightContainer my-2"></View>
        <Text className="rounded-lg bg-gray-200 p-4 text-center text-lg leading-6">
          {description}
        </Text>
      </View>
    </View>
  );
};
