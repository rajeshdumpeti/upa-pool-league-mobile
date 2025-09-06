import React, { useRef, useState } from 'react';
import { Modal, View, Text, Pressable, Animated, Easing } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onResult: (r: { face: 'Heads' | 'Tails'; winner: 'Home' | 'Away' }) => void;
};

export type TeamSide = 'Home' | 'Away';
export type CoinFace = 'Heads' | 'Tails';
export type Result = { face: CoinFace; winner: TeamSide };
type CoinResult = { face: 'Heads' | 'Tails'; winner: 'Home' | 'Away' };

export default function CoinTossModal({ visible, onClose, onResult }: Props) {
  const spin = useRef(new Animated.Value(0)).current;
  const [face, setFace] = useState<'Heads' | 'Tails' | null>(null);

  function flip() {
    Animated.timing(spin, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      spin.setValue(0);
      const f = Math.random() > 0.5 ? 'Heads' : 'Tails';
      setFace(f);
    });
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-end bg-black/40">
        <View className="w-full rounded-t-3xl bg-white p-6">
          <Text className="mb-1 text-center text-lg font-semibold text-slate-900">Coin Toss</Text>
          <Text className="mb-4 text-center text-slate-500">Tap coin to flip</Text>
          <View className="items-center">
            <Pressable onPress={flip} className="mb-5">
              <Animated.View
                className="h-24 w-24 items-center justify-center rounded-full"
                style={{
                  backgroundColor: '#eef2ff',
                  transform: [
                    {
                      rotateY: spin.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '540deg'],
                      }),
                    },
                  ],
                }}>
                <Text className="text-xl font-bold text-slate-800">{face ?? '?'}</Text>
              </Animated.View>
            </Pressable>
            <Pressable
              className="h-12 w-full items-center justify-center rounded-2xl bg-blue-600"
              onPress={() => {
                const effective = face ?? (Math.random() > 0.5 ? 'Heads' : 'Tails');
                const winner = effective === 'Heads' ? 'Home' : 'Away';
                onResult({ face: effective, winner });
              }}>
              <Text className="font-semibold text-white">Select Player</Text>
            </Pressable>
            <Pressable className="mt-3 items-center" onPress={onClose}>
              <Text className="text-slate-500">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
