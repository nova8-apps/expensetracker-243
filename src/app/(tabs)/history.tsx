import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { Trash2, Search, Filter, ClipboardList } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import { CATEGORIES, type ExpenseCategory } from '@/lib/demo-data';
import { CategoryIcon } from '@/components/CategoryIcon';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const expenses = useAppStore((s) => s.expenses);
  const deleteExpense = useAppStore((s) => s.deleteExpense);
  const currencySymbol = useAppStore((s) => s.currencySymbol);

  const [selectedFilter, setSelectedFilter] = useState<ExpenseCategory | 'All'>('All');

  const sortedExpenses = useMemo(() => {
    let filtered = [...expenses];
    if (selectedFilter !== 'All') {
      filtered = filtered.filter((e) => e.category === selectedFilter);
    }
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, selectedFilter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, typeof sortedExpenses> = {};
    sortedExpenses.forEach((e) => {
      const d = new Date(e.date);
      const key = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return Object.entries(groups);
  }, [sortedExpenses]);

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
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            paddingBottom: 4,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: 'Inter_700Bold',
                  fontSize: 24,
                  color: colors.textPrimary,
                }}
              >
                History
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 13,
                  color: colors.textSecondary,
                  marginTop: 2,
                }}
              >
                {sortedExpenses.length} transaction{sortedExpenses.length !== 1 ? 's' : null}
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginTop: 16 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          <Pressable
            onPress={() => setSelectedFilter('All')}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                selectedFilter === 'All' ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor:
                selectedFilter === 'All' ? colors.primary : colors.border,
            }}
            accessibilityLabel="Filter: All categories"
            testID="filter-all"
          >
            <Text
              style={{
                fontFamily: 'Inter_500Medium',
                fontSize: 13,
                color:
                  selectedFilter === 'All'
                    ? '#FFFFFF'
                    : colors.textSecondary,
              }}
            >
              All
            </Text>
          </Pressable>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.name}
              onPress={() => setSelectedFilter(cat.name)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  selectedFilter === cat.name
                    ? cat.color + '30'
                    : colors.surface,
                borderWidth: 1,
                borderColor:
                  selectedFilter === cat.name ? cat.color : colors.border,
              }}
              accessibilityLabel={`Filter: ${cat.name}`}
              testID={`filter-${cat.name}`}
            >
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 13,
                  color:
                    selectedFilter === cat.name
                      ? cat.color
                      : colors.textSecondary,
                }}
              >
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Grouped List */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          {grouped.length === 0 ? (
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
              <ClipboardList size={36} color={colors.textTertiary} />
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 16,
                  color: colors.textSecondary,
                  marginTop: 12,
                }}
              >
                No transactions found
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 13,
                  color: colors.textTertiary,
                  marginTop: 4,
                  textAlign: 'center',
                }}
              >
                {selectedFilter !== 'All'
                  ? `No ${selectedFilter} expenses recorded`
                  : 'Start tracking by adding an expense'}
              </Text>
            </View>
          ) : null}

          {grouped.map(([dateLabel, items]) => (
            <View key={dateLabel} style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 12,
                  color: colors.textTertiary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  marginBottom: 8,
                }}
              >
                {dateLabel}
              </Text>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                {items.map((exp, i) => (
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
                    <CategoryIcon category={exp.category} size={16} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text
                        style={{
                          fontFamily: 'Inter_500Medium',
                          fontSize: 14,
                          color: colors.textPrimary,
                        }}
                        numberOfLines={1}
                      >
                        {exp.note || exp.category}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Inter_400Regular',
                          fontSize: 12,
                          color: colors.textSecondary,
                          marginTop: 2,
                        }}
                      >
                        {exp.category}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 14,
                        color: colors.textPrimary,
                        marginRight: 12,
                      }}
                    >
                      -{currencySymbol}{exp.amount.toFixed(2)}
                    </Text>
                    <Pressable
                      onPress={() => handleDelete(exp.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      accessibilityLabel={`Delete ${exp.note || exp.category} expense`}
                      testID={`delete-${exp.id}`}
                    >
                      <Trash2 size={16} color={colors.destructive} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
