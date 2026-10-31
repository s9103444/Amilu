// 開通創作者商店的三步驟（features.md 3.4）。這裡只放不會變的文字，
// 每個人不同的部分（完成了沒、Step1 的手機號碼）由清單卡補上。

// 按鈕被點時，用 key 告訴頁面是哪一步，頁面再決定要去哪
export type ActivationStepKey = 'verify' | 'settings' | 'commission-item'

export type ActivationStep = {
  key: ActivationStepKey
  number: number // 左邊圓圈裡的數字，標題前的「Step1」也由元件用它拼出來
  title: string
  note?: string // Step1 沒有：要用手機號碼拼，由清單卡組好再傳進元件
}

export const ACTIVATION_STEPS: ActivationStep[] = [
  { key: 'verify', number: 1, title: '手機驗證' },
  {
    key: 'settings',
    number: 2,
    title: '接案設定',
    note: '填寫收款帳戶、訂金比例、修改次數與 Amilu 燈',
  },
  {
    key: 'commission-item',
    number: 3,
    title: '新增委託項目',
    note: '至少新增 1 筆委託項目（圖片、標題與說明、價格）；按「前往填寫」開啟新增委託項目燈箱',
  },
]
