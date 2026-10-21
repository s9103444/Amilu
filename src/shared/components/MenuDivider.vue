<template>
  <hr class="menu-divider" />
</template>

<script setup lang="ts">
/*
元件名稱：選單分隔線（選單項目之間的細線）
範例：
使用前先 import：import MenuDivider from '@/shared/components/MenuDivider.vue'
<MenuDivider /> ---> 上下留 8px、左右留 12px，寬度撐滿
*/
</script>

<style lang="scss" scoped>
// Figma 的線是 0.3px、#D1D1D1（不在色票內）。小於 1px 的線在不同解析度顯示不一致，
// 所以用 1px 的 --color-border 再降低透明度，模擬那條淡線
.menu-divider {
  margin: 8px 12px;
  border: none;
  border-top: 1px solid var(--color-border);
  opacity: 0.5;
}
</style>
