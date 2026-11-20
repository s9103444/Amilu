// explore 功能的「後端呼叫」：頁面要資料一律呼叫這裡，不直接 import mocks（structure.md 3.2）。
// 現在回傳假資料，後端好了只改這個檔，頁面不用動。
// 真正打後端的 shared/api/client.ts 還沒建（專案目前沒有），接後端時再建。
// 函式都用 async：現在假資料瞬間就有，之後真 API 要等回應；先回傳 Promise，頁面一律 await，換後端時寫法不變。
import type {
  CommissionItem,
  CommissionItemImage,
  LightboxAuthor,
  ProfileAuthor,
  Work,
  WorkImage,
} from '@/features/explore/types'
import {
  MOCK_COMMISSION_ITEMS,
  MOCK_COMMISSION_ITEM_TAGS,
  MOCK_COMMISSION_ITEM_IMAGES,
} from '@/mocks/commissionItem'
import { MOCK_WORKS, MOCK_WORK_IMAGES, MOCK_WORK_TAGS } from '@/mocks/work'
import { MOCK_USERS } from '@/mocks/user'
import { MOCK_CREATOR_PROFILES } from '@/mocks/creatorProfile'
import { MOCK_TAGS } from '@/mocks/tag'
import { MOCK_FOLLOWS } from '@/mocks/follow'
import { MOCK_ORDERS } from '@/mocks/order'

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

// ── 燈箱 ──────────────────────────────────────────

// 【作品燈箱打開時由 WorkLightbox 呼叫】一件作品＋它的所有圖片（依 seq_no）＋標籤名稱
// 對應 GET /works/{id}（api.md 草案）；找不到回傳 null
export async function fetchWorkDetail(
  workId: string,
): Promise<{ work: Work; images: string[]; tags: string[] } | null> {
  const work = MOCK_WORKS.find((row) => row.work_id === workId)
  if (!work) {
    return null
  }
  const images = MOCK_WORK_IMAGES.filter((row) => row.work_id === workId)
    .sort((a, b) => a.seq_no - b.seq_no)
    .map((row) => row.image_url)
  // WORK_TAG 只有 tag_id，用 MOCK_TAGS 查回名稱；查不到的略過
  const tags = MOCK_WORK_TAGS.filter((row) => row.work_id === workId)
    .map((row) => MOCK_TAGS.find((tag) => tag.tag_id === row.tag_id)?.name)
    .filter((name): name is string => name !== undefined)
  return { work, images, tags }
}

// 【兩個燈箱打開時呼叫】作者資料＋Amilu 燈
// 對應 GET /users/{id}（api.md 草案）；Amilu 燈之後應由後端算好回傳，現在在這裡模擬
export async function fetchAuthor(userId: string): Promise<LightboxAuthor | null> {
  const user = MOCK_USERS.find((row) => row.id === userId)
  if (!user) {
    return null
  }
  const profile = MOCK_CREATOR_PROFILES.find((row) => row.user_id === userId)
  const hasItem = MOCK_COMMISSION_ITEMS.some((item) => item.creator_id === userId)
  return {
    id: user.id,
    nickname: user.nickname,
    avatar_url: user.avatar_url,
    bio: user.bio,
    store_approved: profile?.store_approved ?? false,
    // 三者同時成立才是接案中（data-model.md 5.1）：手動開放＋至少 1 筆可委託項目＋已開通
    is_open: profile?.light_status === '開放' && hasItem && profile.store_approved,
  }
}

// 【個人專頁打開、網址的 userId 改變時由 UserProfilePage 呼叫】上方個人資訊區要的資料
// 對應 GET /users/{id}（api.md 草案，同 fetchAuthor）；燈箱用不到追蹤數和評分，所以另寫一支，不加進 fetchAuthor
// 追蹤數、評分都是衍生值，不存（data-model.md 5.1）；接後端後改由後端算好回傳
export async function fetchAuthorProfile(userId: string): Promise<ProfileAuthor | null> {
  const authorInfo = await fetchAuthor(userId)
  if (!authorInfo) return null // 找不到這個人，頁面要顯示找不到

  // ① 追蹤數：followers 數「被追蹤的是他」的列，following 數「按追蹤的是他」的列
  const followerCount = MOCK_FOLLOWS.reduce((count, item) => {
    return item.following_id === userId ? count + 1 : count
  }, 0)
  const followingCount = MOCK_FOLLOWS.reduce((count, item) => {
    return item.follower_id === userId ? count + 1 : count
  }, 0)

  // ② 合作評分（features.md 2.7）：只算他當創作者收到的分數，還沒評的（null）排除
  const specificOrders = MOCK_ORDERS.filter((order) => order.creator_id === userId)
  const scoreList = specificOrders
    .map((order) => order.rating_for_creator)
    .filter((score): score is number => score !== null)
  const scoreSum = scoreList.reduce((sum, score) => sum + score, 0)
  // 沒有任何評分就是 null（畫面顯示「尚無評分」）；有的話取平均，四捨五入到小數一位
  // 加 Number.EPSILON：防小數誤差的保險寫法（例：取兩位時 1.005 * 100 實際是 100.4999…，不加會捨成 1.00）
  // 評分是 1～5 的整數平均、只取一位，實測不加也不會出錯；留著無害
  const scoreAverage =
    scoreList.length === 0
      ? null
      : Math.round((scoreSum / scoreList.length + Number.EPSILON) * 10) / 10

  return {
    ...authorInfo,
    follower_num: followerCount,
    following_num: followingCount,
    average_score: scoreAverage,
  }
}

// 【委託商店燈箱打開時由 CommissionShopLightbox 呼叫】某創作者的所有可委託項目＋每個項目的圖片
// 對應 GET /creators/{creator_id}/commission-items（api.md 草案）
export async function fetchCreatorCommissionItems(
  creatorId: string,
): Promise<{ items: CommissionItem[]; images: string[] }> {
  const items = MOCK_COMMISSION_ITEMS.filter((item) => item.creator_id === creatorId)
  // 左側圖片：照項目順序，每個項目內再照 seq_no（features.md 2.6「依序排列」）
  const images = items.flatMap((item) =>
    MOCK_COMMISSION_ITEM_IMAGES.filter((row) => row.item_id === item.item_id)
      .sort((a, b) => a.seq_no - b.seq_no)
      .map((row) => row.image_url),
  )
  return { items, images }
}
