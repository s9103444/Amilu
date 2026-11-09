<template>
  <div class="order-side-panel">
    <div class="parties">
      <div v-for="party in parties" :key="party.role" class="party">
        <img class="avatar" :src="party.info.avatarUrl ?? DEFAULT_AVATAR_URL" alt="" />
        <span
          class="text-small role-tag"
          :class="{ 'role-tag--me': party.role === props.viewerRole }"
          >{{ party.label }}</span
        >
        <div class="names">
          <span class="text-small nickname">{{ party.info.nickname }}</span>
          <span class="text-small user-id">@{{ party.info.userId }}</span>
        </div>
      </div>
    </div>
    <hr class="divider" />
    <div class="title-row">
      <span class="text-title">{{ title }}</span>
      <OrderStatusTag :status="status" />
    </div>

    <div class="info-rows">
      <AmountRow label="委託總額" :value="formatAmount(props.totalAmount)" />
      <template v-if="status === 'in-progress'">
        <AmountRow label="目前階段" :value="STAGE_LABEL[currentStage]" />
        <AmountRow label="本階段截止" :value="formatDate(props.stageDeadline ?? '')" />
      </template>
      <AmountRow v-else label="結案時間" :value="formatDate(props.closedAt ?? '')" />
      <AmountRow label="修改次數" :value="`包含 ${revisionCount} 次`" />
    </div>
    <StageProgress :stages="stageNos" :current="currentStage" />
    <hr class="divider" />
    <nav class="menu">
      <SideMenuItem
        title="委託討論牆"
        :status="active === 'wall' ? 'selected' : 'default'"
        @click="emit('select', 'wall')"
      />
      <SideMenuItem
        title="委託項目檢視"
        :status="active === 'item' ? 'selected' : 'default'"
        @click="emit('select', 'item')"
      />
      <SideMenuItem
        v-if="status === 'in-progress'"
        title="申請終止合作"
        :status="'danger'"
        @click="emit('select', 'terminate')"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：委託討論牆左欄（Figma 616:517），正式委託後（製作中、已完成、已終止）的案件頁左側
三種樣子由 status 推出來，不另外傳狀態：
- status 為 'in-progress'：顯示目前階段、本階段截止，選單多一個「申請終止合作」（製作中永遠可以按，橘字）
- status 為 'completed' 或 'terminated'：改顯示結案時間，沒有「申請終止合作」
目前在哪個階段不存在訂單裡，由頁面從 OrderStage 找第一個未確認的階段再傳進來（data-model.md 5.1）
範例：
使用前先 import：import OrderSidePanel from '@/features/order/components/OrderSidePanel.vue'
<OrderSidePanel
  :creator="{ nickname: '月光素描', userId: 'moon_sketch' }"
  :commissioner="{ nickname: '小明', userId: 'ming' }"
  viewer-role="commissioner"
  title="頭像（肩膀以上）"
  status="in-progress"
  :total-amount="1800"
  :revision-count="2"
  stage-plan="五點分段"
  :current-stage="1"
  stage-deadline="2026-10-11"
  :active="active"
  @select="onSelect"
/>
點選單時只送 select 事件，這個元件自己不換選中項目：
- 收到 'wall' 或 'item'：頁面把 active 改成它，選中的底色才會跟著換
- 收到 'terminate'：頁面只打開終止合作的燈箱，不改 active
*/
import type { StageNo } from '@/features/order/types'
import { computed } from 'vue'
import OrderStatusTag from '@/features/order/components/OrderStatusTag.vue'
import AmountRow from '@/features/order/components/AmountRow.vue'
import { STAGE_LABEL } from '@/features/order/stageLabel'
import StageProgress from '@/features/order/components/StageProgress.vue'
import SideMenuItem from '@/shared/components/SideMenuItem.vue'
import { formatAmount } from '@/shared/utils/formatAmount'
import { formatDate } from '@/features/order/formatDate'
import { DEFAULT_AVATAR_URL } from '@/shared/constants'
type Party = {
  nickname: string
  userId: string
  avatarUrl?: string | null
}
const props = defineProps<{
  creator: Party
  commissioner: Party
  viewerRole: 'creator' | 'commissioner'
  title: string
  status: 'in-progress' | 'completed' | 'terminated'
  totalAmount: number
  revisionCount: number
  stagePlan: '三點分段' | '五點分段'
  currentStage: StageNo
  stageDeadline?: string
  closedAt?: string
  active: 'wall' | 'item'
}>()
const emit = defineEmits<{
  select: [key: 'wall' | 'item' | 'terminate']
}>()
const parties = computed(() => [
  { role: 'creator', label: '創作者', info: props.creator },
  { role: 'commissioner', label: '委託人', info: props.commissioner },
])

const stageNos = computed<StageNo[]>(() => {
  if (props.stagePlan === '三點分段') {
    return [1, 4, 5]
  }
  return [1, 2, 3, 4, 5]
})
</script>

<style lang="scss" scoped>
// 卡片：白底、內距 32、圓角 24，各區塊間距 20（Figma 616:398）。寬度由外面決定
.order-side-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 32px;
  border-radius: 24px;
  background: var(--color-bg-page);
}

//-----① 雙方（Figma 616:399）-----//
// 兩欄平分寬度，創作者在左、委託人在右
.parties {
  display: flex;
  gap: 16px;
}

// 每一欄由上到下：頭像、身分標籤、暱稱與 @id，置中排列
// min-width: 0 讓暱稱太長時可以被截斷，不會把另一欄擠走
.party {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

// 頭像（圓角方形，全站統一 --radius-avatar）
.avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-avatar);
  object-fit: cover;
}

// 身分標籤：一般是淺灰底灰字（同 StageTag）
.role-tag {
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--color-bg-subtle);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

// 目前看畫面的那一方：黑底白字
.role-tag--me {
  background: var(--color-bg-inverse);
  color: var(--color-text-on-dark);
}

// 暱稱和 @id 過長時顯示「…」
.nickname,
.user-id {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 暱稱和 @id 在 Figma 是同一組、中間沒有間距（外面再包一層 .names 才對得上）
.names {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
}

.nickname {
  color: var(--color-text-primary);
}

// Figma 是 neutral/300，沒有對應的文字 token，先跟 UserInfoBar 一樣用次要文字色
.user-id {
  color: var(--color-text-secondary);
}
//-----② 標題列：標題＋狀態標籤-----//
.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

// 標籤不被長標題擠扁
.title-row > :last-child {
  flex-shrink: 0;
}

//-----③ 案件資訊（AmountRow 一列一列往下排）-----//
.info-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

// 分隔線：整條 1px（MenuDivider 有左右留白和透明度，是 header 選單用的）
.divider {
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

//-----④ 選單（Figma 選單，項目之間間距 4）-----//
.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
