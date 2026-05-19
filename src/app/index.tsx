import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function IndexScreen() {
  const hasSeenOnboarding = useAppStore((s) => s.hasSeenOnboarding);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasSeenOnboarding) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/onboarding');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [hasSeenOnboarding]);

  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}
