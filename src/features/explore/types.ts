// COMMISSION_ITEM：可委託項目（data-model.md 2.2，欄位以 FigJam ER 為準）
export type CommissionItem = {
  item_id: string
  creator_id: string // 指向 CREATOR_PROFILE
  title: string
  description: string
  price: number // 新台幣整數，畫面上才格式化成 NT$ 1,500
  commercial_allowed: boolean
  stage_plan_pref: '三點分段' | '五點分段'
  category_id: string | null // 可為空（data-model.md 5.3）
  purpose_id: string | null
  created_at: string // ISO 時間字串
}
