<template>
  <div class="row">
    <!-- 頭像＋名字是一個可點區塊；追蹤按鈕放在它旁邊，因為 button 裡不能再放 button -->
    <button type="button" class="user" @click="emit('select')">
      <img class="avatar" :src="avatarUrl ?? defaultAvatar" alt="" />
      <span class="name">
        <span class="nickname text-caption">{{ nickname }}</span>
        <span class="user-id text-small">@{{ userId }}</span>
      </span>
    </button>
    <FollowButton class="follow" size="xs" :followed="followed" @click="emit('toggle-follow')" />
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：追蹤使用者列（Figma 568:228，追蹤清單燈箱裡的一列）
範例：
使用前先 import：import FollowUserRow from '@/features/explore/components/FollowUserRow.vue'
<FollowUserRow
  :avatar-url="user.avatar_url"
  :nickname="user.nickname"
  :user-id="user.id"
  :followed="isFollowed"
  @toggle-follow="isFollowed = !isFollowed"
  @select="前往對方個人頁"
/>
userId 傳帳號 ID 本身（USER.id，不含 @），畫面上會自動加「@」；沒有大頭照時傳 null 或不傳，會顯示預設圖。
事件：
  select         點頭像或名字（之後用來前往對方個人頁，目前還沒有路由）
  toggle-follow  點右邊的追蹤按鈕；追蹤狀態由外面記住，這一列只負責顯示
*/
import FollowButton from '@/shared/components/FollowButton.vue'

defineProps<{
  avatarUrl?: string | null
  nickname: string
  userId: string
  followed: boolean
}>()

const emit = defineEmits<{
  select: []
  'toggle-follow': []
}>()

// public/ 的檔案要自己接上 BASE_URL
const defaultAvatar = import.meta.env.BASE_URL + 'picture/default-user-pic.png'
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  background: var(--color-bg-page);
}
// 可點區塊：吃掉按鈕以外的寬度；先蓋掉 button 的瀏覽器預設樣式
.user {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.avatar {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}
// min-width: 0 讓過長的名字可以被截斷，不會把追蹤按鈕擠出去
.name {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.nickname,
.user-id {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.nickname {
  color: var(--color-text-primary);
}
.user-id {
  color: var(--color-text-secondary);
}
// 名字再長，追蹤按鈕也不縮
.follow {
  flex-shrink: 0;
}
</style>
