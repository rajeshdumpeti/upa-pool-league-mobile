// -----------------------------------------------------------------------------
// Purpose: Reusable, accessible modal with simple fade/scale animation.
// - No extra deps (uses React Native's Modal + Animated).
// - Primary / secondary / tertiary actions supported.
// -----------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '~/config/theme';

export type ModalAction = {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'tertiary';
  testID?: string;
};

type Props = {
  visible: boolean;
  title?: string;
  children?: React.ReactNode;
  onRequestClose: () => void;
  actions?: ModalAction[];
  dismissOnBackdrop?: boolean;
  testID?: string;
};

export default function UPAModal({
  visible,
  title,
  children,
  onRequestClose,
  actions = [],
  dismissOnBackdrop = true,
  testID = 'upaModal',
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 120,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 120,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fade, scale]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onRequestClose}
      statusBarTranslucent
      presentationStyle="overFullScreen">
      {/* Backdrop */}
      <Pressable
        onPress={dismissOnBackdrop ? onRequestClose : undefined}
        testID={`${testID}-backdrop`}
        accessibilityLabel="Close dialog"
        accessibilityRole="button"
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
        {/* Stop backdrop press from closing when tapping card */}
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <Animated.View
            testID={testID}
            accessibilityViewIsModal
            accessibilityLabel={title ?? 'Dialog'}
            style={{
              transform: [{ scale }],
              opacity: fade,
              backgroundColor: theme.colors.surface.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.surface.border,
              padding: 16,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 6,
            }}
            // absorb presses
            onStartShouldSetResponder={() => true}>
            {/* Header */}
            {title && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text
                  style={{
                    flex: 1,
                    color: theme.colors.text.primary,
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  {title}
                </Text>
                <Pressable
                  onPress={onRequestClose}
                  hitSlop={10}
                  accessibilityLabel="Close"
                  accessibilityRole="button">
                  <Ionicons name="close" size={20} color={theme.colors.text.muted} />
                </Pressable>
              </View>
            )}

            {/* Body */}
            <View style={{ marginTop: 4 }}>{children}</View>

            {/* Actions */}
            {actions.length > 0 && (
              <View
                style={{ marginTop: 16, flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
                {actions.map((a, idx) => {
                  const kind = a.kind ?? 'secondary';
                  const bg =
                    kind === 'primary'
                      ? theme.colors.brand.accent
                      : kind === 'secondary'
                        ? theme.colors.surface.background
                        : 'transparent';
                  const color =
                    kind === 'primary'
                      ? '#fff'
                      : kind === 'secondary'
                        ? theme.colors.text.primary
                        : theme.colors.text.muted;
                  const borderWidth = kind === 'tertiary' ? 0 : 1;
                  const borderColor =
                    kind === 'primary' ? theme.colors.brand.accent : theme.colors.surface.border;

                  return (
                    <Pressable
                      key={idx}
                      onPress={a.onPress}
                      testID={a.testID}
                      accessibilityRole="button"
                      style={{
                        minHeight: 40,
                        paddingHorizontal: 14,
                        borderRadius: 10,
                        backgroundColor: bg,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth,
                        borderColor,
                      }}>
                      <Text style={{ color, fontWeight: '600' }}>{a.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </Animated.View>
        </View>
      </Pressable>
    </Modal>
  );
}
