import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, TrendingDown, Wallet } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import { CATEGORIES, MONTH_NAMES, type ExpenseCategory } from '@/lib/demo-data';
import { CategoryIcon } from '@/components/CategoryIcon';
import { ExpenseRow } from '@/components/ExpenseRow';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const expenses = useAppStore((s) => s.expenses);
  const currencySymbol = useAppStore((s) => s.currencySymbol);
  const budgetEnabled = useAppStore((s) => s.budgetEnabled);
  const budgetLimit = useAppStore((s) => s.budgetLimit);

  const now = new Date();
  const monthName = MONTH_NAMES[now.getMonth()];

  // Filter to current month
  const monthExpenses = useMemo(() => {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenses.filter((e) => new Date(e.date) >= startOfMonth);
  }, [expenses]);

  const totalSpent = useMemo(
    () => monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    [monthExpenses]
  );

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    monthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return CATEGORIES.map((cat) => ({
      ...cat,
      total: map[cat.name] || 0,
      percentage: totalSpent > 0 ? ((map[cat.name] || 0) / totalSpent) * 100 : 0,
    }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [monthExpenses, totalSpent]);

  // Recent transactions (last 5)
  const recentExpenses = useMemo(
    () =>
      [...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [expenses]
  );

  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const handleAddPress = () => {
    fabScale.value = withSpring(0.9, { damping: 15 }, () => {
      fabScale.value = withSpring(1, { damping: 15 });
    });
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/add-expense');
  };

  const budgetPercent = budgetEnabled && budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: colors.background,
          }}
        >
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 14,
              color: colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}
          >
            {monthName} {now.getFullYear()}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_800ExtraBold',
              fontSize: 42,
              color: colors.primary,
              letterSpacing: -1.5,
              marginTop: 4,
            }}
          >
            {currencySymbol}{totalSpent.toFixed(2)}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 13,
              color: colors.textSecondary,
              marginTop: 2,
            }}
          >
            Total spent this month
          </Text>
        </View>

        {/* Budget Progress Bar */}
        {budgetEnabled ? (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textSecondary }}>
                  Budget
                </Text>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: budgetPercent > 100 ? colors.destructive : colors.primary }}>
                  {budgetPercent.toFixed(0)}%
                </Text>
              </View>
              <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}>
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: budgetPercent > 100 ? colors.destructive : colors.primary,
                    width: `${Math.min(budgetPercent, 100)}%`,
                  }}
                />
              </View>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textTertiary, marginTop: 6 }}>
                {currencySymbol}{totalSpent.toFixed(2)} of {currencySymbol}{budgetLimit.toFixed(2)}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Category Breakdown */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary }}>
              By Category
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              THIS MONTH
            </Text>
          </View>

          {categoryBreakdown.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 32,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Wallet size={32} color={colors.textTertiary} />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.textSecondary, marginTop: 12 }}>
                No expenses yet
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textTertiary, marginTop: 4 }}>
                Tap + to add your first expense
              </Text>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {categoryBreakdown.map((cat, i) => (
                <Pressable
                  key={cat.name}
                  onPress={() =>
                    router.push(`/category-detail?category=${cat.name}`)
                  }
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    opacity: pressed ? 0.7 : 1,
                    borderTopWidth: i > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                  })}
                  accessibilityLabel={`View ${cat.name} expenses, ${currencySymbol}${cat.total.toFixed(2)}`}
                  testID={`category-row-${cat.name}`} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <CategoryIcon category={cat.name as ExpenseCategory} size={16} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={{
                        fontFamily: 'Inter_500Medium',
                        fontSize: 14,
                        color: colors.textPrimary,
                      }}
                    >
                      {cat.name}
                    </Text>
                    {/* Progress bar */}
                    <View
                      style={{
                        height: 4,
                        backgroundColor: colors.border,
                        borderRadius: 2,
                        marginTop: 6,
                        overflow: 'hidden',
                      }}
                    >
                      <View
                        style={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: cat.color,
                          width: `${cat.percentage}%`,
                        }}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Inter_600SemiBold',
                      fontSize: 14,
                      color: colors.textPrimary,
                      marginLeft: 12,
                    }}
                  >
                    {currencySymbol}{cat.total.toFixed(2)}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Recent Transactions */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.textPrimary }}>
              Recent
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/history')}
              hitSlop={8}
              accessibilityLabel="View all transactions"
              testID="view-all-btn"
            >
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.primary }}>
                View All
              </Text>
            </Pressable>
          </View>

          {recentExpenses.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 32,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <TrendingDown size={32} color={colors.textTertiary} />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.textSecondary, marginTop: 12 }}>
                No transactions yet
              </Text>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {recentExpenses.map((exp, i) => (
                <View
                  key={exp.id}
                  style={{
                    borderTopWidth: i > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                  }}
                >
                  <ExpenseRow expense={exp} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: Platform.OS === 'web' ? 88 : 108,
            right: 20,
            zIndex: 10,
          },
          fabStyle,
        ]}
      >
        <Pressable
          onPress={handleAddPress}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
          accessibilityLabel="Add new expense"
          testID="fab-add-expense" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Plus size={24} color="#FFFFFF" />
        </Pressable>
      </Animated.View>
    </View>
  );
}
