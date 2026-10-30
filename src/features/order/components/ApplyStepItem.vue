<template>
  <div class="step" :class="{ 'step--reached': reached }">
    <!-- 18px 的狀態格，中間 8px 圓點：到了是黑點，還沒到是灰點 -->
    <span class="status" aria-hidden="true">
      <span class="dot"></span>
    </span>
    <!-- 編號和標題中間是全形空白，照 Figma -->
    <span class="text-small label">{{ number }}　{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：委託申請引導列的一項（Figma 600:176），放在委託申請頁旁邊
捲到該區塊時 reached 變 true：灰點灰字 → 黑點黑字（Figma 的 Completed／Incomplete）
Figma 的 Completed 畫的是打勾，改成黑點：打勾會被讀成「這塊已填完」，但這裡只代表捲到過（2026/10/30 決定）
這一項只負責顯示，「捲到哪一塊」由申請頁偵測後傳進來
範例：
使用前先 import：import ApplyStepItem from '@/features/order/components/ApplyStepItem.vue'
<ApplyStepItem :number="1" title="委託項目與規格" :reached="true" />
*/
defineProps<{
  number: number // 步驟編號
  title: string // 區塊名稱
  reached: boolean // 已經捲到這一塊（或更後面）
}>()
</script>

<style lang="scss" scoped>
.step {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
}

// Figma 匯出的是 18px 格子裡半徑 4 的圓
.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--color-step-todo);
}

.label {
  color: var(--color-step-todo);
  white-space: nowrap;
}

.step--reached .dot {
  background: var(--color-icon);
}

.step--reached .label {
  color: var(--color-text-primary);
}
</style>
