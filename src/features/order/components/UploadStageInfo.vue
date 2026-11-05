<template>
  <dl class="upload-stage-info text-caption">
    <div class="info-row">
      <dt class="info-label">上傳階段</dt>
      <dd class="info-value">{{ STAGE_LABEL[stageNo] }}</dd>
    </div>
    <div class="info-row">
      <dt class="info-label">本階段截止</dt>
      <dd class="info-value">{{ formattedDeadline }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
/*
元件名稱：本次上傳階段（Figma 626:104），放在創作者的「上傳作品」燈箱裡（features.md 4.4）
提醒創作者這次上傳的稿件會算在哪個階段、這階段什麼時候截止。唯讀，不能自選階段。
上傳目標固定是「目前第一個未確認的階段」，由頁面從 ORDER_STAGE 找出來再傳進來，這裡不判斷。
截止日只供參考，不會觸發任何系統動作（order-lifecycle.md）。
範例：
使用前先 import：import UploadStageInfo from '@/features/order/components/UploadStageInfo.vue'
<UploadStageInfo :stage-no="1" deadline="2026-10-11" />   ---> 上傳階段 草稿／本階段截止 2026 / 10 / 11
<UploadStageInfo :stage-no="4" deadline="2026-10-25" />   ---> 三點分段卡在精稿（stage_no 不遞補）
*/
import { computed } from 'vue'
import { STAGE_LABEL } from '@/features/order/stageLabel'
import type { StageNo } from '@/features/order/types'

const props = defineProps<{
  stageNo: StageNo // ORDER_STAGE.stage_no，目前第一個未確認的階段
  deadline: string // ORDER_STAGE.deadline，'YYYY-MM-DD'
}>()

// '2026-10-11' → '2026 / 10 / 11'（Figma 的寫法）
const formattedDeadline = computed(() => props.deadline.slice(0, 10).replaceAll('-', ' / '))
</script>

<style lang="scss" scoped>
// 淺灰底、上下內距 16、左右 20、圓角 12，兩列間距 8（Figma 626:104）。寬度由燈箱決定
.upload-stage-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin: 0;
  padding: 16px 20px;
  border-radius: 12px;
  background: var(--color-bg-subtle);
}

// 和款項列（AmountRow）相反：左邊名稱灰字、右邊內容黑字，所以不共用
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px; // Figma 沒有間距，前端自訂：文字太長時兩邊不會黏在一起
}

.info-label {
  min-width: 0;
  color: var(--color-text-secondary);
}

// 階段名稱和日期不斷成兩行
.info-value {
  flex-shrink: 0;
  margin: 0;
  color: var(--color-text-primary);
  white-space: nowrap;
}
</style>
