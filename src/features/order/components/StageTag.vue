<template>
  <span class="text-small stage-tag">
    <img v-if="confirmed" src="/icons/check.svg" alt="" />
    {{ STAGE_LABEL[stage_no] }}
  </span>
</template>

<script setup lang="ts">
/*
元件名稱：階段標籤（案件的每個階段，標示是否已確認）
範例：
使用前先 import：import StageTag from '@/features/order/components/StageTag.vue'
<StageTag :stage_no="1" /> ---> 草稿（未確認）
<StageTag :stage_no="4" confirmed /> ---> 精稿，前面多一個勾勾（已確認）
文字由 stage_no 對照（features/order/stageLabel.ts），三點分段的 stage_no 是 1／4／5
*/
import { STAGE_LABEL } from '@/features/order/stageLabel'
import type { StageNo } from '@/features/order/types'

defineProps<{
  stage_no: StageNo
  confirmed?: boolean
}>()
</script>

<style lang="scss" scoped>
.stage-tag {
  display: inline-flex;
  // 圖示在前時，inline-flex 的基線會跟著圖片底部，整個標籤會往上飄；改成依方框置中對齊
  vertical-align: middle;
  align-items: center;
  gap: 4px;
  width: fit-content;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--color-bg-subtle);
  color: var(--color-text-secondary);
  white-space: nowrap;

  & > img {
    width: 14px;
    height: 14px;
  }
}
</style>
