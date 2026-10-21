<template>
  <span class="commercial-tag"><slot>可商用</slot></span>
</template>

<script setup lang="ts">
/*
元件名稱：可商用標籤（作品卡上的小標記）
範例：
使用前先 import：import CommercialTag from '@/shared/components/CommercialTag.vue'
<CommercialTag /> ---> 顯示「可商用」
*/
</script>

<style lang="scss" scoped>
.commercial-tag {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--color-bg-main);
  color: var(--color-text-secondary);
  font-family: var(--font-family);
  font-size: var(--fs-note);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
  white-space: nowrap;
  // 讓上下留白貼齊字形（Figma 做法）；瀏覽器不支援時改用較小的行高與內距
  text-box: trim-both cap alphabetic;
}

@supports not (text-box: trim-both cap alphabetic) {
  .commercial-tag {
    padding: 2px 8px;
    line-height: 1.1;
  }
}
</style>
