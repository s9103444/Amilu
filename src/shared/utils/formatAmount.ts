/*
金額格式化：把數字變成畫面上顯示的價格文字，例：1800 → 'NT$ 1,800'
純函式，不用 ref／computed；元件要包成 computed 時在元件裡包
使用：import { formatAmount } from '@/shared/utils/formatAmount'
*/
export function formatAmount(n: number): string {
  return `NT$ ${n.toLocaleString('zh-TW')}`
}
