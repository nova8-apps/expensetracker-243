import { colors } from './theme';

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Health'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO 8601
  note: string;
  createdAt: string;
}

export interface CategoryInfo {
  name: ExpenseCategory;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { name: 'Food', icon: 'utensils', color: colors.categoryFood },
  { name: 'Transport', icon: 'car', color: colors.categoryTransport },
  { name: 'Entertainment', icon: 'tv', color: colors.categoryEntertainment },
  { name: 'Shopping', icon: 'shopping-bag', color: colors.categoryShopping },
  { name: 'Bills', icon: 'file-text', color: colors.categoryBills },
  { name: 'Health', icon: 'heart-pulse', color: colors.categoryHealth },
  { name: 'Other', icon: 'more-horizontal', color: colors.categoryOther },
];

export function getCategoryInfo(name: ExpenseCategory): CategoryInfo {
  return CATEGORIES.find(c => c.name === name) ?? CATEGORIES[6];
}

// Helper to create a date string N days ago
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const SEED_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 15.50,
    category: 'Food',
    date: daysAgo(0),
    note: 'Lunch at Chipotle',
    createdAt: daysAgo(0),
  },
  {
    id: '2',
    amount: 8.00,
    category: 'Transport',
    date: daysAgo(1),
    note: 'Uber to downtown',
    createdAt: daysAgo(1),
  },
  {
    id: '3',
    amount: 25.00,
    category: 'Entertainment',
    date: daysAgo(2),
    note: 'Movie tickets',
    createdAt: daysAgo(2),
  },
  {
    id: '4',
    amount: 42.30,
    category: 'Shopping',
    date: daysAgo(2),
    note: 'New headphones',
    createdAt: daysAgo(2),
  },
  {
    id: '5',
    amount: 89.99,
    category: 'Bills',
    date: daysAgo(3),
    note: 'Internet bill',
    createdAt: daysAgo(3),
  },
  {
    id: '6',
    amount: 34.50,
    category: 'Food',
    date: daysAgo(3),
    note: 'Groceries at Trader Joe\'s',
    createdAt: daysAgo(3),
  },
  {
    id: '7',
    amount: 12.00,
    category: 'Transport',
    date: daysAgo(4),
    note: 'Gas station',
    createdAt: daysAgo(4),
  },
  {
    id: '8',
    amount: 65.00,
    category: 'Health',
    date: daysAgo(5),
    note: 'Gym membership',
    createdAt: daysAgo(5),
  },
  {
    id: '9',
    amount: 18.75,
    category: 'Food',
    date: daysAgo(5),
    note: 'Coffee beans',
    createdAt: daysAgo(5),
  },
  {
    id: '10',
    amount: 120.00,
    category: 'Shopping',
    date: daysAgo(6),
    note: 'Running shoes',
    createdAt: daysAgo(6),
  },
  {
    id: '11',
    amount: 9.99,
    category: 'Entertainment',
    date: daysAgo(7),
    note: 'Netflix subscription',
    createdAt: daysAgo(7),
  },
  {
    id: '12',
    amount: 22.40,
    category: 'Food',
    date: daysAgo(8),
    note: 'Sushi dinner',
    createdAt: daysAgo(8),
  },
  {
    id: '13',
    amount: 45.00,
    category: 'Bills',
    date: daysAgo(10),
    note: 'Phone bill',
    createdAt: daysAgo(10),
  },
  {
    id: '14',
    amount: 7.50,
    category: 'Transport',
    date: daysAgo(11),
    note: 'Parking meter',
    createdAt: daysAgo(11),
  },
  {
    id: '15',
    amount: 55.00,
    category: 'Other',
    date: daysAgo(12),
    note: 'Birthday gift for Alex',
    createdAt: daysAgo(12),
  },
];

export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
