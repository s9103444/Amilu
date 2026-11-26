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
import { CATEGORY_OPTIONS, PURPOSE_OPTIONS } from '@/mocks/classification'
import { formatAmount } from '@/shared/utils/formatAmount'

// 參數名稱 api.md 沒寫，要跟後端確認
export type WorkFilter = {
  category: string
  purpose: string
  tag_ids: string[]
}

// 個人專頁卡片（ProfileWorkCard）要的資料；作品、可委託項目共用，id 是 work_id 或 item_id
export type ProfileCard = {
  id: string
  title: string
  category_label: string
  cover_url: string
}

// 【個人專頁打開、網址的 userId 改變時由 UserProfilePage 呼叫】「作品牆」分頁的卡片資料
// 對應的 API api.md 沒寫，要跟後端確認；先在這裡把封面、分類名稱整理成卡片直接能用的樣子
export async function fetchProfileWorks(userId: string): Promise<ProfileCard[]> {
  return MOCK_WORKS.filter((work) => work.user_id === userId).map((work) => {
    const cover = MOCK_WORK_IMAGES.find(
      (image) => work.work_id === image.work_id && image.seq_no === 1,
    )
    const categoryName = CATEGORY_OPTIONS.find((option) => option.value === work.category_id)?.label
    const purposeName = PURPOSE_OPTIONS.find((option) => option.value === work.purpose_id)?.label

    return {
      id: work.work_id,
      title: work.title,
      cover_url: cover?.image_url ?? '', // 每件作品都該有封面；萬一沒有，給空字串，卡片只顯示底色
      // 類型、用途可能是 null（查不到名稱），略過那個，只接有的
      category_label: [categoryName, purposeName]
        .filter((name): name is string => name !== undefined)
        .join('・'),
    }
  })
}

// 【個人專頁打開、網址的 userId 改變時由 UserProfilePage 呼叫】「可委託項目」分頁的卡片資料
// 同 fetchProfileWorks，第二行多接價錢：類型・用途・NT$ 1,500 起
export async function fetchProfileCommissionItems(userId: string): Promise<ProfileCard[]> {
  return MOCK_COMMISSION_ITEMS.filter((item) => item.creator_id === userId).map((item) => {
    const cover = MOCK_COMMISSION_ITEM_IMAGES.find(
      (image) => item.item_id === image.item_id && image.seq_no === 1,
    )
    const categoryName = CATEGORY_OPTIONS.find((option) => option.value === item.category_id)?.label
    const purposeName = PURPOSE_OPTIONS.find((option) => option.value === item.purpose_id)?.label

    return {
      id: item.item_id,
      title: item.title,
      cover_url: cover?.image_url ?? '', // 每個項目都該有封面；萬一沒有，給空字串，卡片只顯示底色
      // 類型、用途可能是 null（查不到名稱），略過那個；價錢一定有，格式化成「NT$ 1,500 起」接在最後
      category_label: [categoryName, purposeName, `${formatAmount(item.price)} 起`]
        .filter((name): name is string => name !== undefined)
        .join('・'),
    }
  })
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
): Promise<{ items: CommissionItem[]; images: CommissionItemImage[] }> {
  const items = MOCK_COMMISSION_ITEMS.filter((item) => item.creator_id === creatorId)
  // 左側圖片：照項目順序，每個項目內再照 seq_no（features.md 2.6「依序排列」）
  // 整列回傳不只給網址：燈箱要靠 item_id 找出被點的項目第一張排第幾（features.md 2.6 預設定位）
  const images = items.flatMap((item) =>
    MOCK_COMMISSION_ITEM_IMAGES.filter((row) => row.item_id === item.item_id).sort(
      (a, b) => a.seq_no - b.seq_no,
    ),
  )
  return { items, images }
}

// 刪除一般作品（DELETE /works/{id}，api.md 2.3）：真刪，連它的圖片列、標籤列一起刪
// 放 explore 不放 profile：呼叫的 UserProfilePage 在 explore，features 之間不互相 import（structure.md）
export async function deleteWork(workId: string): Promise<void> {
  // 主表 work_id 不重複，找到位置刪一次就好
  const index = MOCK_WORKS.findIndex((work) => work.work_id === workId)
  if (index === -1) return // 找不到這件作品（例如已被刪掉）就不做
  MOCK_WORKS.splice(index, 1)
  // 圖片、標籤可能好幾列：從最後往前刪，splice 後前面的位置才不會跑掉
  for (let i = MOCK_WORK_IMAGES.length - 1; i >= 0; i--) {
    if (MOCK_WORK_IMAGES[i]?.work_id === workId) MOCK_WORK_IMAGES.splice(i, 1)
  }
  for (let i = MOCK_WORK_TAGS.length - 1; i >= 0; i--) {
    if (MOCK_WORK_TAGS[i]?.work_id === workId) MOCK_WORK_TAGS.splice(i, 1)
  }
}

// 刪除可委託項目（DELETE /commission-items/{id}，api.md 2.3）：真刪，同 deleteWork
// TODO 接後端：已有案件的 ORDER.item_id 要設為空（案件畫面讀快照，不受影響）；mock 訂單沒有 item_id，先不處理
export async function deleteCommissionItem(itemId: string): Promise<void> {
  const index = MOCK_COMMISSION_ITEMS.findIndex((item) => item.item_id === itemId)
  if (index === -1) return // 找不到這個項目（例如已被刪掉）就不做
  MOCK_COMMISSION_ITEMS.splice(index, 1)
  for (let i = MOCK_COMMISSION_ITEM_IMAGES.length - 1; i >= 0; i--) {
    if (MOCK_COMMISSION_ITEM_IMAGES[i]?.item_id === itemId) MOCK_COMMISSION_ITEM_IMAGES.splice(i, 1)
  }
  for (let i = MOCK_COMMISSION_ITEM_TAGS.length - 1; i >= 0; i--) {
    if (MOCK_COMMISSION_ITEM_TAGS[i]?.item_id === itemId) MOCK_COMMISSION_ITEM_TAGS.splice(i, 1)
  }
}
