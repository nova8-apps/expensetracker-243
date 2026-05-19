import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PreviewErrorReporter } from '@/components/PreviewErrorReporter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <PreviewErrorReporter>
      <ErrorBoundary>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <GluestackUIProvider mode="dark">
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
                  animation: 'fade',
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="add-expense"
                  options={{
                    presentation: 'formSheet',
                    sheetAllowedDetents: [0.75],
                    sheetGrabberVisible: true,
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.surface },
                  }}
                />
                <Stack.Screen name="category-detail" />
                <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
              </Stack>
            </GluestackUIProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </PreviewErrorReporter>
  );
}
