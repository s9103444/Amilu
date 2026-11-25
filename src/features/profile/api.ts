// profile 功能的「後端呼叫」：頁面一律呼叫這裡，不直接 import mocks（structure.md 3.2）
// 現在是假的，後端好了改成呼叫 PATCH /me/profile、DELETE /me、GET／PATCH /me/creator-settings、PATCH /me/creator-settings/amilu-light、GET /works/{id}、GET /commission-items/{id}、POST /works、POST /commission-items（api.md 草案），頁面不用動
import { useAuthStore } from '@/features/account/store'
import { MOCK_ORDER_IN_PROGRESS, MOCK_ORDER_THREE_STAGE, MOCK_ORDER_COMPLETED } from '@/mocks/order'
import { MOCK_CREATOR_PROFILES } from '@/mocks/creatorProfile'
import type {
  CreatorSettings,
  LightStatus,
  WorkEditData,
  CommissionItemEditData,
  NewWork,
  NewCommissionItem,
} from '@/features/profile/types'
import { MOCK_WORKS, MOCK_WORK_IMAGES, MOCK_WORK_TAGS } from '@/mocks/work'
import { MOCK_TAGS } from '@/mocks/tag'
import {
  MOCK_COMMISSION_ITEMS,
  MOCK_COMMISSION_ITEM_IMAGES,
  MOCK_COMMISSION_ITEM_TAGS,
} from '@/mocks/commissionItem'

// 送出的個人資料（features.md 3.1）：大頭照是使用者選的檔案，null ＝ 這次沒換
// 不放帳號 ID：後端從登入 token 就知道是誰在改
// 後端好了這包要用 multipart/form-data 送（有檔案，api.md 5.2）
export type ProfileChanges = {
  nickname: string
  bio: string | null // 沒填送 null，和 USER.bio 一致
  avatar: File | null
}

// 後端回傳存好的值：大頭照變成存好的網址；沒換大頭照就沒有 avatar_url（寫回登入者時不會蓋掉舊的）
export type ProfileResult = {
  nickname: string
  bio: string | null
  avatar_url?: string | null
}

// 【流程③-1：ProfileSettingsPage 檢查暱稱通過後呼叫】回傳後端存好的值
// 假資料：暱稱、簡介原樣回傳；有新大頭照就用 createObjectURL 產生網址，假裝是後端存好的位置（重新整理後失效）
export async function updateProfile(changes: ProfileChanges): Promise<ProfileResult> {
  const result: ProfileResult = { nickname: changes.nickname, bio: changes.bio }
  if (changes.avatar) {
    result.avatar_url = URL.createObjectURL(changes.avatar)
  }
  return result
}

// 刪除帳號的假資料：所有假案件，以及會擋住刪除的三種進行中狀態（features.md 3.1；已完成、已取消、已終止不擋）
const orderList = [MOCK_ORDER_IN_PROGRESS, MOCK_ORDER_THREE_STAGE, MOCK_ORDER_COMPLETED]
const ACTIVE_STATUSES = ['awaiting-quote', 'awaiting-payment', 'in-progress']

// 【流程④-2：DeleteProfileLightbox 按「確認刪除」時呼叫】能刪就刪、回傳 ok: true；不能刪回傳 ok: false
// 真正的 DELETE /me 由後端判斷並軟刪除（account_status 改「已刪除」）；假資料只判斷，不改 MOCK_USERS
// 不帶參數：後端從登入 token 知道是誰，所以假資料改讀登入者
export async function deleteAccount() {
  const user = useAuthStore().currentUser
  // 帳號「鎖定」＝結算後還有應補付沒付，也就是「尚未補齊的款項」（order-lifecycle.md 鎖帳號）
  if (user?.account_status === '鎖定') {
    return { ok: false }
  }
  // 自己是委託人或創作者，且案件還在進行中
  const hasActiveOrder = orderList.some(
    (order) =>
      (order.commissioner_id === user?.id || order.creator_id === user?.id) &&
      ACTIVE_STATUSES.includes(order.status),
  )
  if (hasActiveOrder) {
    return {
      ok: false,
    }
  } else {
    return {
      ok: true,
    }
  }
}
// 【流程①-1：CreatorSettingsPage 打開時呼叫】讀我的接案設定；沒有這筆（沒開通過）回 null
export async function fetchCreatorSettings(): Promise<CreatorSettings | null> {
  const user = useAuthStore().currentUser
  if (!user) return null
  return MOCK_CREATOR_PROFILES.find((profile) => profile.user_id === user.id) ?? null
}

