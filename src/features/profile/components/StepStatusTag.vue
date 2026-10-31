<template>
  <span class="text-small step-status-tag" :class="{ 'step-status-tag--done': done }">
    {{ done ? '已完成' : '未完成' }}
  </span>
</template>

<script setup lang="ts">
/*
元件名稱：開通清單的步驟狀態標籤（features.md 3.4）
樣式與 order 的 OrderStatusTag「已完成」「未完成」相同，但 features 之間不互相 import，所以這裡自己帶一份
範例：
使用前先 import：import StepStatusTag from '@/features/profile/components/StepStatusTag.vue'
<StepStatusTag :done="true" /> ---> 已完成（綠底）
<StepStatusTag :done="false" /> ---> 未完成（淺灰底）
*/
defineProps<{
  done: boolean
}>()
</script>

<style lang="scss" scoped>
// 未完成：淺灰底灰字
.step-status-tag {
  display: inline-block;
  width: fit-content;
  padding: 2px 12px;
  border-radius: 999px;
  background: var(--color-bg-subtle);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

// 已完成：綠底黑字
.step-status-tag--done {
  background: var(--color-success-bg);
  color: var(--color-text-primary);
}
</style>
