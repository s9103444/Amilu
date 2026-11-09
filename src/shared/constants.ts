/*
全站共用的固定值：算一次、不會變、不含業務。只有一個功能用的固定值放該功能裡，不放這裡
使用：import { DEFAULT_AVATAR_URL } from '@/shared/constants'
*/

// 預設頭像：使用者沒有大頭照時顯示，例：:src="avatarUrl ?? DEFAULT_AVATAR_URL"
// 圖放在 public/，:src 綁定的路徑要自己接 BASE_URL，否則部署到子路徑會 404（structure.md 2.2）
export const DEFAULT_AVATAR_URL = import.meta.env.BASE_URL + 'picture/default-user-pic.png'
