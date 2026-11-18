// 假的案件聊天室資料，給聊天室視窗（ChatRoom）測試用。
// 訊息形狀用 features/order/types.ts 的 Message（對齊 MESSAGE）；使用者沿用 mocks/user.ts。
// 之後後端好了，訊息改從 GET /orders/{id}/messages 拿（api.md 草案），到時候只要改這個檔。
// 訂單與階段給委託討論牆左欄（OrderSidePanel）測試用。

import type { Message, Order, OrderListItem, OrderStage } from '@/features/order/types'
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

// 製作中、五點分段、卡在草稿（Figma 616:398）
export const MOCK_ORDER_IN_PROGRESS: Order = {
  order_id: 'o_001', // 跟聊天室同一筆
  creator_id: 'moon_sketch',
  commissioner_id: me.id,
  item_title_snapshot: '頭像（肩膀以上）',
  status: 'in-progress',
  quote_amount: 1800,
  revision_count_snapshot: 2,
  stage_plan_snapshot: '五點分段',
  created_at: '2026-10-01T10:00:00+08:00',
  completed_at: null,
  terminated_at: null,
}
export const MOCK_STAGES_IN_PROGRESS: OrderStage[] = [
  {
    stage_id: 's_001',
    order_id: 'o_001',
    stage_no: 1,
    deadline: '2026-10-11',
    confirm_status: '未確認',
  },
  {
    stage_id: 's_002',
    order_id: 'o_001',
    stage_no: 2,
    deadline: '2026-10-13',
    confirm_status: '未確認',
  },
  {
    stage_id: 's_003',
    order_id: 'o_001',
    stage_no: 3,
    deadline: '2026-10-20',
    confirm_status: '未確認',
  },
  {
    stage_id: 's_004',
    order_id: 'o_001',
    stage_no: 4,
    deadline: '2026-10-31',
    confirm_status: '未確認',
  },
  {
    stage_id: 's_005',
    order_id: 'o_001',
    stage_no: 5,
    deadline: '2026-11-05',
    confirm_status: '未確認',
  },
]

// 製作中、三點分段、卡在精稿：stage_no 是 1／4／5（不遞補），草稿已確認，所以目前階段是 4
export const MOCK_ORDER_THREE_STAGE: Order = {
  order_id: 'o_002',
  creator_id: 'moon_sketch',
  commissioner_id: me.id,
  item_title_snapshot: '頭像（肩膀以上）',
  status: 'in-progress',
  quote_amount: 1800,
  revision_count_snapshot: 2,
  stage_plan_snapshot: '三點分段',
  created_at: '2026-09-28T15:30:00+08:00',
  completed_at: null,
  terminated_at: null,
}

export const MOCK_STAGES_THREE_STAGE: OrderStage[] = [
  {
    stage_id: 's_006',
    order_id: 'o_002',
    stage_no: 1,
    deadline: '2026-10-11',
    confirm_status: '已確認',
  },
  {
    stage_id: 's_007',
    order_id: 'o_002',
    stage_no: 4,
    deadline: '2026-10-25',
    confirm_status: '未確認',
  },
  {
    stage_id: 's_008',
    order_id: 'o_002',
    stage_no: 5,
    deadline: '2026-11-05',
    confirm_status: '未確認',
  },
]

// 已完成、五點分段（Figma 616:460）：全部階段已確認，結案時間看 completed_at
export const MOCK_ORDER_COMPLETED: Order = {
  order_id: 'o_003',
  creator_id: 'moon_sketch',
  commissioner_id: me.id,
  item_title_snapshot: '頭像（肩膀以上）',
  status: 'completed',
  quote_amount: 1800,
  revision_count_snapshot: 2,
  stage_plan_snapshot: '五點分段',
  created_at: '2026-09-20T11:00:00+08:00',
  completed_at: '2026-10-30T18:00:00+08:00',
  terminated_at: null,
}

export const MOCK_STAGES_COMPLETED: OrderStage[] = [
  {
    stage_id: 's_009',
    order_id: 'o_003',
    stage_no: 1,
    deadline: '2026-10-05',
    confirm_status: '已確認',
  },
  {
    stage_id: 's_010',
    order_id: 'o_003',
    stage_no: 2,
    deadline: '2026-10-10',
    confirm_status: '已確認',
  },
  {
    stage_id: 's_011',
    order_id: 'o_003',
    stage_no: 3,
    deadline: '2026-10-15',
    confirm_status: '已確認',
  },
  {
    stage_id: 's_012',
    order_id: 'o_003',
    stage_no: 4,
    deadline: '2026-10-20',
    confirm_status: '已確認',
  },
  {
    stage_id: 's_013',
    order_id: 'o_003',
    stage_no: 5,
    deadline: '2026-10-28',
    confirm_status: '已確認',
  },
]

// ── 約稿管理列表用（features.md 3.7）──
// 以 me（im_temp_id）為主角：前半是「我委託別人」，後半是「別人委託我」，六種狀態都至少出現一次
// created_at 刻意錯開，測排序（新到舊）

