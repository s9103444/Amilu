// 假使用者，給追蹤使用者列（FollowUserRow）和個人資訊條（UserInfoBar）測試用。
// 欄位對齊 spec/data-model.md 的 USER：id ＝ 帳號 ID（不含 @，畫面上才加）、nickname ＝ 暱稱、avatar_url ＝ 大頭照。
// avatar_url 是 null 代表沒上傳大頭照，元件會改用預設圖。
// bio ＝ 自我介紹（USER.bio，上限 150 字，features.md 3.1），燈箱的「作者簡介」讀它；null 代表沒填。
// 刻意涵蓋：長簡介會換行（im_temp_id）、短簡介（painter_01）、沒填（a_very_long_account_id_for_test）。
// 帳號狀態也刻意涵蓋：未手機驗證（painter_01、a_very_long_account_id_for_test）、帳號鎖定（a_very_long_account_id_for_test）。
// 順序不要動：mocks/order.ts 用 MOCK_USERS[0]、[2] 取人。
// email 用 example.com（保留給測試的網域，不會寄到真人）。
// 之後後端好了，改從 API 拿，到時候只要改這個檔。

import sampleAvatar from '@/assets/user/sample-avatar.png'

export type MockUser = {
  id: string
  email: string
  nickname: string
  avatar_url: string | null
  bio: string | null
  password_hash: string // 假資料：真正的後端只存雜湊、也不會回傳給前端，這裡放明碼只是讓假登入能比對
  phone_verified: boolean
  phone_number: string | null
  account_status: '正常' | '鎖定' | '封鎖' | '已刪除'
  lock_reason: string | null
  deleted_at: string | null // 軟刪除時間（ISO 字串），有值代表已刪除
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'im_temp_id',
    email: 'im_temp@example.com',
    nickname: '使用者名稱',
    avatar_url: sampleAvatar,
    bio: '你好，我是自由插畫家。專注於角色設計、繪本創作與視覺插畫，擅長將抽象的情感與概念轉化為具體的視覺語言。作品曾參與多個品牌合作與展出，注重畫面細節與色彩的和諧。這裡是我紀錄靈感與發表新作的空間，歡迎私訊交流。',
    password_hash: 'demo1234',
    phone_verified: true,
    phone_number: '0912345678',
    account_status: '正常',
    lock_reason: null,
    deleted_at: null,
  },
  {
    id: 'painter_01',
    email: 'painter01@example.com',
    nickname: '小畫家',
    avatar_url: null,
    bio: '喜歡畫貓。',
    password_hash: 'demo1234',
    phone_verified: false,
    phone_number: null,
    account_status: '正常',
    lock_reason: null,
    deleted_at: null,
  },
  {
    id: 'moon_sketch',
    email: 'moon@example.com',
    nickname: '月光速寫',
    avatar_url: sampleAvatar,
    bio: '擅長厚塗與水彩風格的角色插畫，接頭像、立繪與 Q 版貼圖。委託前請先看可委託項目的說明。',
    password_hash: 'demo1234',
    phone_verified: true,
    phone_number: '0987654321',
    account_status: '正常',
    lock_reason: null,
    deleted_at: null,
  },
  {
    id: 'a_very_long_account_id_for_test',
    email: 'long_id_test@example.com',
    nickname: '名字很長很長的測試使用者',
    avatar_url: null,
    bio: null,
    password_hash: 'demo1234',
    phone_verified: false,
    phone_number: null,
    account_status: '鎖定',
    lock_reason: '結算後應補付未付',
    deleted_at: null,
  },
]
