import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CategoryIcon } from './CategoryIcon';
import { colors } from '@/lib/theme';
import type { Expense } from '@/lib/demo-data';
import { useAppStore } from '@/lib/store';

interface ExpenseRowProps {
  expense: Expense;
  onPress?: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ExpenseRow({ expense, onPress }: ExpenseRowProps) {
  const currencySymbol = useAppStore((s) => s.currencySymbol);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        opacity: pressed ? 0.7 : 1,
      })}
      accessibilityLabel={`${expense.category} expense ${currencySymbol}${expense.amount.toFixed(2)}`}
      testID={`expense-row-${expense.id}`} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <CategoryIcon category={expense.category} size={18} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 15,
            color: colors.textPrimary,
          }}
          numberOfLines={1}
        >
          {expense.note || expense.category}
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 2,
          }}
        >
          {expense.category} · {formatDate(expense.date)}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: 'Inter_600SemiBold',
          fontSize: 15,
          color: colors.textPrimary,
        }}
      >
        -{currencySymbol}{expense.amount.toFixed(2)}
      </Text>
    </Pressable>
  );
}
