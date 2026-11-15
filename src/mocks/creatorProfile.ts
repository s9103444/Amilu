// 假的創作者接案設定（CREATOR_PROFILE），給燈箱判斷 Amilu 燈與「查看可委託項目」入口用。
// 一個帳號最多一份；沒有這筆＝沒開通過，不是創作者（data-model.md 1 對 0..1）。
// 欄位名稱以 FigJam 欄位表為準；只放燈箱用得到的欄位，收款帳戶、訂金比例（deposit_percent）、修改次數（revision_count）做到接案設定時再補。
// Amilu 燈對外顯示是衍生值，不存（data-model.md 5.1）：light_status 為「開放」＋ 至少 1 筆可委託項目 ＋ store_approved 三者同時成立才是「接案中」。
// 刻意涵蓋四種情況：
//   moon_sketch：三個條件都成立 → 接案中（MOCK_COMMISSION_ITEMS 三筆都是他的）
//   painter_01：已開通、手動關閉 → 暫不接案
//   im_temp_id：已開通、手動開放，但沒有可委託項目 → 暫不接案（開通時至少要 1 筆，這是模擬開通後把項目都刪光）
//   a_very_long_account_id_for_test：沒有這筆 → 不是創作者，燈箱不顯示委託入口
// 之後後端好了，改從 GET /users/{id}（api.md 草案）拿，到時候只要改這個檔。

export type CreatorProfile = {
  user_id: string // 創作者帳號 ID（＝USER.id），同時是 PK 與 FK
  store_approved: boolean // 是否已開通創作者商店
  light_status: '開放' | '暫停' // Amilu 燈手動開關，預設「開放」
}

export const MOCK_CREATOR_PROFILES: CreatorProfile[] = [
  { user_id: 'moon_sketch', store_approved: true, light_status: '開放' },
  { user_id: 'painter_01', store_approved: true, light_status: '暫停' },
  { user_id: 'im_temp_id', store_approved: true, light_status: '開放' },
]
