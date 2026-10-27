// 假使用者，給追蹤使用者列（FollowUserRow）和個人資訊條（UserInfoBar）測試用。
// 欄位對齊 spec/data-model.md 的 USER：id ＝ 帳號 ID（不含 @，畫面上才加）、nickname ＝ 暱稱、avatar_url ＝ 大頭照。
// avatar_url 是 null 代表沒上傳大頭照，元件會改用預設圖。
// 之後後端好了，改從 API 拿，到時候只要改這個檔。

import sampleAvatar from '@/assets/user/sample-avatar.png'

export type MockUser = {
  id: string
  nickname: string
  avatar_url: string | null
}

export const MOCK_USERS: MockUser[] = [
  { id: 'im_temp_id', nickname: '使用者名稱', avatar_url: sampleAvatar },
  { id: 'painter_01', nickname: '小畫家', avatar_url: null },
  { id: 'moon_sketch', nickname: '月光速寫', avatar_url: sampleAvatar },
  { id: 'a_very_long_account_id_for_test', nickname: '名字很長很長的測試使用者', avatar_url: null },
]
