import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ThemeMode } from '@intercom/intercom-react-native';
import Button from './ui/Button';
import Section from './ui/Section';

interface SettingsSectionProps {
  currentTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => Promise<void>;
  launcherVisibility: boolean;
  toggleLauncherVisibility: () => Promise<void>;
  bottomPadding: number;
  updateBottomPadding: () => Promise<void>;
}

export default function SettingsSection({
  currentTheme,
  setTheme,
  launcherVisibility,
  toggleLauncherVisibility,
  bottomPadding,
  updateBottomPadding,
}: SettingsSectionProps) {
  return (
    <Section title="⚙️ Settings">
      <View className="flex-row gap-2 mb-4">
        <TouchableOpacity
          className={`flex-1 px-4 py-3 rounded-lg ${
            currentTheme === 'LIGHT' ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          onPress={() => setTheme(ThemeMode.LIGHT)}
          accessibilityLabel="Set light theme"
        >
          <Text className="text-white text-center font-semibold">Light</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 px-4 py-3 rounded-lg ${
            currentTheme === 'DARK' ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          onPress={() => setTheme(ThemeMode.DARK)}
          accessibilityLabel="Set dark theme"
        >
          <Text className="text-white text-center font-semibold">Dark</Text>
        </TouchableOpacity>
      </View>

      <Button
        title={`Launcher: ${launcherVisibility ? 'Visible' : 'Hidden'}`}
        onPress={toggleLauncherVisibility}
        variant="secondary"
      />

      <Button
        title={`Bottom Padding: ${bottomPadding}px`}
        onPress={updateBottomPadding}
        variant="secondary"
      />
    </Section>
  );
}
