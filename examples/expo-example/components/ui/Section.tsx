import React from 'react';
import { Text, View } from 'react-native';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
      <Text className="text-lg font-bold text-gray-900 mb-4">{title}</Text>
      {children}
    </View>
  );
}