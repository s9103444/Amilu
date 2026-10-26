<template>
  <article class="order-card">
    <div class="counterpart">
      <!-- 沒傳頭像時改用預設圖 -->
      <img class="avatar" :src="avatarUrl ?? '/picture/default-user-pic.png'" alt="" />
      <span class="text-small role">{{ ROLE_LABEL[role] }}</span>
    </div>

    <div class="info">
      <div class="heading">
        <h3 class="text-title title">{{ title }}</h3>
        <OrderStatusTag :status="status" />
      </div>
      <p class="text-caption meta">{{ counterpart }}</p>
      <p class="text-small meta">{{ timeInfo }}</p>
    </div>

    <div v-if="amount || statusNote || $slots.action" class="side">
      <p v-if="amount" class="text-title amount">{{ amount }}</p>
      <p v-if="statusNote" class="text-caption meta">{{ statusNote }}</p>
      <slot name="action"></slot>
    </div>
  </article>
</template>

<script setup lang="ts">
/*
元件名稱：委託案件卡（Figma 558:211，約稿管理列表的一張案件）
範例：
使用前先 import：import OrderCard from '@/features/order/components/OrderCard.vue'
<OrderCard
  role="creator" status="awaiting-quote" title="頭像（肩膀以上）"
  counterpart="創作者暱稱 @creator_id" time-info="申請時間 2026 / 10 / 01　・　等待創作者報價"
  amount="NT$ 4,500"
>
  <template #action><Button variant="secondary" width="hug">查看委託</Button></template>
</OrderCard>
左邊只放「對方」：已委託的案件對方是創作者（role="creator"），已接案的案件對方是委託人（role="commissioner"）。
狀態標籤由 status 決定（用 OrderStatusTag 畫）；按鈕放在 #action，
需要使用者動手的用主要按鈕、查看類用次要按鈕；沒有可做的動作就不放按鈕，改傳 status-note 顯示狀態說明。
案件畫面讀契約快照，標題、金額、時間都由外面算好再傳，這裡不判斷也不計算。
*/
import OrderStatusTag from '@/features/order/components/OrderStatusTag.vue'
import type { OrderStatusTagStatus } from '@/features/order/types'

defineProps<{
  role: 'creator' | 'commissioner'
  status: OrderStatusTagStatus
  title: string
  counterpart: string
  timeInfo: string
  amount?: string
  statusNote?: string
  avatarUrl?: string
}>()

// 甲方＝委託人＝commissioner；乙方＝創作者＝creator
const ROLE_LABEL = { creator: '創作者', commissioner: '委託人' }
</script>

<style lang="scss" scoped>
.order-card {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;
  border-radius: 16px;
  background: var(--color-bg-page);
}

//-----對方（頭像＋身分）-----//
.counterpart {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  object-fit: cover;
}

.role {
  padding: 0 8px;
  color: var(--color-text-primary);
  white-space: nowrap;
}

//-----案件資訊-----//
.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0; // 讓標題太長時可以縮短，不會把整張卡撐破
}

.heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta {
  margin: 0;
  color: var(--color-text-secondary);
}

//-----右側（金額、狀態說明、按鈕）-----//
.side {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: flex-end;
  gap: 8px;
}

.amount {
  margin: 0;
  color: var(--color-text-primary);
  white-space: nowrap;
}
</style>
