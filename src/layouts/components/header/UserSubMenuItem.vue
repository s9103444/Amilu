<template>
  <button type="button" class="btn">
    <img class="icon" :src="base + icon" alt="" />
    <span class="title text-small">{{ title }}</span>
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：個人選單的子項目（Figma 子選單項目 518:215）
主項目「上傳作品」展開後才出現，例：一般貼文、委託項目
範例：
使用前先 import：import UserSubMenuItem from '@/layouts/components/header/UserSubMenuItem.vue'
<UserSubMenuItem v-if="isUploadOpen" icon="icons/circle-plus-sm.svg" title="一般貼文" />
icon 傳 public/ 底下的路徑，開頭不加 /（元件內會自動接上 BASE_URL，部署到子路徑才不會 404）
和主項目 UserMenuItem 的差別：圖示 14px、只有標題、沒有箭頭、左邊多縮排
*/
// icon 用 :src 綁定，Vite 不會自動補 base，要自己接（BASE_URL 結尾已經有 /）
const base = import.meta.env.BASE_URL
defineProps<{
  icon: string
  title: string
}>()
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 4px 12px 4px 30px; // 左邊 30px，比主項目的 16px 多縮排，看得出是子項目
  border: none;
  text-align: left;
  background: var(--color-bg-subtle);
  transition: background 0.3s ease;
}

.icon {
  flex-shrink: 0; // 文字很長時圖示不被擠小
}

.title {
  white-space: nowrap;
  color: var(--color-text-primary);
}

// 只在有滑鼠的裝置套用，避免手機點完後一直停在 hover 色
@media (hover: hover) {
  .btn:hover {
    background: var(--color-bg-option-hover);
  }
}
</style>
