import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { PieChart, Zap, Shield } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CARDS: OnboardingCard[] = [
  {
    icon: <PieChart size={48} color={colors.primary} />,
    title: 'Track Every Expense',
    description:
      'Categorize your spending in real time and see exactly where your money goes each month.',
  },
  {
    icon: <Zap size={48} color={colors.primary} />,
    title: 'Quick & Easy Entry',
    description:
      'Add expenses in seconds with smart categories and one-tap logging. No complicated forms.',
  },
  {
    icon: <Shield size={48} color={colors.primary} />,
    title: 'Stay Within Budget',
    description:
      'Set monthly limits and get visual progress updates. Take control of your financial health.',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const setHasSeenOnboarding = useAppStore((s) => s.setHasSeenOnboarding);
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);

  const goToIndex = useCallback(
    (index: number) => {
      translateX.value = withSpring(-index * SCREEN_WIDTH, {
        damping: 20,
        stiffness: 200,
      });
      setCurrentIndex(index);
    },
    [translateX]
  );

  const handleNext = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (currentIndex < CARDS.length - 1) {
      goToIndex(currentIndex + 1);
    } else {
      setHasSeenOnboarding(true);
      router.replace('/(tabs)/home');
    }
  }, [currentIndex, goToIndex, setHasSeenOnboarding]);

  const handleSkip = useCallback(() => {
    setHasSeenOnboarding(true);
    router.replace('/(tabs)/home');
  }, [setHasSeenOnboarding]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Skip button */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <Pressable
          onPress={handleSkip}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Skip onboarding"
          testID="skip-onboarding"
        >
          <Text
            style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 14,
              color: colors.textSecondary,
            }}
          >
            Skip
          </Text>
        </Pressable>
      </View>

      {/* Cards */}
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              flex: 1,
            },
            slideStyle,
          ]}
        >
          {CARDS.map((card, index) => (
            <View
              key={index}
              style={{
                width: SCREEN_WIDTH,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 40,
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 28,
                  backgroundColor: colors.primaryMuted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 32,
                }}
              >
                {card.icon}
              </View>
              <Text
                style={{
                  fontFamily: 'Inter_700Bold',
                  fontSize: 24,
                  color: colors.textPrimary,
                  textAlign: 'center',
                  marginBottom: 12,
                }}
              >
                {card.title}
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 15,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  lineHeight: 22,
                }}
              >
                {card.description}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Indicators + Button */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* Dots */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 32,
          }}
        >
          {CARDS.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goToIndex(i)}
              accessibilityLabel={`Go to step ${i + 1}`}
              testID={`dot-${i}`}
            >
              <View
                style={{
                  width: currentIndex === i ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    currentIndex === i ? colors.primary : colors.border,
                }}
              />
            </Pressable>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: pressed ? 0.9 : 1,
          })}
          accessibilityLabel={
            currentIndex === CARDS.length - 1 ? 'Start tracking' : 'Next'
          }
          testID="onboarding-cta"
        >
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 16,
              color: '#FFFFFF',
            }}
          >
            {currentIndex === CARDS.length - 1 ? 'Start Tracking' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
