<template>
  <div class="info" :class="`info--${layout}`">
    <img class="avatar" :src="avatarUrl ?? DEFAULT_AVATAR_URL" alt="" />
    <div class="text">
      <!-- 【點名字時】有 link 就是連結，前往這個人的個人頁（features.md 2.5「看完整專頁」）；沒有就只是字 -->
      <!-- v-if／v-else 要是相鄰的兄弟，不能把 v-else 包在 v-if 裡面 -->
      <RouterLink v-if="link" :to="`/users/${userId}`" class="name text-small">{{
        name
      }}</RouterLink>
      <span v-else class="name text-small">{{ name }}</span>
      <span class="user-id text-note">@{{ userId }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：個人資訊條（Figma 490:1132）：大頭照＋使用者名稱＋帳號 ID
範例：
使用前先 import：import UserInfoBar from '@/features/explore/components/UserInfoBar.vue'
<UserInfoBar :avatar-url="user.avatar_url" :name="user.nickname" :user-id="user.id" layout="horizontal" />
layout：
  'vertical'   名稱和 ID 上下排（預設）
  'horizontal' 名稱和 ID 左右排
name：粗體那一行，不一定是暱稱（瀑布流卡片放的是作品標題）
userId 傳帳號 ID 本身（USER.id，不含 @），畫面上會自動加「@」；沒有大頭照時傳 null 或不傳，會顯示預設圖。
先放在 explore；之後別的功能也要用，再搬到 shared。
*/
import { DEFAULT_AVATAR_URL } from '@/shared/constants'
import { RouterLink } from 'vue-router'

withDefaults(
  defineProps<{
    avatarUrl?: string | null
    name: string
    userId: string
    layout?: 'vertical' | 'horizontal'
    link?: boolean // 名字可以點、前往 /users/:userId；卡片本身是按鈕時不能開（<button> 裡不能放 <a>）
  }>(),
  { layout: 'vertical' },
)
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  align-items: center;
}
// 大頭照是圓角方形（全站統一 --radius-avatar）
.avatar {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-avatar);
  object-fit: cover;
}
// 文字區：吃掉頭像以外的寬度；min-width: 0 讓它能縮得比文字窄，裡面的字才有機會被截斷
.text {
  display: flex;
  width: fit-content;
  min-width: 0;
}
// 太長時截成「…」：text-overflow 只對「直接裝著文字的元素」有效，
// 所以三件套要寫在 .name／.user-id 上，寫在 flex 容器 .text 上不會觸發
.name,
.user-id {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none; // 名字是 RouterLink（<a>）時拿掉預設底線
}
.name {
  color: var(--color-text-primary);
}
.user-id {
  color: var(--color-text-secondary);
}

// 直式：頭像和文字距離 8px，名稱和 ID 上下排
.info--vertical {
  gap: 8px;
  .text {
    flex-direction: column;
    justify-content: center;
  }
}
// 橫式：頭像和文字距離 10px，名稱和 ID 左右排、距離 8px
.info--horizontal {
  gap: 10px;
  .text {
    align-items: center;
    gap: 8px;
  }
}
@media (hover: hover) {
  .name:hover {
    color: var(--color-text-secondary);
  }
}
</style>
