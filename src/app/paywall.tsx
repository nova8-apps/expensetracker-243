import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Check, Crown, Sparkles, FolderPlus, Download, Repeat } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '@/lib/theme';
import * as Haptics from 'expo-haptics';

interface PlanOption {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
}

const PLANS: PlanOption[] = [
  { id: 'monthly', name: 'Monthly', price: '$4.99', period: '/month' },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$39.99',
    period: '/year',
    savings: 'Save 33%',
  },
];

interface FeatureRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureRow({ icon, title, description }: FeatureRowProps) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: colors.primaryMuted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 15,
            color: colors.textPrimary,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 2,
          }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleSubscribe = () => {
    btnScale.value = withSpring(0.95, { damping: 15 }, () => {
      btnScale.value = withSpring(1, { damping: 15 });
    });
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Mock for first build — wire real API in follow-up turn
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Close */}
        <View
          style={{
            paddingTop: insets.top + 12,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Close paywall"
            testID="close-paywall"
          >
            <X size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Hero */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20, marginTop: 20 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: colors.primaryMuted,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Crown size={36} color={colors.primary} />
          </View>
          <Text
            style={{
              fontFamily: 'Inter_800ExtraBold',
              fontSize: 28,
              color: colors.textPrimary,
              letterSpacing: -0.5,
              textAlign: 'center',
            }}
          >
            Go Premium
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 15,
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: 8,
              lineHeight: 22,
              paddingHorizontal: 20,
            }}
          >
            Unlock powerful features to take full control of your finances
          </Text>
        </View>

        {/* Features */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <FeatureRow
            icon={<FolderPlus size={20} color={colors.primary} />}
            title="Custom Categories"
            description="Create unlimited categories tailored to your spending"
          />
          <FeatureRow
            icon={<Repeat size={20} color={colors.primary} />}
            title="Recurring Templates"
            description="Auto-log recurring expenses like rent and subscriptions"
          />
          <FeatureRow
            icon={<Download size={20} color={colors.primary} />}
            title="CSV Export"
            description="Export your data for spreadsheets and tax season"
          />
          <FeatureRow
            icon={<Sparkles size={20} color={colors.primary} />}
            title="Advanced Analytics"
            description="Spending trends, predictions, and insights"
          />
        </View>

        {/* Plan Selection */}
        <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
          {PLANS.map((plan) => (
            <Pressable
              key={plan.id}
              onPress={() => {
                setSelectedPlan(plan.id);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:
                  selectedPlan === plan.id ? colors.primaryFaint : colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 10,
                borderWidth: 2,
                borderColor:
                  selectedPlan === plan.id ? colors.primary : colors.border,
              }}
              accessibilityLabel={`${plan.name} plan ${plan.price}${plan.period}`}
              testID={`plan-${plan.id}`}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  borderWidth: 2,
                  borderColor:
                    selectedPlan === plan.id ? colors.primary : colors.textTertiary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedPlan === plan.id ? (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: colors.primary,
                    }}
                  />
                ) : null}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontFamily: 'Inter_600SemiBold',
                      fontSize: 16,
                      color: colors.textPrimary,
                    }}
                  >
                    {plan.name}
                  </Text>
                  {plan.savings ? (
                    <View
                      style={{
                        backgroundColor: colors.primary,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        marginLeft: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Inter_600SemiBold',
                          fontSize: 11,
                          color: '#FFFFFF',
                        }}
                      >
                        {plan.savings}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <Text
                style={{
                  fontFamily: 'Inter_700Bold',
                  fontSize: 18,
                  color: colors.textPrimary,
                }}
              >
                {plan.price}
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 12,
                  color: colors.textSecondary,
                }}
              >
                {plan.period}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* CTA */}
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <Animated.View style={btnStyle}>
            <Pressable
              onPress={handleSubscribe}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
              }}
              accessibilityLabel="Subscribe to premium"
              testID="subscribe-btn"
            >
              <Text
                style={{
                  fontFamily: 'Inter_700Bold',
                  fontSize: 16,
                  color: '#FFFFFF',
                }}
              >
                Start Free Trial
              </Text>
            </Pressable>
          </Animated.View>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              color: colors.textTertiary,
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            7-day free trial, then{' '}
            {selectedPlan === 'yearly' ? '$39.99/year' : '$4.99/month'}. Cancel
            anytime.
          </Text>
        </View>

        {/* Comparison Table */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 32,
          }}
        >
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 16,
              color: colors.textPrimary,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Compare Plans
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: 'hidden',
            }}
          >
            {[
              { feature: 'Unlimited Expenses', free: true, premium: true },
              { feature: 'Default Categories (6)', free: true, premium: true },
              { feature: 'Budget Tracking', free: true, premium: true },
              { feature: 'Custom Categories', free: false, premium: true },
              { feature: 'Recurring Templates', free: false, premium: true },
              { feature: 'CSV Export', free: false, premium: true },
              { feature: 'Advanced Analytics', free: false, premium: true },
            ].map((row, i) => (
              <View
                key={row.feature}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: colors.border,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14,
                    color: colors.textPrimary,
                  }}
                >
                  {row.feature}
                </Text>
                <View style={{ width: 50, alignItems: 'center' }}>
                  {row.free ? (
                    <Check size={16} color={colors.primary} />
                  ) : (
                    <X size={16} color={colors.textTertiary} />
                  )}
                </View>
                <View style={{ width: 50, alignItems: 'center' }}>
                  {row.premium ? (
                    <Check size={16} color={colors.primary} />
                  ) : (
                    <X size={16} color={colors.textTertiary} />
                  )}
                </View>
              </View>
            ))}
            {/* Column headers */}
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                backgroundColor: colors.surfaceElevated,
              }}
            >
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  width: 50,
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 11,
                  color: colors.textSecondary,
                  textAlign: 'center',
                }}
              >
                FREE
              </Text>
              <Text
                style={{
                  width: 50,
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 11,
                  color: colors.primary,
                  textAlign: 'center',
                }}
              >
                PRO
              </Text>
            </View>
          </View>
        </View>

        {/* Legal */}
        <View style={{ paddingHorizontal: 20, marginTop: 24, alignItems: 'center' }}>
          <Pressable
            accessibilityLabel="Restore purchases"
            testID="restore-purchases"
          >
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: colors.textSecondary,
              }}
            >
              Restore Purchases
            </Text>
          </Pressable>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
            <Pressable accessibilityLabel="Terms of service" testID="terms-link">
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 12,
                  color: colors.textTertiary,
                }}
              >
                Terms of Service
              </Text>
            </Pressable>
            <Pressable accessibilityLabel="Privacy policy" testID="privacy-link">
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 12,
                  color: colors.textTertiary,
                }}
              >
                Privacy Policy
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
