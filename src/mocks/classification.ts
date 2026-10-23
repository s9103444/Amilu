// 作品類型、用途各 10 個選項（內容照 spec/features.md 第 0 節）。
// 之後後端好了會改從 GET /categories、GET /purposes 拿，到時候只要改這個檔。
// value ＝ 資料表的 id（category_id／purpose_id），label ＝ 畫面上顯示的名稱。

export const CATEGORY_OPTIONS = [
  { value: '1', label: '角色立繪' },
  { value: '2', label: '插畫' },
  { value: '3', label: '頭像／大頭貼' },
  { value: '4', label: 'Live2D' },
  { value: '5', label: '漫畫' },
  { value: '6', label: '概念設定' },
  { value: '7', label: '場景／背景' },
  { value: '8', label: 'Q版貼圖' },
  { value: '9', label: '表情差分' },
  { value: '10', label: '3D 建模' },
]

export const PURPOSE_OPTIONS = [
  { value: '1', label: '個人收藏' },
  { value: '2', label: '商業授權' },
  { value: '3', label: 'VTuber 用途' },
  { value: '4', label: '遊戲美術' },
  { value: '5', label: '社群媒體' },
  { value: '6', label: '出版品' },
  { value: '7', label: '周邊商品' },
  { value: '8', label: '同人誌' },
  { value: '9', label: '品牌識別' },
  { value: '10', label: '直播素材' },
]
