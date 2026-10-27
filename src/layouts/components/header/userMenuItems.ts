// 個人選單（header 點頭像後出現）的項目清單，內容照 Figma「個人頁選單（上傳作品展開）」719:14347。
// 前端寫死的畫面設定，不是後端資料，所以不放 mocks/。
// 欄位名稱和 UserMenuItem／UserSubMenuItem 的 props 一樣，可以直接 v-bind 傳進去。
// icon 是 public/ 底下的路徑，開頭不加 /（元件內會自動接上 BASE_URL）。
// 分隔線和「開通創作者模式」按鈕不是項目，由 UserMenu 依 Figma 順序擺在各組之間：
//   PROFILE_ITEMS → 分隔線 → WORK_ITEMS → 開通創作者模式 → 分隔線 → LOGOUT_ITEM

export type UserSubMenuItemData = {
  key: string
  icon: string
  title: string
}

export type UserMenuItemData = {
  key: string
  icon: string
  mainTitle: string
  subTitle?: string // 沒有就只顯示標題（登出）
  children?: UserSubMenuItemData[] // 有子選單時才有，右側會出現箭頭
}

// 第一組：個人相關
export const PROFILE_ITEMS: UserMenuItemData[] = [
  { key: 'profile', icon: 'icons/user.svg', mainTitle: '個人專頁', subTitle: '個人展示頁面' },
  {
    key: 'profile-settings',
    icon: 'icons/settings.svg',
    mainTitle: '個人資料設定',
    subTitle: '大頭照・暱稱・簡介',
  },
  {
    key: 'upload',
    icon: 'icons/circle-plus.svg',
    mainTitle: '上傳作品',
    subTitle: '一般 or 委託項目',
    children: [
      { key: 'upload-post', icon: 'icons/circle-plus-sm.svg', title: '一般貼文' },
      { key: 'upload-commission-item', icon: 'icons/circle-plus-sm.svg', title: '委託項目' },
    ],
  },
]

// 第二組：網站說明與接案
export const WORK_ITEMS: UserMenuItemData[] = [
  { key: 'help', icon: 'icons/help.svg', mainTitle: '網站說明', subTitle: '操作流程說明' },
  { key: 'orders', icon: 'icons/list.svg', mainTitle: '約稿管理', subTitle: '接案 & 委託列表' },
  {
    key: 'creator-settings',
    icon: 'icons/settings.svg',
    mainTitle: '接案設定',
    subTitle: '設定接案所需細項',
  },
]

// 最後一項：登出（只有標題）
export const LOGOUT_ITEM: UserMenuItemData = {
  key: 'logout',
  icon: 'icons/logout.svg',
  mainTitle: '登出',
}
