// 首頁自訂標籤列的假資料（Figma 484:98 右側那 14 顆）。
// 欄位照 data-model.md 的 TAG：tag_id、name（全站唯一）；created_by_id 只供稽核，畫面用不到，先不放。
// name 不含 #，畫面顯示時再加。
// 首頁要顯示「哪些」標籤 spec 還沒定、後端也還沒有 API，先寫死這份；定案後只要改這個檔。

export const MOCK_TAGS = [
  { tag_id: '1', name: '厚塗' },
  { tag_id: '2', name: '半厚塗' },
  { tag_id: '3', name: '賽璐珞' },
  { tag_id: '4', name: '日系平塗' },
  { tag_id: '5', name: '水彩風' },
  { tag_id: '6', name: '手繪感' },
  { tag_id: '7', name: '黑白線稿' },
  { tag_id: '8', name: '精細線稿' },
  { tag_id: '9', name: '繽紛色彩' },
  { tag_id: '10', name: '高飽和' },
  { tag_id: '11', name: '柔和色調' },
  { tag_id: '12', name: '馬卡龍色' },
  { tag_id: '13', name: '復古配色' },
  { tag_id: '14', name: '膠卷氛圍' },
]
