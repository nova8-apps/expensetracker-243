// Theme constants for the expense tracker
export const colors = {
  // Core palette
  background: '#121212',
  surface: '#1E1E1E',
  surfaceElevated: '#252525',
  border: '#2A2A2A',
  borderLight: '#333333',

  // Brand
  primary: '#1DB584',
  primaryDark: '#17956D',
  primaryLight: '#24D69C',
  primaryMuted: 'rgba(29, 181, 132, 0.15)',
  primaryFaint: 'rgba(29, 181, 132, 0.08)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textTertiary: '#666666',
  textMuted: '#555555',

  // Semantic
  destructive: '#EF4444',
  destructiveMuted: 'rgba(239, 68, 68, 0.15)',
  warning: '#F59E0B',
  success: '#10B981',

  // Category colors
  categoryFood: '#FF6B6B',
  categoryTransport: '#4ECDC4',
  categoryEntertainment: '#FFE66D',
  categoryShopping: '#A78BFA',
  categoryBills: '#60A5FA',
  categoryHealth: '#F472B6',
  categoryOther: '#9CA3AF',
  categoryIncome: '#34D399',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
} as const;
