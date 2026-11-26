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

// 上傳燈箱的一張圖：file 送出用、url 預覽用
// 新選的圖：file 是使用者電腦裡的檔案、url 是 blob: 暫時網址；編輯時帶入的舊圖：已經在伺服器上，file 是 null、url 是一般網址
export type UploadImage = { file: File | null; url: string }

// 編輯一般作品時，燈箱要填回表單的原內容（fetchWorkForEdit 回傳）
// 欄位名稱沿用 WORK（data-model.md）；類型、用途沒選是 null，燈箱填回時轉成 ''
export type WorkEditData = {
  title: string
  content: string
  category_id: string | null
  purpose_id: string | null
  images: string[] // 圖片網址，依 seq_no 排好，第一張是封面
  tags: string[] // 標籤名稱
}

// 編輯可委託項目時，燈箱要填回表單的原內容（fetchCommissionItemForEdit 回傳）
// 欄位名稱沿用 COMMISSION_ITEM（data-model.md）；price、commercial_allowed 是資料庫的型別，燈箱填回時再轉成表單用的字串
export type CommissionItemEditData = {
  title: string
  description: string
  price: number // 新台幣整數
  commercial_allowed: boolean
  stage_plan_pref: '三點分段' | '五點分段'
  category_id: string | null
  purpose_id: string | null
  images: string[] // 圖片網址，依 seq_no 排好，第一張是封面
  tags: string[] // 標籤名稱
}

// 送出一般作品的資料（POST /works，api.md 5.9）；欄位名稱沿用 WORK
export type NewWork = {
  title: string
  content: string
  category_id: string | null // 沒選是 null
  purpose_id: string | null
  tags: string[] // 標籤文字
  images: File[] // 只放檔案；順序就是 seq_no，第一張是封面
}

// 編輯一般作品送出的資料（PATCH /works/{id}，api.md 5.9）：新增的全部欄位＋留下的舊圖（& 是把兩個型別的欄位合在一起）
// images 只放這次新加的檔案；和 WorkEditData 方向相反：那包是拿回來填表單，這包是改完送出去
export type WorkChanges = NewWork & {
  kept_image_urls: string[] // 留下的舊圖網址，照畫面順序；不在這裡的舊圖後端會刪掉
}

// 送出可委託項目的資料（POST /commission-items，api.md 5.9）；欄位名稱沿用 COMMISSION_ITEM
export type NewCommissionItem = {
  title: string
  description: string
  price: number // 新台幣整數；表單是字串，送出前轉數字
  commercial_allowed: boolean // 表單是 'true'／'false'，送出前轉布林
  stage_plan_pref: '三點分段' | '五點分段'
  category_id: string | null // 沒選是 null
  purpose_id: string | null
  tags: string[] // 標籤文字
  images: File[] // 只放檔案；順序就是 seq_no，第一張是封面
}

// 編輯可委託項目送出的資料（PATCH /commission-items/{id}，api.md 5.9）：同 WorkChanges，新增的全部欄位＋留下的舊圖
export type CommissionItemChanges = NewCommissionItem & {
  kept_image_urls: string[] // 留下的舊圖網址，照畫面順序；不在這裡的舊圖後端會刪掉
}
