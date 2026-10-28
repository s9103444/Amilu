<template>
  <button type="button" class="drop-zone">
    <img class="drop-zone__icon" src="/icons/circle-plus.svg" alt="" />
    <span class="text-caption drop-zone__title">{{ title }}</span>
    <span class="text-small drop-zone__hint">{{ hint }}</span>
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：拖放上傳區
範例：
使用前先 import：import DropZone from '@/shared/components/DropZone.vue'
<DropZone @click="開啟選檔" @drop.prevent="處理拖放" /> ---> 預設文字，寬度撐滿
<DropZone hint="單張 5MB 以內" /> ---> 自訂說明文字
只負責外觀，選檔、拖放與檢查由外面處理
*/
withDefaults(
  defineProps<{
    title?: string
    hint?: string
  }>(),
  {
    title: '點擊或拖曳圖片至此上傳',
    hint: '1～5 張，單張 5MB 以內（JPG／PNG／WebP）',
  },
)
</script>

<style lang="scss" scoped>
.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 40px 24px;
  border: 2px dashed var(--color-border);
  border-radius: 16px;
  background: var(--color-bg-subtle);
  cursor: pointer;
  transition: background 0.3s ease;
}

// 用鍵盤移到這裡時顯示外框，滑鼠點擊不顯示（同 OptionButton）
.drop-zone:focus-visible {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

// Figma 沒畫 hover，前端自訂：底色深一階，同 UserMenuButton
// 拖著檔案經過時的提示屬於上傳邏輯，等做上傳燈箱時一起做（spec/open-questions.md 第 12 題）
@media (hover: hover) {
  .drop-zone:hover {
    background: var(--color-bg-subtle-hover);
  }
}

.drop-zone__icon {
  width: 32px;
  height: 32px;
}

.drop-zone__title {
  color: var(--color-text-primary);
}

.drop-zone__hint {
  color: var(--color-text-secondary);
}
</style>
