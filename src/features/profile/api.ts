// profile 功能的「後端呼叫」：頁面一律呼叫這裡，不直接 import mocks（structure.md 3.2）
// 現在是假的，後端好了改成呼叫 PATCH /me/profile、DELETE /me（api.md 草案），頁面不用動
import { useAuthStore } from '@/features/account/store'
import { MOCK_ORDER_IN_PROGRESS, MOCK_ORDER_THREE_STAGE, MOCK_ORDER_COMPLETED } from '@/mocks/order'

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