// 送出的接案設定（features.md 3.5）：不含 Amilu 燈（燈走另一支 API）、不含唯讀的 store_approved、user_id
export type CreatorSettingsChanges = Pick<
  CreatorSettings,
  | 'payout_bank_code'
  | 'payout_account_no'
  | 'payout_account_name'
  | 'deposit_percent'
  | 'revision_count'
>

// 【流程③-1：CreatorSettingsPage 檢查通過後呼叫】PATCH /me/creator-settings，回傳後端存好的整份設定
// 假資料：把改的欄位蓋到目前那筆上回傳，不改 MOCK_CREATOR_PROFILES（重新整理後回到原值，同 updateProfile）
export async function updateCreatorSettings(
  changes: CreatorSettingsChanges,
): Promise<CreatorSettings> {
  const current = await fetchCreatorSettings()
  if (!current) throw new Error('尚未開通創作者模式') // 頁面只有已開通才看得到儲存鈕，正常不會走到這裡
  return { ...current, ...changes }
}

// 【流程③-2：CreatorSettingsPage 儲存時，Amilu 燈有改才呼叫】PATCH /me/creator-settings/amilu-light，回傳存好的燈號
// 假資料：原樣回傳
export async function updateAmiluLight(lightStatus: LightStatus): Promise<LightStatus> {
  return lightStatus
}

// 【流程②：編輯一般作品時，UploadWorkLightbox 打開就呼叫】這件作品的原內容，填回表單用；找不到回傳 null
// 對應 GET /works/{id}（api.md 草案）；寫法同 explore 的 fetchWorkDetail，但只回表單要的欄位
// 不回傳整個 Work：Work 型別在 explore，features 之間不互相 import（structure.md 2）
export async function fetchWorkForEdit(workId: string): Promise<WorkEditData | null> {
  const work = MOCK_WORKS.find((row) => row.work_id === workId)
  if (!work) return null // 找不到就停，下面才能放心讀 work 的欄位
  const images = MOCK_WORK_IMAGES.filter((row) => row.work_id === workId)
    .sort((a, b) => a.seq_no - b.seq_no) // seq_no 小的在前，第一張是封面
    .map((row) => row.image_url)
  // WORK_TAG 只有 tag_id，用 MOCK_TAGS 查回名稱；查不到的略過
  const tags = MOCK_WORK_TAGS.filter((row) => row.work_id === workId)
    .map((row) => MOCK_TAGS.find((tag) => tag.tag_id === row.tag_id)?.name)
    .filter((name): name is string => name !== undefined)
  return {
    title: work.title,
    content: work.content,
    category_id: work.category_id,
    purpose_id: work.purpose_id,
    images,
    tags,
  }
}

// 【流程②：編輯可委託項目時，CommissionItemLightbox 打開就呼叫】這個項目的原內容，填回表單用；找不到回傳 null
// 對應 GET /commission-items/{id}（api.md 草案）；同 fetchWorkForEdit，只回表單要的欄位
export async function fetchCommissionItemForEdit(
  itemId: string,
): Promise<CommissionItemEditData | null> {
  const item = MOCK_COMMISSION_ITEMS.find((row) => row.item_id === itemId)
  if (!item) return null // 找不到就停，下面才能放心讀 item 的欄位
  const images = MOCK_COMMISSION_ITEM_IMAGES.filter((row) => row.item_id === itemId)
    .sort((a, b) => a.seq_no - b.seq_no) // seq_no 小的在前，第一張是封面
    .map((row) => row.image_url)
  // COMMISSION_ITEM_TAG 只有 tag_id，用 MOCK_TAGS 查回名稱；查不到的略過
  const tags = MOCK_COMMISSION_ITEM_TAGS.filter((row) => row.item_id === itemId)
    .map((row) => MOCK_TAGS.find((tag) => tag.tag_id === row.tag_id)?.name)
    .filter((name): name is string => name !== undefined)
  return {
    title: item.title,
    description: item.description,
    price: item.price,
    commercial_allowed: item.commercial_allowed,
    stage_plan_pref: item.stage_plan_pref,
    category_id: item.category_id,
    purpose_id: item.purpose_id,
    images,
    tags,
  }
}

