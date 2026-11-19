// order 功能的「後端呼叫」：頁面一律呼叫這裡，不直接 import mocks（structure.md 3.2）
// 現在是假的，後端好了改成呼叫 GET /orders?role=&phase=、GET /me（api.md 草案），頁面不用動
import { useAuthStore } from '@/features/account/store'
import { MOCK_ORDER_LIST } from '@/mocks/order'
import type { OrderListItem, OrderStatus } from '@/features/order/types'
import { MOCK_CREATOR_PROFILES } from '@/mocks/creatorProfile'

// 進行中／歷史怎麼分：features.md 3.7（歷史＝三種終態）
const ONGOING_STATUSES: OrderStatus[] = ['awaiting-quote', 'awaiting-payment', 'in-progress'] // 進行中的 3 種
const HISTORY_STATUSES: OrderStatus[] = ['completed', 'cancelled', 'terminated'] // 歷史的 3 種

// 【流程④-1：OrderManagementPage 切頁籤或打開時呼叫】回傳「我」在這個角色、這個階段的案件，新到舊
// role 是「我」的身分：commissioner ＝ 我委託的（已委託）、creator ＝ 我接的（已接案）
export async function fetchOrders(
  role: 'commissioner' | 'creator',
  phase: 'ongoing' | 'history',
): Promise<OrderListItem[]> {
  const me = useAuthStore().currentUser
  if (!me) return [] // 沒登入就沒有案件（之後 /me/* 會有路由守衛擋掉）
  const statuses = phase === 'ongoing' ? ONGOING_STATUSES : HISTORY_STATUSES

  return MOCK_ORDER_LIST.filter(
    (order) => (role === 'commissioner' ? order.commissioner_id : order.creator_id) === me.id,
  )
    .filter((order) => statuses.includes(order.status))
    .sort((a, b) => b.created_at.localeCompare(a.created_at)) // 新到舊
}

// 【流程⑤-1：OrderManagementPage 打開時呼叫】我有沒有開通創作者商店（之後改讀 GET /me 的 store_approved）
export async function fetchIsCreator(): Promise<boolean> {
  const me = useAuthStore().currentUser
  if (!me) return false
  const profile = MOCK_CREATOR_PROFILES.find((p) => p.user_id === me.id)
  return profile?.store_approved ?? false // 沒有這筆 ＝ 沒開通過
}
