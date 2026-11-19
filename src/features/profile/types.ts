// 接案設定（CREATOR_PROFILE，data-model.md；欄位以 FigJam 欄位表為準，2026/11/19 彥廷提供）
// GET /me/creator-settings 的回應形狀；頁面只認這個型別，不直接 import mocks
export type DepositPercent = '30%' | '50%' | '無需先支付'
export type LightStatus = '開放' | '暫停'

export type CreatorSettings = {
  user_id: string // 創作者帳號 ID（＝USER.id）
  payout_bank_code: string // 收款銀行代碼，CHAR(3)
  payout_account_no: string // 收款帳號，最多 20 字
  payout_account_name: string // 收款戶名，最多 50 字
  deposit_percent: DepositPercent // 訂金比例
  revision_count: number // 每筆委託包含的修改次數（只是寫進契約的宣告，系統不計次）
  light_status: LightStatus // Amilu 燈手動開關
  store_approved: boolean // 是否已開通創作者商店（唯讀，系統判斷）
}
