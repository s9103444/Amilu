// profile 功能的「後端呼叫」：頁面一律呼叫這裡，不直接 import mocks（structure.md 3.2）
// 現在是假的，後端好了改成呼叫 PATCH /me/profile（api.md 草案），頁面不用動

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
