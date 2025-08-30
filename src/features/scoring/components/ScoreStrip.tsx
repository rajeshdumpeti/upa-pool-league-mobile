// -----------------------------------------------------------------------------
// Purpose: Compact, read-only banner with running score, next breaker,
// and subtle micro-interactions (animated progress + match-point pulse).
// -----------------------------------------------------------------------------

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '~/config/theme';

type Props = {
  className?: string;
  homeName: string;
  awayName: string;
  homeWins: number;
  awayWins: number;
  breakerLabel: string;
  homeProgress?: number; // 0..1
  awayProgress?: number; // 0..1
  homeOnHill?: boolean;
  awayOnHill?: boolean;
  raceDone?: boolean;
  winnerSide?: 'home' | 'away';
};

export default function ScoreStrip({
  className = '',
  homeName,
  awayName,
  homeWins,
  awayWins,
  breakerLabel,
  homeProgress = 0,
  awayProgress = 0,
  homeOnHill,
  awayOnHill,
  raceDone,
  winnerSide,
}: Props) {
  // --- animated widths for the progress bars --------------------------------
  const homeAnim = useRef(new Animated.Value(homeProgress)).current;
  const awayAnim = useRef(new Animated.Value(awayProgress)).current;

  useEffect(() => {
    Animated.timing(homeAnim, {
      toValue: homeProgress,
      duration: 280,
      useNativeDriver: false, // width animation
    }).start();
  }, [homeProgress, homeAnim]);

  useEffect(() => {
    Animated.timing(awayAnim, {
      toValue: awayProgress,
      duration: 280,
      useNativeDriver: false, // width animation
    }).start();
  }, [awayProgress, awayAnim]);

  // --- pulse the match-point pill when someone is on the hill ----------------
  const pulse = useRef(new Animated.Value(0)).current;
  const someoneOnHill = !raceDone && (homeOnHill || awayOnHill);

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (someoneOnHill) {
      pulse.setValue(0);
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 650, useNativeDriver: true }),
        ])
      );
      loop.start();
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [someoneOnHill, pulse]);

  const pillScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  // --- tiny progress bar component ------------------------------------------
  const Bar = ({
    progressAnimated,
    label,
    testID,
  }: {
    progressAnimated: Animated.Value;
    label: string;
    testID: string;
  }) => (
    <View
      className="mt-1 h-1.5 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: theme.colors.surface.background }}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      testID={testID}>
      <Animated.View
        style={{
          height: '100%',
          width: progressAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
          backgroundColor: theme.colors.brand.accent,
        }}
      />
    </View>
  );

  const pillBg = theme.colors.surface.background;
  const pillText = theme.colors.text.muted;

  return (
    <View
      className={['mx-5 mb-2 mt-3 rounded-2xl px-4 py-3', className].join(' ')}
      style={{
        backgroundColor: theme.colors.surface.card,
        borderColor: theme.colors.surface.border,
        borderWidth: 1,
      }}
      accessibilityRole="summary"
      accessibilityLabel={`Score ${homeName} ${homeWins} to ${awayWins} ${awayName}`}
      testID="scoreStrip">
      <View className="flex-row items-start justify-between">
        {/* LEFT: score + pills + progress */}
        <View style={{ flex: 1, paddingRight: 8 }}>
          <View className="flex-row items-center">
            <Text className="text-base font-semibold" style={{ color: theme.colors.text.primary }}>
              {homeName} <Text style={{ color: theme.colors.brand.accent }}>{homeWins}</Text>
              {'  —  '}
              <Text style={{ color: theme.colors.brand.accent }}>{awayWins}</Text> {awayName}
            </Text>

            <View style={{ width: 8 }} />

            {raceDone ? (
              <View
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: pillBg }}
                testID="pill-raceDone">
                <Text className="text-xs" style={{ color: pillText }}>
                  ✓ Race won {winnerSide ? `(${winnerSide === 'home' ? homeName : awayName})` : ''}
                </Text>
              </View>
            ) : someoneOnHill ? (
              <Animated.View
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: pillBg, transform: [{ scale: pillScale }] }}
                testID="pill-onHill">
                <Text className="text-xs" style={{ color: pillText }}>
                  Match point: {homeOnHill ? homeName : awayName}
                </Text>
              </Animated.View>
            ) : null}
          </View>

          <Bar progressAnimated={homeAnim} label={`${homeName} progress`} testID="bar-home" />
          <Bar progressAnimated={awayAnim} label={`${awayName} progress`} testID="bar-away" />
        </View>

        {/* RIGHT: breaker (dim if race done) */}
        <View
          className="flex-row items-center"
          aria-hidden={!!raceDone}
          style={{ opacity: raceDone ? 0.35 : 1 }}
          testID="breaker">
          <Ionicons
            name="golf-outline"
            size={18}
            color={theme.colors.text.muted}
            style={{ marginRight: 6 }}
          />
          <Text className="text-sm" style={{ color: theme.colors.text.muted }}>
            {breakerLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}
