import React from 'react';
import { View } from 'react-native';
import {
  Utensils,
  Car,
  Tv,
  ShoppingBag,
  FileText,
  HeartPulse,
  MoreHorizontal,
} from 'lucide-react-native';
import type { ExpenseCategory } from '@/lib/demo-data';
import { getCategoryInfo } from '@/lib/demo-data';

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  utensils: Utensils,
  car: Car,
  tv: Tv,
  'shopping-bag': ShoppingBag,
  'file-text': FileText,
  'heart-pulse': HeartPulse,
  'more-horizontal': MoreHorizontal,
};

interface CategoryIconProps {
  category: ExpenseCategory;
  size?: number;
  showBackground?: boolean;
}

export function CategoryIcon({ category, size = 20, showBackground = true }: CategoryIconProps) {
  const info = getCategoryInfo(category);
  const IconComp = ICON_MAP[info.icon] ?? MoreHorizontal;

  if (!showBackground) {
    return <IconComp size={size} color={info.color} />;
  }

  return (
    <View
      style={{
        width: size * 2,
        height: size * 2,
        borderRadius: size * 0.6,
        backgroundColor: info.color + '20',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconComp size={size} color={info.color} />
    </View>
  );
}
