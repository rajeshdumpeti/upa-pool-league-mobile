import { View } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <View className="m-6 flex flex-1">{children}</View>;
};
