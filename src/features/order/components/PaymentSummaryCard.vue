<template>
  <div class="payment-summary-card">
    <div class="card-header">
      <span class="text-body card-title">{{ title }}</span>
      <OrderStatusTag :status="status" />
    </div>
    <span v-if="note" class="text-small note">{{ note }}</span>
    <div class="rows">
      <AmountRow
        v-for="row in rows"
        :key="row.label"
        :label="row.label"
        :value="row.value"
        :emphasis="row.emphasis"
      />
    </div>
    <span v-if="description" class="text-small description">{{ description }}</span>
    <div v-if="$slots.action" class="action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：款項卡（Figma 617:590），放在委託討論牆右欄最上面
用在：委託人最後階段待補款、創作者等待委託人補款、結案時的結算卡（已完成、已終止）
這張卡不算錢也不判斷狀態：金額、日期由頁面算好並格式化成文字再傳進來（衍生值不存，實際金額以後端為準）
範例：
使用前先 import：import PaymentSummaryCard from '@/features/order/components/PaymentSummaryCard.vue'
<PaymentSummaryCard
  title="尚需補付 NT$ 1,260"
  status="awaiting-top-up"
  :rows="[
    { label: '委託總額', value: 'NT$ 1,800' },
    { label: '已付款（訂金）', value: 'NT$ 540' },
    { label: '應補付', value: 'NT$ 1,260', emphasis: true },
    { label: '補款期限', value: '2026 / 10 / 30 23:59' },
  ]"
  description="你選擇先付訂金，乙方已上傳最後階段稿件。補款入帳後即完成結案、解鎖原檔。"
>
  <template #action><Button width="hug">前往補款</Button></template>
</PaymentSummaryCard>
note：已終止時的「誰在哪天申請終止、原因」，要換行就在字串裡寫 \n
按鈕由頁面用 #action 塞進來，按下去要做什麼也由頁面決定；沒傳就不佔位置
*/
import type { OrderStatusTagStatus } from '@/features/order/types'
import OrderStatusTag from '@/features/order/components/OrderStatusTag.vue'
import AmountRow from '@/features/order/components/AmountRow.vue'
defineProps<{
  title: string // 卡片標題，例如「尚需補付 NT$ 1,260」
  status: OrderStatusTagStatus // 標題旁的狀態標籤
  note?: string // 終止申請說明，有才顯示
  rows: {
    label: string
    value: string // 格式化好的文字（金額或日期）
    emphasis?: boolean // 這張卡要使用者看的那個數字（例如應補付）
  }[]
  description?: string // 明細下方的灰色說明，有才顯示
}>()
</script>

<style lang="scss" scoped>
// 卡片：淺灰底、內距 24、圓角 16，各塊間距 12（Figma 617:590）。寬度由外面決定
.payment-summary-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  background: var(--color-bg-subtle);
}

// 標題列：標題＋狀態標籤，間距 12
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

// .text-body 是 regular，Figma 的標題是 medium
.card-title {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

// 標籤不被長標題擠扁
.card-header > :last-child {
  flex-shrink: 0;
}

// 明細：款項列一列一列往下排，間距 8（比卡片各塊的 12 小）
.rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 終止說明和底部說明：灰色小字
.note,
.description {
  color: var(--color-text-secondary);
}

// 保留字串裡的 \n，終止說明才能照 Figma 分兩行
.note {
  white-space: pre-line;
}

// 按鈕靠左、寬度跟著文字（按鈕本身傳 width="hug"）
.action {
  display: flex;
}
</style>
