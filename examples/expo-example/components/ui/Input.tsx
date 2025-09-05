import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface InputProps {
  label: string;
  value?: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address';
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}: InputProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}
