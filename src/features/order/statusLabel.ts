import type { OrderStatusTagStatus } from './types'

export const ORDER_STATUS_LABEL: Record<OrderStatusTagStatus, string> = {
  'awaiting-quote': '待乙方報價',
  'awaiting-payment': '待甲方付款',
  'in-progress': '製作中',
  completed: '已完成',
  cancelled: '已取消',
  terminated: '已終止',
  'awaiting-top-up': '待補款',
  'top-up-pending-confirm': '已補款待確認',
  incomplete: '未完成',
}

// 色調：對應 Figma「案件狀態標籤」的底色，橘＝等待某一方動作、藍＝進行中、綠＝完成、灰＝已結束
export type OrderStatusTone = 'waiting' | 'progress' | 'done' | 'closed' | 'incomplete'

export const ORDER_STATUS_TONE: Record<OrderStatusTagStatus, OrderStatusTone> = {
  'awaiting-quote': 'waiting',
  'awaiting-payment': 'waiting',
  'awaiting-top-up': 'waiting',
  'top-up-pending-confirm': 'waiting',
  'in-progress': 'progress',
  completed: 'done',
  cancelled: 'closed',
  terminated: 'closed',
  incomplete: 'incomplete',
}
