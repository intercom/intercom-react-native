import React from 'react';
import { Text, View } from 'react-native';

interface HeaderProps {
  architectureType: string;
  loggedUser: boolean;
  count: number;
}

export default function Header({
  architectureType,
  loggedUser,
  count,
}: HeaderProps) {
  return (
    <View className="bg-white border-b border-gray-200 px-6 py-4">
      <Text className="text-2xl font-bold text-gray-900">
        Intercom Expo Demo
      </Text>
      <Text className="text-sm text-blue-600 font-medium">
        {architectureType}
      </Text>
      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-gray-600">
          Status: {loggedUser ? '🟢 Logged In' : '🔴 Not Logged In'}
        </Text>
        <Text className="text-sm text-gray-600">Unread: {count}</Text>
      </View>
    </View>
  );
}
