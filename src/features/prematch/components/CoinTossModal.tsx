import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, Pressable, Animated, Easing } from 'react-native';
import { tryHaptic } from '../utils/haptics';

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
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!visible) return;
    spin.setValue(0);
    setSpinning(false);
  }, [visible, spin]);

  const doFlip = () => {
    setSpinning(true);
    tryHaptic('light');
    Animated.timing(spin, {
      toValue: 1,
      duration: 1200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      const face = Math.random() > 0.5 ? 'Heads' : 'Tails';
      const winner = face === 'Heads' ? 'Home' : 'Away';
      tryHaptic('success');
      onResult({ face: face as 'Heads' | 'Tails', winner: winner as 'Home' | 'Away' });
      setSpinning(false);
    });
  };

  const rotY = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] });

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-end bg-black/40">
        <View className="w-full rounded-t-3xl bg-white p-6 pb-8">
          <Text className="mb-4 text-center text-lg font-semibold text-slate-900">Coin Toss</Text>
          <View className="mb-5 items-center justify-center">
            <Animated.View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: '#0f4c81',
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ rotateY: rotY }],
              }}>
              <Text className="text-lg font-bold text-white">UPA</Text>
            </Animated.View>
          </View>
          {/* Single large CTA */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Flip coin"
            onPress={spinning ? undefined : doFlip}
            className="h-12 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: spinning ? '#94a3b8' : '#0f4c81',
              opacity: spinning ? 0.7 : 1,
            }}>
            <Text className="font-semibold text-white">
              {spinning ? 'Flipping…' : 'Flip & Select Player'}
            </Text>
          </Pressable>
          <Pressable
            onPress={onClose}
            className="mt-3 h-11 items-center justify-center rounded-2xl bg-slate-100">
            <Text className="font-medium text-slate-700">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
