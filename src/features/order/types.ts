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
