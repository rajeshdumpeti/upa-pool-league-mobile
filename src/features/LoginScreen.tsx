// src/features/LoginScreen.tsx
import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { axiosClient } from '../api/axiosClient';
import useAuthStore from '../stores/useAuthStore';

const LoginScreen = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginAction = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post('/api/v1/login', {
        email,
        password,
      });
      await loginAction(response.data.access_token);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center p-6">
        <View className="mb-10">
          <Text className="mb-2 text-center text-4xl font-bold text-gray-800">UPA Pool League</Text>
          <Text className="text-center text-lg text-gray-500">Sign in to access your account</Text>
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-base font-semibold text-gray-600">Email</Text>
          <TextInput
            className="w-full rounded-lg border border-gray-300 bg-gray-100 p-4 text-lg"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-base font-semibold text-gray-600">Password</Text>
          <TextInput
            className="w-full rounded-lg border border-gray-300 bg-gray-100 p-4 text-lg"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error && <Text className="mb-4 text-center text-red-500">{error}</Text>}

        <TouchableOpacity
          className="h-14 items-center justify-center rounded-lg bg-blue-600"
          onPress={handleLogin}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-xl font-bold text-white">Log In</Text>
          )}
        </TouchableOpacity>

        <View className="mt-4 items-center">
          <Text className="text-sm text-blue-600">Forgot password?</Text>
        </View>

        {/* Future use only */}
        {/*         
        <View className="mt-8 flex-row justify-center">
            <Text className="text-gray-500">Don't have an account? </Text>
            <Text className="font-semibold text-blue-600">Sign up</Text>
        </View> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
