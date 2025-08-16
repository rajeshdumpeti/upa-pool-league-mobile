import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export default function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </View>
  );
}
