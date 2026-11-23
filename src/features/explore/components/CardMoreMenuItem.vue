<template>
  <button type="button" class="btn">
    <img class="icon" :src="base + icon" alt="" />
    <span class="title text-small">{{ title }}</span>
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：個人頁卡片「⋯」選單的一個選項（features.md 2.7），只給 CardMoreMenu 用
範例：
<CardMoreMenuItem icon="icons/edit.svg" title="編輯貼文" @click="..." />
icon 傳 public/ 底下的路徑，開頭不加 /（元件內自動接 BASE_URL）
樣式照 header 的 UserSubMenuItem，左邊縮排改 12（同 UploadMenu 蓋掉後的值）；
不直接用它是因為 features 不能 import layouts（structure.md）
@click 沒宣告成事件：會落到根元素 <button> 上，當原生點擊用
*/
defineProps<{
  icon: string
  title: string
}>()

// icon 用 :src 綁定，Vite 不會自動補 base，要自己接（BASE_URL 結尾已經有 /）
const base = import.meta.env.BASE_URL
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 4px 12px;
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
