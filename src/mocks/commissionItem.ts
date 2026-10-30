// 假的可委託項目，給委託商店燈箱的委託項目列（CommissionItemOption）測試用。
// 形狀用 features/explore/types.ts 的 CommissionItem（對齊 COMMISSION_ITEM，欄位以 FigJam 為準）。
// 三筆刻意涵蓋：可商用／不可商用、說明很長會換行。
// 之後後端好了，改從 GET /creators/{creator_id}/commission-items 拿（api.md 草案），到時候只要改這個檔。

import type { CommissionItem } from '@/features/explore/types'

export const MOCK_COMMISSION_ITEMS: CommissionItem[] = [
  {
    item_id: 'ci_001',
    creator_id: 'moon_sketch',
    title: '頭像（肩膀以上）',
    description: '適合社群大頭貼使用，附透明背景 PNG。表情與服裝可指定，背景為單色。',
    price: 1500,
    commercial_allowed: true,
    stage_plan_pref: '三點分段',
    category_id: '3',
    purpose_id: '5',
    created_at: '2026-10-01T10:00:00+08:00',
  },
  {
    item_id: 'ci_002',
    creator_id: 'moon_sketch',
    title: 'Q 版貼圖（一套 8 張）',
    description: '8 張不同表情的 Q 版貼圖，尺寸符合 LINE 貼圖規格。僅限個人使用。',
    price: 3200,
    commercial_allowed: false,
    stage_plan_pref: '三點分段',
    category_id: '8',
    purpose_id: '1',
    created_at: '2026-10-03T15:30:00+08:00',
  },
  {
    item_id: 'ci_003',
    creator_id: 'moon_sketch',
    title: '角色立繪（全身含背景）',
    description:
      '全身角色立繪，含簡單場景背景，交付 PSD 分層檔與高解析 PNG。適合 VTuber 形象、遊戲角色設定或商業宣傳使用，委託前請先準備角色設定資料與參考圖，細節可在申請時補充說明。',
    price: 12000,
    commercial_allowed: true,
    stage_plan_pref: '五點分段',
    category_id: '1',
    purpose_id: '3',
    created_at: '2026-10-05T09:00:00+08:00',
  },
]
