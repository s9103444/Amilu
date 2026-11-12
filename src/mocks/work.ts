// 假的一般作品，給首頁作品牆（瀑布流）用。16 筆對應 src/assets/work/ 的 16 張圖。
// 形狀用 features/explore/types.ts 的 Work／WorkImage（對齊 WORK、WORK_IMAGE）。
// 每件作品先只放一張圖（seq_no 1 ＝ 封面），作品牆只需要封面；燈箱要多張時再補。
// user_id 用 mocks/user.ts 現有的帳號；category_id／purpose_id 對應 mocks/classification.ts 的 value，
// 刻意留幾筆 null（data-model：可為空），之後做篩選時可以測到。
// 之後後端好了，改從 GET /works 拿（api.md 草案），到時候只要改這個檔。

import type { Work, WorkImage } from '@/features/explore/types'
import work01 from '@/assets/work/work-01.webp'
import work02 from '@/assets/work/work-02.webp'
import work03 from '@/assets/work/work-03.webp'
import work04 from '@/assets/work/work-04.webp'
import work05 from '@/assets/work/work-05.webp'
import work06 from '@/assets/work/work-06.webp'
import work07 from '@/assets/work/work-07.webp'
import work08 from '@/assets/work/work-08.webp'
import work09 from '@/assets/work/work-09.webp'
import work10 from '@/assets/work/work-10.webp'
import work11 from '@/assets/work/work-11.webp'
import work12 from '@/assets/work/work-12.webp'
import work13 from '@/assets/work/work-13.webp'
import work14 from '@/assets/work/work-14.webp'
import work15 from '@/assets/work/work-15.webp'
import work16 from '@/assets/work/work-16.webp'

export const MOCK_WORKS: Work[] = [
  {
    work_id: 'w_001',
    user_id: 'moon_sketch',
    title: '作品名稱 01',
    content: '作品說明',
    category_id: '1',
    purpose_id: '1',
    created_at: '2026-10-16T10:00:00+08:00',
  },
  {
    work_id: 'w_002',
    user_id: 'painter_01',
    title: '作品名稱 02',
    content: '作品說明',
    category_id: '2',
    purpose_id: '5',
    created_at: '2026-10-15T10:00:00+08:00',
  },
  {
    work_id: 'w_003',
    user_id: 'im_temp_id',
    title: '作品名稱 03',
    content: '作品說明',
    category_id: '3',
    purpose_id: null,
    created_at: '2026-10-14T10:00:00+08:00',
  },
  {
    work_id: 'w_004',
    user_id: 'moon_sketch',
    title: '作品名稱很長很長用來測試卡片標題會不會換行 04',
    content: '作品說明',
    category_id: '2',
    purpose_id: '2',
    created_at: '2026-10-13T10:00:00+08:00',
  },
  {
    work_id: 'w_005',
    user_id: 'a_very_long_account_id_for_test',
    title: '作品名稱 05',
    content: '作品說明',
    category_id: '6',
    purpose_id: '4',
    created_at: '2026-10-12T10:00:00+08:00',
  },
  {
    work_id: 'w_006',
    user_id: 'painter_01',
    title: '作品名稱 06',
    content: '作品說明',
    category_id: null,
    purpose_id: null,
    created_at: '2026-10-11T10:00:00+08:00',
  },
  {
    work_id: 'w_007',
    user_id: 'moon_sketch',
    title: '作品名稱 07',
    content: '作品說明',
    category_id: '1',
    purpose_id: '3',
    created_at: '2026-10-10T10:00:00+08:00',
  },
  {
    work_id: 'w_008',
    user_id: 'im_temp_id',
    title: '作品名稱 08',
    content: '作品說明',
    category_id: '5',
    purpose_id: '8',
    created_at: '2026-10-09T10:00:00+08:00',
  },
  {
    work_id: 'w_009',
    user_id: 'painter_01',
    title: '作品名稱 09',
    content: '作品說明',
    category_id: '2',
    purpose_id: '1',
    created_at: '2026-10-08T10:00:00+08:00',
  },
  {
    work_id: 'w_010',
    user_id: 'moon_sketch',
    title: '作品名稱 10',
    content: '作品說明',
    category_id: '7',
    purpose_id: '4',
    created_at: '2026-10-07T10:00:00+08:00',
  },
  {
    work_id: 'w_011',
    user_id: 'a_very_long_account_id_for_test',
    title: '作品名稱 11',
    content: '作品說明',
    category_id: '3',
    purpose_id: '5',
    created_at: '2026-10-06T10:00:00+08:00',
  },
  {
    work_id: 'w_012',
    user_id: 'im_temp_id',
    title: '作品名稱 12',
    content: '作品說明',
    category_id: null,
    purpose_id: '1',
    created_at: '2026-10-05T10:00:00+08:00',
  },
  {
    work_id: 'w_013',
    user_id: 'painter_01',
    title: '作品名稱 13',
    content: '作品說明',
    category_id: '1',
    purpose_id: '2',
    created_at: '2026-10-04T10:00:00+08:00',
  },
  {
    work_id: 'w_014',
    user_id: 'moon_sketch',
    title: '作品名稱 14',
    content: '作品說明',
    category_id: '2',
    purpose_id: '6',
    created_at: '2026-10-03T10:00:00+08:00',
  },
  {
    work_id: 'w_015',
    user_id: 'im_temp_id',
    title: '作品名稱 15',
    content: '作品說明',
    category_id: '6',
    purpose_id: null,
    created_at: '2026-10-02T10:00:00+08:00',
  },
  {
    work_id: 'w_016',
    user_id: 'painter_01',
    title: '作品名稱 16',
    content: '作品說明',
    category_id: '1',
    purpose_id: '1',
    created_at: '2026-10-01T10:00:00+08:00',
  },
]

// 每件作品一張封面（seq_no 1），順序同 MOCK_WORKS
export const MOCK_WORK_IMAGES: WorkImage[] = [
  { work_id: 'w_001', seq_no: 1, image_url: work01 },
  { work_id: 'w_002', seq_no: 1, image_url: work02 },
  { work_id: 'w_003', seq_no: 1, image_url: work03 },
  { work_id: 'w_004', seq_no: 1, image_url: work04 },
  { work_id: 'w_005', seq_no: 1, image_url: work05 },
  { work_id: 'w_006', seq_no: 1, image_url: work06 },
  { work_id: 'w_007', seq_no: 1, image_url: work07 },
  { work_id: 'w_008', seq_no: 1, image_url: work08 },
  { work_id: 'w_009', seq_no: 1, image_url: work09 },
  { work_id: 'w_010', seq_no: 1, image_url: work10 },
  { work_id: 'w_011', seq_no: 1, image_url: work11 },
  { work_id: 'w_012', seq_no: 1, image_url: work12 },
  { work_id: 'w_013', seq_no: 1, image_url: work13 },
  { work_id: 'w_014', seq_no: 1, image_url: work14 },
  { work_id: 'w_015', seq_no: 1, image_url: work15 },
  { work_id: 'w_016', seq_no: 1, image_url: work16 },
]
