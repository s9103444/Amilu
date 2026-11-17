<template>
  <div class="text-note saved-toast" role="status">
    <img src="/icons/check-green.svg" alt="" />
    <slot>已儲存變更</slot>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：提示｜已儲存（綠色膠囊）
範例：
使用前先 import：import SavedToast from '@/shared/components/SavedToast.vue'
<SavedToast /> ---> 顯示「已儲存變更」
<SavedToast>已更新</SavedToast> ---> 自訂文字
出現與消失的時機由外面控制
*/
</script>

<style lang="scss" scoped>
.saved-toast {
  display: inline-flex;
  // 圖示在前時，inline-flex 的基線會跟著圖片底部，整個標籤會往上飄；改成依方框置中對齊
  vertical-align: middle;
  align-items: center;
  gap: 4px;
  width: fit-content;
  padding: 6px 12px;
  border: 1px solid var(--color-success);
  border-radius: 999px;
  background: var(--color-success-bg);
  color: var(--color-success);
  white-space: nowrap;

  & > img {
    width: 18px;
    height: 18px;
  }
}
</style>
