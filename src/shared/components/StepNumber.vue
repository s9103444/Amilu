<template>
  <span class="text-caption step-number">{{ number }}</span>
</template>

<script setup lang="ts">
/*
元件名稱：步驟編號（圓形）
範例：
使用前先 import：import StepNumber from '@/shared/components/StepNumber.vue'
<StepNumber :number="5" /> ---> 顯示「5」
*/
defineProps<{
  number: number | string
}>()
</script>

<style lang="scss" scoped>
.step-number {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: var(--color-bg-main);
  color: var(--color-accent-muted);
}
</style>
