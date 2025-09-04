// src/features/auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '~/config/theme';
import { useAuthStore } from '~/stores/authStore';

export default function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const busy = useAuthStore((s) => s.busy);

  const [email, setEmail] = useState('dev@example.com');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async () => {
    await signIn(email, password);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Background top gradient */}
      <LinearGradient
        colors={[theme.colors.brand.accent, '#2b63ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 220 }}
      />

      {/* Card */}
      <View className="-mt-16 flex-1 px-6">
        <View
          className="mx-auto w-full max-w-md rounded-3xl p-5"
          style={{
            backgroundColor: theme.colors.surface.card,
            borderColor: theme.colors.surface.border,
            borderWidth: 1,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
            elevation: 3,
          }}>
          {/* Hero */}
          <View className="-mt-10 items-center">
            <Image
              source={require('../../../assets/images/image.png')}
              style={{ width: 200, height: 255, borderRadius: 12 }}
            />
          </View>

          <View className="mt-6">
            <Text className="text-center text-3xl font-extrabold text-zinc-900">Sign in</Text>
            <Text className="mt-2 text-center text-zinc-500">Welcome back to UPA Pool League</Text>
          </View>

          {/* Inputs */}
          <View className="mt-6">
            <View
              className="mb-3 flex-row items-center rounded-2xl px-3"
              style={{
                height: 48,
                backgroundColor: theme.colors.surface.background,
                borderColor: theme.colors.surface.border,
                borderWidth: 1,
              }}>
              <Ionicons name="mail-outline" size={18} color={theme.colors.text.muted} />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor={theme.colors.text.muted}
                value={email}
                onChangeText={setEmail}
                style={{
                  marginLeft: 8,
                  flex: 1,
                  color: theme.colors.text.primary,
                }}
              />
            </View>

            <View
              className="mb-1 flex-row items-center rounded-2xl px-3"
              style={{
                height: 48,
                backgroundColor: theme.colors.surface.background,
                borderColor: theme.colors.surface.border,
                borderWidth: 1,
              }}>
              <Ionicons name="lock-closed-outline" size={18} color={theme.colors.text.muted} />
              <TextInput
                placeholder="Password"
                placeholderTextColor={theme.colors.text.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                style={{
                  marginLeft: 8,
                  flex: 1,
                  color: theme.colors.text.primary,
                }}
              />
              <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={10}>
                <Ionicons
                  name={showPw ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={theme.colors.text.muted}
                />
              </Pressable>
            </View>

            {/* Forgot & spacer (optional future link) */}
            {/* <Pressable className="self-end mt-2">
              <Text style={{ color: theme.colors.brand.accent, fontWeight: '600' }}>Forgot password?</Text>
            </Pressable> */}
          </View>

          {/* CTA */}
          <Pressable
            disabled={busy}
            onPress={onSubmit}
            className="mt-5 h-12 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: theme.colors.brand.accent,
              opacity: busy ? 0.6 : 1,
            }}>
            <Text className="font-semibold text-white">{busy ? 'Signing in…' : 'Sign in'}</Text>
          </Pressable>

          {/* Footer */}
          <View className="mt-4 items-center">
            <Text className="text-center text-zinc-500">
              By continuing you agree to our
              <Text className="font-medium"> Terms & Privacy.</Text>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
