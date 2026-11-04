// 假的案件聊天室資料，給聊天室視窗（ChatRoom）測試用。
// 訊息形狀用 features/order/types.ts 的 Message（對齊 MESSAGE）；使用者沿用 mocks/user.ts。
// 之後後端好了，訊息改從 GET /orders/{id}/messages 拿（api.md 草案），到時候只要改這個檔。
// 訂單與階段給委託討論牆左欄（OrderSidePanel）測試用。

import type { Message, Order, OrderStage } from '@/features/order/types'
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
