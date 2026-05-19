import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trash2, FolderOpen } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import { getCategoryInfo, type ExpenseCategory } from '@/lib/demo-data';
import { CategoryIcon } from '@/components/CategoryIcon';
import * as Haptics from 'expo-haptics';

export default function CategoryDetailScreen() {
  const insets = useSafeAreaInsets();
  const { category = 'Food' } = useLocalSearchParams<{ category: string }>();
  const expenses = useAppStore((s) => s.expenses);
  const deleteExpense = useAppStore((s) => s.deleteExpense);
  const currencySymbol = useAppStore((s) => s.currencySymbol);

  const catName = category as ExpenseCategory;
  const catInfo = getCategoryInfo(catName);

  const catExpenses = useMemo(
    () =>
      expenses
        .filter((e) => e.category === catName)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [expenses, catName]
  );

  const total = useMemo(
    () => catExpenses.reduce((sum, e) => sum + e.amount, 0),
    [catExpenses]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      deleteExpense(id);
    },
    [deleteExpense]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 12,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ marginBottom: 20 }}
            accessibilityLabel="Go back"
            testID="back-btn"
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CategoryIcon category={catName} size={24} />
            <View style={{ marginLeft: 14 }}>
              <Text
                style={{
                  fontFamily: 'Inter_700Bold',
                  fontSize: 22,
                  color: colors.textPrimary,
                }}
              >
                {catName}
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 13,
                  color: colors.textSecondary,
                  marginTop: 2,
                }}
              >
                {catExpenses.length} transaction{catExpenses.length !== 1 ? 's' : null}
              </Text>
            </View>
          </View>
        </View>

        {/* Total Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: catInfo.color + '15',
              borderRadius: 12,
              padding: 20,
              borderWidth: 1,
              borderColor: catInfo.color + '30',
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: colors.textSecondary,
              }}
            >
              Total Spent
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_800ExtraBold',
                fontSize: 36,
                color: catInfo.color,
                letterSpacing: -1,
                marginTop: 4,
              }}
            >
              {currencySymbol}{total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Transaction List */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 12,
              color: colors.textTertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Transactions
          </Text>

          {catExpenses.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 40,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <FolderOpen size={36} color={colors.textTertiary} />
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginTop: 12,
                }}
              >
                No {catName.toLowerCase()} expenses
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 13,
                  color: colors.textTertiary,
                  marginTop: 4,
                }}
              >
                Add one from the dashboard
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
              {catExpenses.map((exp, i) => {
                const d = new Date(exp.date);
                const dateStr = d.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <View
                    key={exp.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderTopWidth: i > 0 ? 1 : 0,
                      borderTopColor: colors.border,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: 'Inter_500Medium',
                          fontSize: 15,
                          color: colors.textPrimary,
                        }}
                        numberOfLines={1}
                      >
                        {exp.note || catName}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Inter_400Regular',
                          fontSize: 13,
                          color: colors.textSecondary,
                          marginTop: 2,
                        }}
                      >
                        {dateStr}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 15,
                        color: colors.textPrimary,
                        marginRight: 14,
                      }}
                    >
                      -{currencySymbol}{exp.amount.toFixed(2)}
                    </Text>
                    <Pressable
                      onPress={() => handleDelete(exp.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      accessibilityLabel={`Delete expense ${exp.note || catName}`}
                      testID={`delete-cat-${exp.id}`}
                    >
                      <Trash2 size={16} color={colors.destructive} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
