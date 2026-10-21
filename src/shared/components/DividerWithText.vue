<template>
  <div class="divider-with-text">
    <span class="divider-with-text__line"></span>
    <span class="text-caption divider-with-text__text"><slot>或選擇</slot></span>
    <span class="divider-with-text__line"></span>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：分隔線（中間帶字，表單裡的「或選擇」）
範例：
使用前先 import：import DividerWithText from '@/shared/components/DividerWithText.vue'
<DividerWithText /> ---> 顯示「或選擇」，寬度撐滿
<DividerWithText>或</DividerWithText> ---> 自訂文字
*/
</script>

<style lang="scss" scoped>
.divider-with-text {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.divider-with-text__line {
  flex: 1;
  min-width: 0;
  border-top: 1px solid var(--color-accent-muted);
}

.divider-with-text__text {
  color: var(--color-accent-muted);
  white-space: nowrap;
}
</style>
