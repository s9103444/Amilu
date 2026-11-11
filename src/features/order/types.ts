// 案件狀態標籤用的狀態值。
// 前 6 個對應 ORDER.status（order-lifecycle.md）。「待補款」「已補款待確認」不存進 ORDER.status，
// 由頁面從 ORDER＋PAYMENT 算出來再傳（2026/11/9 決議，open-questions.md 第 9 題）。
export type OrderStatusTagStatus =
  | 'awaiting-quote'
  | 'awaiting-payment'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'terminated'
  | 'awaiting-top-up'
  | 'top-up-pending-confirm'

// ORDER_STAGE.stage_no：五點分段是 1～5，三點分段是 1／4／5，不遞補（data-model.md 4.2）
export type StageNo = 1 | 2 | 3 | 4 | 5

// MESSAGE：案件聊天室的一則訊息（data-model.md 2.4，欄位以 FigJam 為準）
// 一則最多 1 張圖；只傳圖片時 content 是空字串；沒有已讀欄位（聊天室不做已讀／未讀）
export type Message = {
  message_id: string
  order_id: string
  sender_id: string // 傳訊者的 USER.id；等於目前登入者就是「自己的訊息」
  content: string
  image_url: string | null
  created_at: string // ISO 時間字串
}

// ORDER.status：只有 6 個值（order-lifecycle.md 一）。
// 是 OrderStatusTagStatus 的一部分，所以可以直接傳給 OrderStatusTag；中文文字查 statusLabel.ts
export type OrderStatus =
  'awaiting-quote' | 'awaiting-payment' | 'in-progress' | 'completed' | 'cancelled' | 'terminated'

// ORDER：委託案件（data-model.md 2.3，欄位以 FigJam 為準），只列畫面用得到的欄位
// 「目前在哪個階段」不存在這裡，從 OrderStage 找第一個未確認的階段（data-model.md 5.1）
export type Order = {
  order_id: string
  creator_id: string // 創作者帳號 ID（＝USER.id），FK → CREATOR_PROFILE.user_id
  commissioner_id: string // 委託人的 USER.id
  item_title_snapshot: string // 契約快照：送出申請時的項目標題
  status: OrderStatus
  quote_amount: number // 委託總額（創作者報價）
  revision_count_snapshot: number // 契約快照：包含幾次修改
  stage_plan_snapshot: '三點分段' | '五點分段' // 契約快照：分段方案
  completed_at: string | null // 已完成的時間，還沒完成時是 null
  terminated_at: string | null // 終止的時間，沒被終止時是 null
}

// ORDER_STAGE：每個階段一列，五點分段 5 列、三點分段 3 列（stage_no 是 1／4／5）
export type OrderStage = {
  stage_id: string
  order_id: string
  stage_no: StageNo
  deadline: string // 'YYYY-MM-DD'
  confirm_status: '未確認' | '已確認' // 欄位表 2026/11/11 定案（data-model.md 第 6 節 #14）
}
