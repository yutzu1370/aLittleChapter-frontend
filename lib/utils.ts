import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 將數字格式化為貨幣顯示格式
 * @param price 價格數字
 * @returns 格式化後的價格字串
 */
export function formatPrice(price: number): string {
  return `NT$ ${price.toLocaleString('zh-TW')}`;
}
