// 內容類型篩選（spec features.md 2.2）；value 之後給 HomePage 決定要抓哪種卡片
import type { ProfileMoreMenuItemData } from '@/features/explore/types'
export const CONTENT_TYPE_OPTIONS = [
  { value: 'all', label: '全部作品' },
  { value: 'commission', label: '開放委託' },
  { value: 'work', label: '一般貼文' },
]
// 個人頁卡片「⋯」選單的選項（features.md 2.7）
export const CARD_MORE_ITEMS: ProfileMoreMenuItemData[] = [
  { key: 'edit', icon: 'icons/edit.svg', title: '編輯貼文' },
  { key: 'delete', icon: 'icons/trash.svg', title: '刪除貼文' },
]
