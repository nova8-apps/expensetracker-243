import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/lib/theme';

// This tab redirects to the add-expense modal
export default function AddTabPlaceholder() {
  useEffect(() => {
    router.push('/add-expense');
  }, []);

  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}
