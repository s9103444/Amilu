// 假的案件聊天室資料，給聊天室視窗（ChatRoom）測試用。
// 訊息形狀用 features/order/types.ts 的 Message（對齊 MESSAGE）；使用者沿用 mocks/user.ts。
// 之後後端好了，訊息改從 GET /orders/{id}/messages 拿（api.md 草案），到時候只要改這個檔。

import type { Message } from '@/features/order/types'
import { MOCK_USERS } from '@/mocks/user'
import gameArt from '@/assets/purpose/game-art.webp'
import characterArt from '@/assets/category/character-art.webp'

// 目前登入的人（自己）和聊天的對象
const me = MOCK_USERS[0]!
const partner = MOCK_USERS[2]!

export const MOCK_CURRENT_USER_ID = me.id

// 聊天室標題列要的資料：對方是誰、哪個案件
// item_title_snapshot 是 ORDER 送出申請時複製的項目標題（契約快照），案件畫面一律讀這個
export const MOCK_CHAT_ORDER = {
  order_id: 'o_001',
  item_title_snapshot: '頭像（肩膀以上）',
  partner,
}

// 訊息依時間由舊到新排；刻意跨兩天，測日期分隔線
export const MOCK_MESSAGES: Message[] = [
  {
    message_id: 'm_001',
    order_id: 'o_001',
    sender_id: partner.id,
    content: '你好！草稿預計 10/11 前上傳，有想補充的參考圖可以直接傳在這裡～',
    image_url: null,
    created_at: '2026-10-09T14:02:00+08:00',
  },
  {
    message_id: 'm_002',
    order_id: 'o_001',
    sender_id: me.id,
    content: '好的，我補一張服裝參考',
    image_url: null,
    created_at: '2026-10-09T14:10:00+08:00',
  },
  {
    message_id: 'm_003',
    order_id: 'o_001',
    sender_id: me.id,
    content: '', // 只傳圖片
    image_url: characterArt,
    created_at: '2026-10-09T14:10:00+08:00',
  },
  {
    message_id: 'm_004',
    order_id: 'o_001',
    sender_id: partner.id,
    content: '收到！配色我先照這張來畫',
    image_url: null,
    created_at: '2026-10-09T14:25:00+08:00',
  },
  {
    message_id: 'm_005',
    order_id: 'o_001',
    sender_id: partner.id,
    content: '',
    image_url: gameArt,
    created_at: '2026-10-09T14:26:00+08:00',
  },
  // ── 隔天 ──
  {
    message_id: 'm_006',
    order_id: 'o_001',
    sender_id: me.id,
    content: '早安～想問背景可以改成淡藍色嗎？\n如果會加價也沒關係',
    image_url: null,
    created_at: '2026-10-10T09:05:00+08:00',
  },
  {
    message_id: 'm_007',
    order_id: 'o_001',
    sender_id: partner.id,
    content: '可以喔，不用加價，草稿會一起換上',
    image_url: null,
    created_at: '2026-10-10T09:40:00+08:00',
  },
]
