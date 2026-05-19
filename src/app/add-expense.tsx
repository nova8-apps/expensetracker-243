import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check, ChevronDown, Calendar } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import { CATEGORIES, type ExpenseCategory } from '@/lib/demo-data';
import { CategoryIcon } from '@/components/CategoryIcon';
import * as Haptics from 'expo-haptics';

export default function AddExpenseScreen() {
  const insets = useSafeAreaInsets();
  const addExpense = useAppStore((s) => s.addExpense);
  const currencySymbol = useAppStore((s) => s.currencySymbol);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [note, setNote] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSubmit = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    scale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const now = new Date().toISOString();
    addExpense({
      id: String(Date.now()),
      amount: numAmount,
      category,
      date: now,
      note: note.trim(),
      createdAt: now,
    });

    router.back();
  }, [amount, category, note, addExpense, scale]);

  const isValid = parseFloat(amount) > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingTop: 12 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Cancel"
            testID="cancel-add"
          >
            <X size={24} color={colors.textSecondary} />
          </Pressable>
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 17,
              color: colors.textPrimary,
            }}
          >
            Add Expense
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Amount Input */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 14,
              color: colors.textSecondary,
              marginBottom: 8,
            }}
          >
            Amount
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'Inter_700Bold',
                fontSize: 42,
                color: colors.textTertiary,
              }}
            >
              {currencySymbol}
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
              style={{
                fontFamily: 'Inter_800ExtraBold',
                fontSize: 48,
                color: colors.primary,
                letterSpacing: -1,
                minWidth: 80,
                textAlign: 'center',
              }}
              autoFocus
              testID="amount-input"
            />
          </View>
        </View>

        {/* Category Selector */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 13,
              color: colors.textSecondary,
              marginBottom: 8,
            }}
          >
            Category
          </Text>
          <Pressable
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surfaceElevated,
              borderRadius: 10,
              paddingVertical: 14,
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: showCategoryPicker ? colors.primary : colors.border,
              opacity: pressed ? 0.8 : 1,
            })}
            accessibilityLabel={`Category: ${category}`}
            testID="category-selector" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <CategoryIcon category={category} size={14} />
            <Text
              style={{
                fontFamily: 'Inter_500Medium',
                fontSize: 15,
                color: colors.textPrimary,
                flex: 1,
                marginLeft: 10,
              }}
            >
              {category}
            </Text>
            <ChevronDown
              size={16}
              color={colors.textSecondary}
              style={{
                transform: [{ rotate: showCategoryPicker ? '180deg' : '0deg' }],
              }}
            />
          </Pressable>

          {showCategoryPicker ? (
            <View
              style={{
                backgroundColor: colors.surfaceElevated,
                borderRadius: 10,
                marginTop: 8,
                borderWidth: 1,
                borderColor: colors.border,
                overflow: 'hidden',
              }}
            >
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.name}
                  onPress={() => {
                    setCategory(cat.name);
                    setShowCategoryPicker(false);
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    backgroundColor:
                      category === cat.name
                        ? colors.primaryFaint
                        : pressed
                        ? colors.surface
                        : 'transparent',
                  })}
                  accessibilityLabel={`Select ${cat.name}`}
                  testID={`cat-option-${cat.name}`} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <CategoryIcon category={cat.name} size={12} />
                  <Text
                    style={{
                      fontFamily: 'Inter_500Medium',
                      fontSize: 14,
                      color: colors.textPrimary,
                      flex: 1,
                      marginLeft: 10,
                    }}
                  >
                    {cat.name}
                  </Text>
                  {category === cat.name ? (
                    <Check size={16} color={colors.primary} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {/* Note Input */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 13,
              color: colors.textSecondary,
              marginBottom: 8,
            }}
          >
            Note (optional)
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor={colors.textTertiary}
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 15,
              color: colors.textPrimary,
              backgroundColor: colors.surfaceElevated,
              borderRadius: 10,
              paddingVertical: 14,
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            multiline
            numberOfLines={2}
            testID="note-input"
          />
        </View>

        {/* Submit Button */}
        <Animated.View style={scaleStyle}>
          <Pressable
            onPress={handleSubmit}
            disabled={!isValid}
            style={{
              backgroundColor: isValid ? colors.primary : colors.border,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
            }}
            accessibilityLabel="Add expense"
            testID="submit-expense"
          >
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 16,
                color: isValid ? '#FFFFFF' : colors.textTertiary,
              }}
            >
              Add Expense
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
