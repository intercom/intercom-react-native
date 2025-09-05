import React from 'react';
import { Text, View } from 'react-native';

interface ArchitectureInfoProps {
  architectureType: string;
}

export default function ArchitectureInfo({
  architectureType,
}: ArchitectureInfoProps) {
  return (
    <View className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-6">
      <Text className="text-lg font-bold text-gray-900 mb-2">
        ⚡ Architecture Info
      </Text>
      <Text className="text-gray-700 mb-2">Running on: {architectureType}</Text>
      <Text className="text-sm text-gray-600">
        {architectureType.includes('TurboModules')
          ? '🚀 Using modern TurboModules for enhanced performance and type safety'
          : '📱 Using classic React Native Bridge architecture'}
      </Text>
    </View>
  );
}
