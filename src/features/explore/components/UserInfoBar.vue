<template>
  <div class="info" :class="`info--${layout}`">
    <img class="avatar" :src="avatarUrl ?? defaultAvatar" alt="" />
    <div class="text">
      <span class="nickname text-button-sm">{{ nickname }}</span>
      <span class="user-id text-small">@{{ userId }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：個人資訊條（Figma 490:1132）：大頭照＋使用者名稱＋帳號 ID
範例：
使用前先 import：import UserInfoBar from '@/features/explore/components/UserInfoBar.vue'
<UserInfoBar :avatar-url="user.avatar_url" :nickname="user.nickname" :user-id="user.id" layout="horizontal" />
layout：
  'vertical'   名稱和 ID 上下排（預設）
  'horizontal' 名稱和 ID 左右排
userId 傳帳號 ID 本身（USER.id，不含 @），畫面上會自動加「@」；沒有大頭照時傳 null 或不傳，會顯示預設圖。
先放在 explore；之後別的功能也要用，再搬到 shared。
*/
withDefaults(
  defineProps<{
    avatarUrl?: string | null
    nickname: string
    userId: string
    layout?: 'vertical' | 'horizontal'
  }>(),
  { layout: 'vertical' },
)

// public/ 的檔案要自己接上 BASE_URL
const defaultAvatar = import.meta.env.BASE_URL + 'picture/default-user-pic.png'
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  align-items: center;
}
// 大頭照是圓角方形，不是圓形（Figma）
.avatar {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  object-fit: cover;
}
.text {
  display: flex;
  white-space: nowrap;
}
.nickname {
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
</style>