// 【流程③：UploadWorkLightbox 按「儲存發布」（新增模式）時呼叫】新增一件作品
// 對應 POST /works（api.md 5.9，multipart）；假資料直接塞進 mock 陣列，模擬後端存好（重新整理後消失）
export async function createWork(data: NewWork): Promise<void> {
  const user = useAuthStore().currentUser
  if (!user) return // 沒登入看不到上傳鈕，正常不會走到這裡
  const workId = `w_${Date.now()}` // 真後端會自己產生 id；這裡用毫秒數，不會重複
  MOCK_WORKS.push({
    work_id: workId,
    user_id: user.id,
    title: data.title,
    content: data.content,
    category_id: data.category_id,
    purpose_id: data.purpose_id,
    created_at: new Date().toISOString(),
  })
  // 圖片：模擬後端存檔並產生網址；seq_no 從 1 開始，1 是封面
  data.images.forEach((file, index) => {
    MOCK_WORK_IMAGES.push({
      work_id: workId,
      seq_no: index + 1,
      image_url: URL.createObjectURL(file),
    })
  })
  // 標籤：同名（不分大小寫）就沿用，沒有就新建（api.md 5.8），再寫進 WORK_TAG
  data.tags.forEach((name) => {
    let tag = MOCK_TAGS.find((row) => row.name.toLowerCase() === name.toLowerCase())
    if (!tag) {
      tag = { tag_id: `t_${Date.now()}_${name}`, name: name }
      MOCK_TAGS.push(tag)
    }
    MOCK_WORK_TAGS.push({ work_id: workId, tag_id: tag.tag_id })
  })
}

// 【流程③：CommissionItemLightbox 按「儲存發布」（新增模式）時呼叫】新增一個可委託項目
// 對應 POST /commission-items（api.md 5.9，multipart）；寫法同 createWork，假資料塞進 mock 陣列（重新整理後消失）
export async function createCommissionItem(data: NewCommissionItem): Promise<void> {
  const user = useAuthStore().currentUser
  if (!user) return // 沒登入看不到上傳鈕，正常不會走到這裡
  const itemId = `ci_${Date.now()}` // 真後端會自己產生 id；這裡用毫秒數，不會重複
  MOCK_COMMISSION_ITEMS.push({
    item_id: itemId,
    creator_id: user.id,
    title: data.title,
    description: data.description,
    price: data.price,
    commercial_allowed: data.commercial_allowed,
    stage_plan_pref: data.stage_plan_pref,
    category_id: data.category_id,
    purpose_id: data.purpose_id,
    created_at: new Date().toISOString(),
  })
  // 圖片：模擬後端存檔並產生網址；seq_no 從 1 開始，1 是封面
  data.images.forEach((file, index) => {
    MOCK_COMMISSION_ITEM_IMAGES.push({
      item_id: itemId,
      seq_no: index + 1,
      image_url: URL.createObjectURL(file),
    })
  })
  // 標籤：同名（不分大小寫）就沿用，沒有就新建（api.md 5.8），再寫進 COMMISSION_ITEM_TAG
  data.tags.forEach((name) => {
    let tag = MOCK_TAGS.find((row) => row.name.toLowerCase() === name.toLowerCase())
    if (!tag) {
      tag = { tag_id: `t_${Date.now()}_${name}`, name: name }
      MOCK_TAGS.push(tag)
    }
    MOCK_COMMISSION_ITEM_TAGS.push({ item_id: itemId, tag_id: tag.tag_id })
  })
}
