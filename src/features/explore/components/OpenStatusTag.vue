<template>
  <span class="text-small open-status-tag" :class="{ 'open-status-tag--closed': !open }">
    {{ open ? '接案中' : '暫不接案' }}
  </span>
</template>

<script setup lang="ts">
/*
元件名稱：接案狀態標籤（作者旁，依 Amilu 燈顯示）
範例：
使用前先 import：import OpenStatusTag from '@/features/explore/components/OpenStatusTag.vue'
<OpenStatusTag :open="true" /> ---> 接案中（橘框橘字）
<OpenStatusTag :open="false" /> ---> 暫不接案（灰框灰字）
Amilu 燈是衍生值，由外面算好再傳 open，這裡不存、不判斷
*/
defineProps<{
  open: boolean
}>()
</script>

<style lang="scss" scoped>
.open-status-tag {
  display: inline-block;
  width: fit-content;
  padding: 2px 10px;
  border: 1px solid currentColor;
  border-radius: 10px;
  color: var(--color-status-open);
  white-space: nowrap;
}

//-----暫不接案-----//
.open-status-tag--closed {
  color: var(--color-text-secondary);
}
</style>
