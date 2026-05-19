import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED_EXPENSES, type Expense, type ExpenseCategory } from './demo-data';

interface AppState {
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;

  // Settings
  currency: string;
  currencySymbol: string;
  setCurrency: (code: string, symbol: string) => void;
  budgetLimit: number;
  budgetEnabled: boolean;
  setBudgetLimit: (limit: number) => void;
  setBudgetEnabled: (enabled: boolean) => void;

  // Onboarding
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;

  // Premium (mock)
  isPremium: boolean;

  // Clear all
  clearAllData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      expenses: SEED_EXPENSES,
      addExpense: (expense: Expense) =>
        set((s) => ({ expenses: [expense, ...s.expenses] })),
      deleteExpense: (id: string) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      currency: 'USD',
      currencySymbol: '$',
      setCurrency: (code: string, symbol: string) =>
        set({ currency: code, currencySymbol: symbol }),
      budgetLimit: 2000,
      budgetEnabled: false,
      setBudgetLimit: (limit: number) => set({ budgetLimit: limit }),
      setBudgetEnabled: (enabled: boolean) => set({ budgetEnabled: enabled }),

      hasSeenOnboarding: false,
      setHasSeenOnboarding: (seen: boolean) => set({ hasSeenOnboarding: seen }),

      isPremium: false,

      clearAllData: () =>
        set({
          expenses: [],
          currency: 'USD',
          currencySymbol: '$',
          budgetLimit: 2000,
          budgetEnabled: false,
        }),
    }),
    {
      name: 'expense-tracker-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