// 已委託｜進行中：待報價，還沒有報價金額
export const MOCK_ORDER_AWAITING_QUOTE: Order = {
  order_id: 'o_004',
  creator_id: 'painter_01',
  commissioner_id: me.id,
  item_title_snapshot: '全身立繪',
  status: 'awaiting-quote',
  quote_amount: null,
  revision_count_snapshot: 2,
  stage_plan_snapshot: '五點分段',
  created_at: '2026-10-12T09:20:00+08:00',
  completed_at: null,
  terminated_at: null,
}

// 已委託｜歷史：契約成立前取消
export const MOCK_ORDER_CANCELLED: Order = {
  order_id: 'o_005',
  creator_id: 'painter_01',
  commissioner_id: me.id,
  item_title_snapshot: 'Q版貼圖 8 張',
  status: 'cancelled',
  quote_amount: 2400,
  revision_count_snapshot: 1,
  stage_plan_snapshot: '三點分段',
  created_at: '2026-09-10T20:00:00+08:00',
  completed_at: null,
  terminated_at: null,
}

// 已接案｜進行中：我報價了，等委託人付款
export const MOCK_ORDER_RECEIVED_AWAITING_PAYMENT: Order = {
  order_id: 'o_006',
  creator_id: me.id,
  commissioner_id: 'painter_01',
  item_title_snapshot: '頭像（肩膀以上）',
  status: 'awaiting-payment',
  quote_amount: 1500,
  revision_count_snapshot: 2,
  stage_plan_snapshot: '三點分段',
  created_at: '2026-10-14T13:00:00+08:00',
  completed_at: null,
  terminated_at: null,
}

// 已接案｜進行中：製作中
export const MOCK_ORDER_RECEIVED_IN_PROGRESS: Order = {
  order_id: 'o_007',
  creator_id: me.id,
  commissioner_id: 'moon_sketch',
  item_title_snapshot: '全身立繪',
  status: 'in-progress',
  quote_amount: 4500,
  revision_count_snapshot: 3,
  stage_plan_snapshot: '五點分段',
  created_at: '2026-10-03T16:45:00+08:00',
  completed_at: null,
  terminated_at: null,
}

// 已接案｜歷史：終止合作
export const MOCK_ORDER_RECEIVED_TERMINATED: Order = {
  order_id: 'o_008',
  creator_id: me.id,
  commissioner_id: 'moon_sketch',
  item_title_snapshot: 'Q版貼圖 8 張',
  status: 'terminated',
  quote_amount: 2400,
  revision_count_snapshot: 1,
  stage_plan_snapshot: '三點分段',
  created_at: '2026-08-25T10:10:00+08:00',
  completed_at: null,
  terminated_at: '2026-09-15T18:00:00+08:00',
}

// 全部案件（沒排序、沒篩選）：order/api.ts 從這裡挑出要的
export const MOCK_ORDERS: Order[] = [
  MOCK_ORDER_IN_PROGRESS,
  MOCK_ORDER_THREE_STAGE,
  MOCK_ORDER_COMPLETED,
  MOCK_ORDER_AWAITING_QUOTE,
  MOCK_ORDER_CANCELLED,
  MOCK_ORDER_RECEIVED_AWAITING_PAYMENT,
  MOCK_ORDER_RECEIVED_IN_PROGRESS,
  MOCK_ORDER_RECEIVED_TERMINATED,
]

// ── 約稿管理列表的回應（GET /orders，api.md 2.3 草案）──
// 假裝是後端組好的：ORDER ＋ 雙方 USER 摘要 ＋ 付款期限 ＋ 目前階段

// 付款期限（PAYMENT.due_at）：只有待付款、且已產生虛擬帳號的案件有
const PAYMENT_DUE_AT: Record<string, string> = {
  o_006: '2026-10-17T13:00:00+08:00',
}

// 目前階段（第一個未確認的階段）：只有製作中的案件有
const CURRENT_STAGE: Record<string, OrderListItem['current_stage']> = {
  o_001: { stage_no: 1, deadline: '2026-10-11' }, // 同 MOCK_STAGES_IN_PROGRESS
  o_002: { stage_no: 4, deadline: '2026-10-25' }, // 同 MOCK_STAGES_THREE_STAGE（草稿已確認）
  o_007: { stage_no: 3, deadline: '2026-10-24' },
}

function toParty(userId: string) {
  const user = MOCK_USERS.find((u) => u.id === userId)!
  return { id: user.id, nickname: user.nickname, avatar_url: user.avatar_url }
}

export const MOCK_ORDER_LIST: OrderListItem[] = MOCK_ORDERS.map((order) => ({
  ...order,
  creator: toParty(order.creator_id),
  commissioner: toParty(order.commissioner_id),
  payment_due_at: PAYMENT_DUE_AT[order.order_id] ?? null,
  current_stage: CURRENT_STAGE[order.order_id] ?? null,
}))
