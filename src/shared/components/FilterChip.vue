<template>
  <button
    type="button"
    class="text-button-sm chip"
    :class="{ 'chip--outline': variant === 'outline' }"
  >
    <img
      :src="base + (variant === 'outline' ? 'icons/cross-black.svg' : 'icons/cross-white.svg')"
      alt=""
    />
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：已選擇標籤（篩選後顯示在「已選擇」列，點一下取消）
範例：
使用前先 import：import FilterChip from '@/shared/components/FilterChip.vue'
<FilterChip>一般貼文</FilterChip> ---> 實心款（深色底）
<FilterChip variant="outline">半厚塗</FilterChip> ---> 外框款
<FilterChip @click="取消篩選">一般貼文</FilterChip>
*/
defineProps<{
  variant?: 'filled' | 'outline'
}>()

// 圖示用 :src 綁定，Vite 不會自動補 base，要自己接（BASE_URL 結尾已經有 /）
const base = import.meta.env.BASE_URL
</script>

<style lang="scss" scoped>
//-----實心款-----//
.chip {
  cursor: pointer;
  display: inline-flex;
  // 圖示在前時，inline-flex 的基線會跟著圖片底部，整個標籤會往上飄；改成依方框置中對齊
  vertical-align: middle;
  align-items: center;
  gap: 4px;
  width: fit-content;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  background: var(--color-bg-inverse);
  color: var(--color-text-on-dark);
  white-space: nowrap;
  transition: opacity 0.2s ease;

  & > img {
    width: 16px;
    height: 16px;
  }
}

//-----外框款-----//
.chip--outline {
  border: 1px solid var(--color-bg-inverse);
  background: none;
  color: var(--color-text-primary);
}

// 用鍵盤移到這裡時顯示外框，滑鼠點擊不顯示（同 OptionButton）
.chip:focus-visible {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

// Figma 沒畫 hover，前端自訂。這顆點了就會取消篩選，所以 hover 要表示「點下去會移除」，
// 不是一般的「可以點」：整顆變淡＋文字加刪除線，實心、外框兩款共用
@media (hover: hover) {
  .chip:hover {
    opacity: 0.6;
    text-decoration: line-through;
  }
}
</style>
