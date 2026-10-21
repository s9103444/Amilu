<template>
  <span class="text-small order-status-tag" :class="`order-status-tag--${tone}`">
    {{ ORDER_STATUS_LABEL[status] }}
  </span>
</template>

<script setup lang="ts">
/*
元件名稱：案件狀態標籤（約稿管理案件卡上的委託狀態）
範例：
使用前先 import：import OrderStatusTag from '@/features/order/components/OrderStatusTag.vue'
<OrderStatusTag status="awaiting-quote" /> ---> 待乙方報價
<OrderStatusTag status="in-progress" /> ---> 製作中
狀態值見 features/order/types.ts 的 OrderStatusTagStatus，文字與色調對照在 statusLabel.ts
每種狀態底色不同，但一定帶文字，不只靠顏色區分
*/
import { computed } from 'vue'
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from '@/features/order/statusLabel'
import type { OrderStatusTagStatus } from '@/features/order/types'

const props = defineProps<{
  status: OrderStatusTagStatus
}>()

const tone = computed(() => ORDER_STATUS_TONE[props.status])
</script>

<style lang="scss" scoped>
.order-status-tag {
  display: inline-block;
  width: fit-content;
  padding: 2px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

//-----等待某一方動作（橘）-----//
.order-status-tag--waiting {
  background: var(--color-error-bg);
  color: var(--color-error);
}

//-----進行中（藍）-----//
.order-status-tag--progress {
  background: var(--color-info);
  color: var(--color-text-primary);
}

//-----已完成（綠）-----//
.order-status-tag--done {
  background: var(--color-success-bg);
  color: var(--color-text-primary);
}

//-----已取消、已終止（灰）-----//
.order-status-tag--closed {
  background: var(--color-bg-main);
  color: var(--color-text-secondary);
}

//-----未完成（淺灰）-----//
// Figma 左右內距是 10px，其他狀態是 12px，這裡統一成 12px
.order-status-tag--incomplete {
  background: var(--color-bg-subtle);
  color: var(--color-text-secondary);
}
</style>
