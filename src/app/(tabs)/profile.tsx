import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform, Modal as RNModal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Crown,
  ChevronRight,
  DollarSign,
  Target,
  Trash2,
  Shield,
  Info,
  LogOut,
} from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import { CURRENCY_OPTIONS } from '@/lib/demo-data';
import * as Haptics from 'expo-haptics';

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  trailing?: React.ReactNode;
}

function SettingRow({ icon, label, value, onPress, destructive, trailing }: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        opacity: pressed && onPress ? 0.7 : 1,
      })}
      disabled={!onPress}
      accessibilityLabel={label}
      testID={`setting-${label.toLowerCase().replace(/\s/g, '-')}`}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: destructive ? colors.destructiveMuted : colors.primaryMuted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          flex: 1,
          fontFamily: 'Inter_500Medium',
          fontSize: 15,
          color: destructive ? colors.destructive : colors.textPrimary,
          marginLeft: 12,
        }}
      >
        {label}
      </Text>
      {trailing ? trailing : null}
      {value ? (
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            color: colors.textSecondary,
            marginRight: 8,
          }}
        >
          {value}
        </Text>
      ) : null}
      {onPress && !trailing ? (
        <ChevronRight size={16} color={colors.textTertiary} />
      ) : null}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const currency = useAppStore((s) => s.currency);
  const setCurrency = useAppStore((s) => s.setCurrency);
  const budgetEnabled = useAppStore((s) => s.budgetEnabled);
  const budgetLimit = useAppStore((s) => s.budgetLimit);
  const setBudgetEnabled = useAppStore((s) => s.setBudgetEnabled);
  const setBudgetLimit = useAppStore((s) => s.setBudgetLimit);
  const clearAllData = useAppStore((s) => s.clearAllData);
  const isPremium = useAppStore((s) => s.isPremium);
  const currencySymbol = useAppStore((s) => s.currencySymbol);

  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(budgetLimit));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Avatar Style */}
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 24,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.primaryMuted,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter_700Bold',
                fontSize: 28,
                color: colors.primary,
              }}
            >
              X
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Inter_700Bold',
              fontSize: 20,
              color: colors.textPrimary,
            }}
          >
            XknownX
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 6,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor: isPremium ? colors.primaryMuted : colors.surfaceElevated,
            }}
          >
            {isPremium ? <Crown size={12} color={colors.primary} style={{ marginRight: 4 }} /> : null}
            <Text
              style={{
                fontFamily: 'Inter_500Medium',
                fontSize: 12,
                color: isPremium ? colors.primary : colors.textSecondary,
              }}
            >
              {isPremium ? 'Premium' : 'Free Plan'}
            </Text>
          </View>
        </View>

        {/* Upgrade Card */}
        {!isPremium ? (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Pressable
              onPress={() => router.push('/paywall')}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                opacity: pressed ? 0.9 : 1,
              })}
              accessibilityLabel="Upgrade to Premium"
              testID="upgrade-card"
            >
              <Crown size={24} color="#FFFFFF" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 15,
                    color: '#FFFFFF',
                  }}
                >
                  Upgrade to Premium
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.8)',
                    marginTop: 2,
                  }}
                >
                  Custom categories, templates, CSV export
                </Text>
              </View>
              <ChevronRight size={20} color="rgba(255,255,255,0.8)" />
            </Pressable>
          </View>
        ) : null}

        {/* Settings Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
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
            Preferences
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
            <SettingRow
              icon={<DollarSign size={16} color={colors.primary} />}
              label="Currency"
              value={currency}
              onPress={() => setShowCurrencyPicker(true)}
            />
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 60 }} />
            <SettingRow
              icon={<Target size={16} color={colors.primary} />}
              label="Monthly Budget"
              value={budgetEnabled ? `${currencySymbol}${budgetLimit}` : 'Off'}
              onPress={() => setShowBudgetModal(true)}
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
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
            Data
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
            <SettingRow
              icon={<Trash2 size={16} color={colors.destructive} />}
              label="Clear All Data"
              destructive
              onPress={() => setShowClearConfirm(true)}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
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
            About
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
            <SettingRow
              icon={<Shield size={16} color={colors.primary} />}
              label="Privacy Policy"
              onPress={() => {}}
            />
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 60 }} />
            <SettingRow
              icon={<Info size={16} color={colors.primary} />}
              label="App Version"
              value="1.0.0"
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <SettingRow
              icon={<LogOut size={16} color={colors.textSecondary} />}
              label="Log Out"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>

      {/* Currency Picker Modal */}
      <RNModal
        visible={showCurrencyPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCurrencyPicker(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShowCurrencyPicker(false)}
          accessibilityLabel="Close currency picker"
          testID="currency-modal-backdrop"
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              width: '85%',
              maxHeight: 400,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            onPress={() => {}}
            accessibilityLabel="Currency picker"
            testID="currency-modal"
          >
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 17,
                color: colors.textPrimary,
                padding: 20,
                paddingBottom: 12,
              }}
            >
              Select Currency
            </Text>
            {CURRENCY_OPTIONS.map((opt) => (
              <Pressable
                key={opt.code}
                onPress={() => {
                  setCurrency(opt.code, opt.symbol);
                  setShowCurrencyPicker(false);
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  backgroundColor:
                    currency === opt.code ? colors.primaryFaint : 'transparent',
                  opacity: pressed ? 0.7 : 1,
                })}
                accessibilityLabel={`Select ${opt.name}`}
                testID={`currency-${opt.code}`}
              >
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 18,
                    color: colors.textPrimary,
                    width: 30,
                  }}
                >
                  {opt.symbol}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter_500Medium',
                    fontSize: 15,
                    color: colors.textPrimary,
                    flex: 1,
                    marginLeft: 8,
                  }}
                >
                  {opt.name}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 13,
                    color: colors.textSecondary,
                  }}
                >
                  {opt.code}
                </Text>
              </Pressable>
            ))}
            <View style={{ height: 16 }} />
          </Pressable>
        </Pressable>
      </RNModal>

      {/* Budget Modal */}
      <RNModal
        visible={showBudgetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBudgetModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShowBudgetModal(false)}
          accessibilityLabel="Close budget modal"
          testID="budget-modal-backdrop"
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              width: '85%',
              padding: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            onPress={() => {}}
            accessibilityLabel="Budget settings"
            testID="budget-modal"
          >
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 17,
                color: colors.textPrimary,
                marginBottom: 16,
              }}
            >
              Monthly Budget
            </Text>

            <Pressable
              onPress={() => {
                setBudgetEnabled(!budgetEnabled);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
              accessibilityLabel={`Budget tracking ${budgetEnabled ? 'enabled' : 'disabled'}`}
              testID="budget-toggle"
            >
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 15,
                  color: colors.textPrimary,
                }}
              >
                Enable Budget Tracking
              </Text>
              <View
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: budgetEnabled ? colors.primary : colors.border,
                  justifyContent: 'center',
                  padding: 2,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: '#FFFFFF',
                    alignSelf: budgetEnabled ? 'flex-end' : 'flex-start',
                  }}
                />
              </View>
            </Pressable>

            {budgetEnabled ? (
              <View>
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 13,
                    color: colors.textSecondary,
                    marginBottom: 8,
                  }}
                >
                  Monthly limit ({currencySymbol})
                </Text>
                <View
                  style={{
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Inter_600SemiBold',
                      fontSize: 20,
                      color: colors.textPrimary,
                    }}
                  >
                    {currencySymbol}{budgetLimit.toLocaleString()}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                  {[500, 1000, 2000, 5000].map((val) => (
                    <Pressable
                      key={val}
                      onPress={() => setBudgetLimit(val)}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor:
                          budgetLimit === val
                            ? colors.primaryMuted
                            : colors.surfaceElevated,
                        borderWidth: 1,
                        borderColor:
                          budgetLimit === val ? colors.primary : colors.border,
                        alignItems: 'center',
                      }}
                      accessibilityLabel={`Set budget to ${val}`}
                      testID={`budget-${val}`}
                    >
                      <Text
                        style={{
                          fontFamily: 'Inter_500Medium',
                          fontSize: 13,
                          color:
                            budgetLimit === val
                              ? colors.primary
                              : colors.textSecondary,
                        }}
                      >
                        {currencySymbol}{val.toLocaleString()}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            <Pressable
              onPress={() => setShowBudgetModal(false)}
              style={{
                marginTop: 20,
                backgroundColor: colors.primary,
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              }}
              accessibilityLabel="Save budget settings"
              testID="budget-save"
            >
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 15,
                  color: '#FFFFFF',
                }}
              >
                Done
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </RNModal>

      {/* Clear Confirm Modal */}
      <RNModal
        visible={showClearConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearConfirm(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShowClearConfirm(false)}
          accessibilityLabel="Close confirmation"
          testID="clear-modal-backdrop"
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              width: '85%',
              padding: 24,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
            }}
            onPress={() => {}}
            accessibilityLabel="Clear data confirmation"
            testID="clear-modal"
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.destructiveMuted,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Trash2 size={24} color={colors.destructive} />
            </View>
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 17,
                color: colors.textPrimary,
                marginBottom: 8,
              }}
            >
              Clear All Data?
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: 'center',
                marginBottom: 24,
              }}
            >
              This will permanently delete all your expenses and reset settings. This cannot be undone.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <Pressable
                onPress={() => setShowClearConfirm(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: colors.surfaceElevated,
                  alignItems: 'center',
                }}
                accessibilityLabel="Cancel clear data"
                testID="clear-cancel"
              >
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 15,
                    color: colors.textPrimary,
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  clearAllData();
                  setShowClearConfirm(false);
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                }}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: colors.destructive,
                  alignItems: 'center',
                }}
                accessibilityLabel="Confirm clear all data"
                testID="clear-confirm"
              >
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 15,
                    color: '#FFFFFF',
                  }}
                >
                  Clear All
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </RNModal>
    </View>
  );
}
