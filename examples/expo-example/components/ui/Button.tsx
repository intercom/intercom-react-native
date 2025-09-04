import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

export default function Button({ 
  title, 
  onPress, 
  disabled = false, 
  variant = 'primary' 
}: ButtonProps) {
  const variantClasses = {
    primary: disabled ? 'bg-gray-300' : 'bg-blue-600',
    secondary: disabled ? 'bg-gray-300' : 'bg-gray-600',
    success: disabled ? 'bg-gray-300' : 'bg-green-600',
    danger: disabled ? 'bg-gray-300' : 'bg-red-600',
  };

  return (
    <TouchableOpacity
      className={`px-4 py-3 rounded-lg mb-3 ${variantClasses[variant]}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white text-center font-semibold">{title}</Text>
    </TouchableOpacity>
  );
}