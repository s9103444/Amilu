<template>
  <button type="button" class="user-menu-btn" aria-label="使用者選單" :aria-expanded="open">
    <span class="pic">
      <!-- 沒傳頭像時改用預設圖 -->
      <img :src="avatarUrl ?? '/picture/default-user-pic.png'" alt="" />
    </span>
    <img v-if="open" src="/icons/arrow-up-gray.svg" alt="" />
    <img v-else src="/icons/arrow-down-gray.svg" alt="" />
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：header 右上角的使用者選單按鈕
範例：
<UserMenuButton :avatar-url="頭像網址" :open="isOpen" @click="isOpen = !isOpen" />
選單開關由 header 記住，按鈕只負責顯示
*/
defineProps<{
  avatarUrl?: string
  open: boolean
}>()
</script>

<style lang="scss" scoped>
.user-menu-btn {
  cursor: pointer;
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  padding: 8px 12px 8px 10px;
  border-radius: 14px;
  background: var(--color-bg-subtle);
  transition: background 0.3s ease;
}

// 只在有滑鼠的裝置套用，避免手機點完後一直停在 hover 色
@media (hover: hover) {
  .user-menu-btn:hover {
    background: var(--color-bg-subtle-hover);
  }
}

.pic {
  width: 32px;
  height: 32px;
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
