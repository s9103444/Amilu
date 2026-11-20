// 假的追蹤關係（FOLLOW），給個人專頁的 followers／following 數字用，之後追蹤清單燈箱也會用。
// 欄位對齊 spec/data-model.md 的 FOLLOW：follower_id ＝ 按追蹤的人，following_id ＝ 被追蹤的人；一組關係一列。
// 兩個 id 都是 mocks/user.ts 的帳號 ID（USER.id）。
// 數字不存，即時計數（data-model.md 5.1）：
//   某人的 followers ＝ following_id 是他的列數
//   某人的 following ＝ follower_id 是他的列數
// 刻意涵蓋：
//   im_temp_id：followers 3、following 2（最多，測一般情況）
//   painter_01：followers 2、following 1
//   moon_sketch：followers 1、following 2
//   a_very_long_account_id_for_test：followers 0、following 1（測 0 的顯示）
// 之後後端好了，數字改從 GET /users/{id} 或 followers／following 的回應拿（api.md 草案），到時候只要改這個檔。

export type MockFollow = {
  follower_id: string
  following_id: string
}

export const MOCK_FOLLOWS: MockFollow[] = [
  { follower_id: 'painter_01', following_id: 'im_temp_id' },
  { follower_id: 'moon_sketch', following_id: 'im_temp_id' },
  { follower_id: 'a_very_long_account_id_for_test', following_id: 'im_temp_id' },
  { follower_id: 'im_temp_id', following_id: 'moon_sketch' },
  { follower_id: 'im_temp_id', following_id: 'painter_01' },
  { follower_id: 'moon_sketch', following_id: 'painter_01' },
]
