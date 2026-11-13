// explore 功能的「後端呼叫」：頁面要資料一律呼叫這裡，不直接 import mocks（structure.md 3.2）。
// 現在回傳假資料，後端好了只改這個檔，頁面不用動。
// 真正打後端的 shared/api/client.ts 還沒建（專案目前沒有），接後端時再建。
// 函式都用 async：現在假資料瞬間就有，之後真 API 要等回應；先回傳 Promise，頁面一律 await，換後端時寫法不變。
import type { CommissionItem, CommissionItemImage, Work, WorkImage } from '@/features/explore/types'
import {
  MOCK_COMMISSION_ITEMS,
  MOCK_COMMISSION_ITEM_TAGS,
  MOCK_COMMISSION_ITEM_IMAGES,
} from '@/mocks/commissionItem'
import { MOCK_WORKS, MOCK_WORK_IMAGES, MOCK_WORK_TAGS } from '@/mocks/work'
// 參數名稱 api.md 沒寫，要跟後端確認
export type WorkFilter = {
  category: string
  purpose: string
  tag_ids: string[]
}

// 【首頁載入時由 HomePage 呼叫】作品牆的作品清單
// 對應 GET /works（api.md 草案）；篩選、分頁參數之後做篩選時再加
export async function fetchWorks(filter: WorkFilter): Promise<Work[]> {
  return MOCK_WORKS.filter((work) => {
    const categoryOk = filter.category === '' || work.category_id === filter.category
    const purposeOk = filter.purpose === '' || work.purpose_id === filter.purpose
    const workTagIds = MOCK_WORK_TAGS.filter((row) => row.work_id === work.work_id).map(
      (row) => row.tag_id,
    )
    const tagsOk = filter.tag_ids.every((tagId) => workTagIds.includes(tagId))

    return categoryOk && purposeOk && tagsOk
  })
}

// 【首頁載入時由 HomePage 呼叫】作品圖片（頁面從裡面挑 seq_no 1 當封面）
// GET /works 會不會順便回傳封面，api.md 沒寫清楚，要跟後端確認；先拆成兩支
export async function fetchWorkImages(): Promise<WorkImage[]> {
  return [...MOCK_WORK_IMAGES]
}

// 【頁面掛上後、篩選值改變時由 HomePage 的 loadWorks 呼叫】作品牆的可委託項目清單，篩選規則同 fetchWorks
// 對應 GET /commission-items（api.md 草案）；參數名稱待跟後端確認；Amilu 燈過濾之後補
export async function fetchCommissionItems(filter: WorkFilter): Promise<CommissionItem[]> {
  return MOCK_COMMISSION_ITEMS.filter((item) => {
    const categoryOk = filter.category === '' || item.category_id === filter.category
    const purposeOk = filter.purpose === '' || item.purpose_id === filter.purpose
    const itemTagIds = MOCK_COMMISSION_ITEM_TAGS.filter((row) => row.item_id === item.item_id).map(
      (row) => row.tag_id,
    )
    const tagsOk = filter.tag_ids.every((tagId) => itemTagIds.includes(tagId))

    return categoryOk && purposeOk && tagsOk
  })
}

// 【頁面掛上後、篩選值改變時由 HomePage 的 loadWorks 呼叫】可委託項目圖片（頁面挑 seq_no 1 當封面）
// 同 fetchWorkImages，會不會跟清單一起回傳要跟後端確認
export async function fetchCommissionImages(): Promise<CommissionItemImage[]> {
  return [...MOCK_COMMISSION_ITEM_IMAGES]
}
