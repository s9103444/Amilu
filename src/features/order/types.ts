// 案件狀態標籤用的狀態值。
// 前 6 個對應 ORDER.status（order-lifecycle.md），「待補款」「已補款待確認」「未完成」
// 來自 Figma，尚未確認是不是 ORDER.status 的值，見 spec/open-questions.md 第 9 題。
export type OrderStatusTagStatus =
  | 'awaiting-quote'
  | 'awaiting-payment'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'terminated'
  | 'awaiting-top-up'
  | 'top-up-pending-confirm'
  | 'incomplete'

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
