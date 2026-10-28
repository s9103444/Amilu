// 假通知與假對話，給 header 的通知中心（NotificationMenu）測試用。
// 欄位對齊 FigJam ER 圖的 NOTIFICATION、MESSAGE（spec/data-model.md 2.4），只取畫面用得到的欄位。
// 之後後端好了，改從 API 拿，到時候只要改這個檔。

import sampleAvatar from '@/assets/user/sample-avatar.png'

// NOTIFICATION：一筆站內通知
export type MockNotification = {
  notification_id: string
  category: '專案通知' | '系統公告'
  content: string
  is_read: boolean
  created_at: string // ISO 時間字串
}

// 對話頁籤的一列：某個案件聊天室裡「最新的一則訊息」＋「對方是誰」＋「哪個案件」
// message 的欄位對齊 MESSAGE；partner 的欄位對齊 USER（同 mocks/user.ts）
// item_title_snapshot 是 ORDER 送出申請時複製的項目標題（契約快照，CLAUDE.md），案件畫面一律讀這個
export type MockChatPreview = {
  order_id: string
  item_title_snapshot: string
  partner: {
    nickname: string
    avatar_url: string | null
  }
  message: {
    message_id: string
    content: string // 只傳圖片時是空字串，畫面改顯示「[圖片]」
    image_url: string | null
    created_at: string
  }
}

// 用「現在往前推多久」產生時間，測試頁每次打開都能看到「10 分鐘前」「昨天」這類文字
const MINUTE = 60 * 1000
const ago = (ms: number) => new Date(Date.now() - ms).toISOString()

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    notification_id: 'n_001',
    category: '專案通知',
    content: '乙方使用者暱稱 已上傳「頭像（肩膀以上）」第一階段稿件，請於 5 天內確認。',
    is_read: false,
    created_at: ago(10 * MINUTE),
  },
  {
    notification_id: 'n_002',
    category: '專案通知',
    content: '甲方使用者暱稱 已完成付款，委託「Q 版貼圖」正式開始。',
    is_read: false,
    created_at: ago(3 * 60 * MINUTE),
  },
  {
    notification_id: 'n_003',
    category: '專案通知',
    content: '系統已代為確認「Q 版貼圖」第二階段稿件。',
    is_read: true,
    created_at: ago(30 * 60 * MINUTE),
  },
  {
    notification_id: 'n_004',
    category: '系統公告',
    content: '平台將於週日凌晨 2:00～4:00 進行維護，期間暫停服務。',
    is_read: true,
    created_at: ago(40 * 24 * 60 * MINUTE),
  },
]

export const MOCK_CHAT_PREVIEWS: MockChatPreview[] = [
  {
    order_id: 'o_001',
    item_title_snapshot: '頭像（肩膀以上）',
    partner: { nickname: '使用者名稱', avatar_url: sampleAvatar },
    message: {
      message_id: 'm_101',
      content: '嗨嗨～您好，我現在準備好初稿了，麻煩您有空的時候看一下',
      image_url: null,
      created_at: ago(10 * MINUTE),
    },
  },
  {
    order_id: 'o_002',
    item_title_snapshot: 'Q 版貼圖（一套 8 張）',
    partner: { nickname: '小畫家', avatar_url: null },
    message: {
      message_id: 'm_102',
      content: '', // 只傳了一張圖
      image_url: sampleAvatar,
      created_at: ago(30 * 60 * MINUTE),
    },
  },
]
