/*
日期格式化：把日期字串變成 Figma 的寫法，例：'2026-10-11' 或 '2026-10-11T23:59:00' → '2026 / 10 / 11'
只取前 10 個字（日期），時間不顯示。沒有日期時要顯示什麼，由元件自己決定
目前只有 order 用（延後共用）；其他功能也要用時再搬到 shared/utils/
使用：import { formatDate } from '@/features/order/formatDate'
*/
export function formatDate(date: string): string {
  return date.slice(0, 10).replaceAll('-', ' / ')
}
