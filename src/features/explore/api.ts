// explore 功能的「後端呼叫」：頁面要資料一律呼叫這裡，不直接 import mocks（structure.md 3.2）。
// 現在回傳假資料，後端好了只改這個檔，頁面不用動。
// 真正打後端的 shared/api/client.ts 還沒建（專案目前沒有），接後端時再建。
// 函式都用 async：現在假資料瞬間就有，之後真 API 要等回應；先回傳 Promise，頁面一律 await，換後端時寫法不變。
import type { Work, WorkImage } from '@/features/explore/types'
import { MOCK_WORKS, MOCK_WORK_IMAGES } from '@/mocks/work'

// 【首頁載入時由 HomePage 呼叫】作品牆的作品清單
// 對應 GET /works（api.md 草案）；篩選、分頁參數之後做篩選時再加
// 回傳複製品 [...]：真 API 每次都給新資料，頁面之後 push／刪除才不會改到 MOCK_WORKS 本身
export async function fetchWorks(): Promise<Work[]> {
  return [...MOCK_WORKS]
}

// 【首頁載入時由 HomePage 呼叫】作品圖片（頁面從裡面挑 seq_no 1 當封面）
// GET /works 會不會順便回傳封面，api.md 沒寫清楚，要跟後端確認；先拆成兩支
export async function fetchWorkImages(): Promise<WorkImage[]> {
  return [...MOCK_WORK_IMAGES]
}
