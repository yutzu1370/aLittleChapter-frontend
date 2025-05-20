import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合併 Tailwind 類名，解決衝突並保持優先級
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export * from './formatNumber'; 