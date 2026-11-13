// COMMISSION_ITEM：可委託項目（data-model.md 2.2，欄位以 FigJam ER 為準）
export type CommissionItem = {
  item_id: string
  creator_id: string // 創作者帳號 ID（＝USER.id），FK → CREATOR_PROFILE.user_id
  title: string
  description: string
  price: number // 新台幣整數，畫面上才格式化成 NT$ 1,500
  commercial_allowed: boolean
  stage_plan_pref: '三點分段' | '五點分段'
  category_id: string | null // 可為空（data-model.md 5.3）
  purpose_id: string | null
  created_at: string // ISO 時間字串
}
export type CommissionItemImage = {
  item_id: string
  seq_no: number
  image_url: string
}

// WORK：一般作品（data-model.md 2.2）；封面不在這張表，取 WORK_IMAGE 的 seq_no 1
export type Work = {
  work_id: string
  user_id: string // 作者帳號 ID（＝USER.id），不需開通商店也能發
  title: string
  content: string // 作品說明
  category_id: string | null // 欄位一定有，值可為空（同 CommissionItem）
  purpose_id: string | null
  created_at: string // ISO 時間字串
}
// WORK_IMAGE：作品圖片，一件作品 1～20 張；seq_no 兼顯示順序，1 是封面
export type WorkImage = {
  work_id: string
  seq_no: number
  image_url: string
}
//WORK_TAG：作品與標籤的中介表（多對多）
export type WorkTag = {
  work_id: string
  tag_id: string
}
export type CommissionItemTag = {
  item_id: string
  tag_id: string
}
export type GalleryCard = {
  id: string
  type: 'work' | 'commission-item'
  image_url: string
  title: string
  author_id: string
  created_at: string
}
