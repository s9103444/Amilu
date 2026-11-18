<template>
  <div class="orders-page">
    <div class="page-heading">
      <p class="text-small breadcrumb">首頁／約稿管理</p>
      <h1 class="text-h2">約稿管理</h1>
    </div>

    <!-- 頁籤區（Figma 559:2596）：主頁籤在上、子頁籤在下 -->
    <div class="tabs">
      <!-- 【流程②：點頁籤時觸發】TabBar 改 v-model → 執行 tab 的 set → 改網址 -->
      <TabBar
        v-model="tab"
        :items="[
          { value: 'commissioned', label: '已委託' },
          { value: 'received', label: '已接案' },
        ]"
      />
      <div class="sub-tabs">
        <OptionButton v-model="phase" name="phase" value="ongoing">進行中</OptionButton>
        <OptionButton v-model="phase" name="phase" value="history">已結案</OptionButton>
      </div>
    </div>

    <!-- 案件列表（Figma 559:2611）：orders 已由 api 篩好、排好（新到舊），這裡照順序畫 -->
    <!-- OrderCard 的 role 是「對方」：已委託的對方是創作者，已接案的對方是委託人 -->
    <div class="order-list">
      <OrderCard
        v-for="order in orders"
        :key="order.order_id"
        :role="tab === 'commissioned' ? 'creator' : 'commissioner'"
        :avatar-url="counterpartOf(order).avatar_url"
        :status="order.status"
        :title="order.item_title_snapshot"
        :counterpart="counterpartOf(order).nickname + ' @' + counterpartOf(order).id"
        :time-info="timeInfoOf(order)"
        :amount="amountOf(order)"
        :status-note="actionOf(order).note"
      >
        <!-- 有按鈕文字才放按鈕；按鈕先不接換頁（報價、付款、討論牆頁面都還沒做） -->
        <template v-if="actionOf(order).button" #action>
          <Button width="hug" :variant="actionOf(order).primary ? 'primary' : 'secondary'">
            {{ actionOf(order).button }}
          </Button>
        </template>
      </OrderCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TabBar from '@/shared/components/TabBar.vue'
import OptionButton from '@/shared/components/OptionButton.vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/features/order/formatDate'
import type { OrderListItem } from '@/features/order/types'
import { fetchOrders } from '@/features/order/api'
import OrderCard from '@/features/order/components/OrderCard.vue'
import Button from '@/shared/components/Button.vue'
import { formatAmount } from '@/shared/utils/formatAmount'
import { STAGE_LABEL } from '@/features/order/stageLabel'
/*
頁面：約稿管理（/me/orders，Figma 559:2525，features.md 3.7）
主頁籤（已委託／已接案）記在網址 ?tab=，重新整理或從別頁連過來都能停在指定頁籤
子頁籤（進行中／已結案）只用 ref 記，不放網址
*/
const phase = ref<'ongoing' | 'history'>('ongoing') // 改掉原本的 ref('ongoing')，型別才對得上 api
const orders = ref<OrderListItem[]>([]) // 目前要畫的案件
const route = useRoute() // 讀現在的網址
const router = useRouter() // 換網址

// 主頁籤：值永遠從網址讀出來，改的時候也是去改網址，畫面和網址才不會對不上
const tab = computed({
  // 【流程①：頁面打開、網址改變時觸發】網址寫 received 才是已接案，其他（沒寫、亂寫）都當已委託
  get: () => (route.query.tab === 'received' ? 'received' : 'commissioned'),
  // 【流程③：流程②之後觸發】用 replace 不用 push：切頁籤不多一筆瀏覽紀錄，按上一頁直接離開本頁
  // 改完網址會再觸發流程①，TabBar 就換亮新的那顆
  set: (value) => router.replace({ query: { tab: value } }),
})

// 【流程④：頁面打開（immediate）、tab 或 phase 改變時觸發】依頁籤重拿案件
// api 的 role 是「我」：已委託 → 我是委託人，已接案 → 我是創作者
watch(
  [tab, phase],
  async () => {
    const role = tab.value === 'commissioned' ? 'commissioner' : 'creator'
    orders.value = await fetchOrders(role, phase.value)
  },
  { immediate: true },
)

// ① 對方：已委託的對方是創作者，已接案的對方是委託人
function counterpartOf(order: OrderListItem) {
  return tab.value === 'commissioned' ? order.creator : order.commissioner
}
// ② 金額：還沒報價（null）就回傳 undefined，OrderCard 不顯示金額
function amountOf(order: OrderListItem) {
  if (order.quote_amount === null) return undefined
  return formatAmount(order.quote_amount)
}
// ③ 先算出要補的那段（extra），沒有就留空字串
function timeInfoOf(order: OrderListItem) {
  const applied = '申請時間 ' + formatDate(order.created_at)
  let extra = ''
  if (order.status === 'awaiting-quote') {
    extra = tab.value === 'commissioned' ? '等待創作者報價' : '等待你報價'
  }
  if (order.status === 'awaiting-payment' && order.payment_due_at) {
    extra = '付款期限 ' + formatDate(order.payment_due_at)
  }
  if (order.status === 'in-progress' && order.current_stage) {
    extra =
      STAGE_LABEL[order.current_stage.stage_no] + '截止 ' + formatDate(order.current_stage.deadline)
  }
  if (order.status === 'completed' && order.completed_at) {
    extra = '結案 ' + formatDate(order.completed_at)
  }
  if (order.status === 'terminated' && order.terminated_at) {
    extra = '終止 ' + formatDate(order.terminated_at)
  }
  return extra ? applied + '　|　' + extra : applied
}

// ④ 卡片右側（規則表在 features.md 3.7）：回傳三種之一
// { button, primary: true } ＝ 醒目按鈕（輪到我動手）、{ button } ＝ 一般按鈕（查看類）、{ note } ＝ 灰字說明（沒事可做）
type CardAction = { button?: string; primary?: boolean; note?: string }

function actionOf(order: OrderListItem): CardAction {
  const isCommissioner = tab.value === 'commissioned' // 我是委託人嗎
  if (order.status === 'awaiting-quote') {
    return isCommissioner ? { button: '查看委託' } : { button: '前往報價', primary: true }
  }
  if (order.status === 'awaiting-payment') {
    return isCommissioner ? { button: '前往付款', primary: true } : { note: '等待委託人付款' }
  }
  if (order.status === 'in-progress') {
    return { button: '進入討論牆' } // 兩邊一樣，不用判斷 isCommissioner
  }
  if (order.status === 'completed' || order.status === 'terminated') {
    return { button: '查看結案' } // 兩邊一樣
  }
  return { note: '委託已取消' } // 剩下的只有已取消：沒有結案畫面可進（features.md 4.5），不放按鈕
}
</script>

<style lang="scss" scoped>
// 整頁：置中、最寬 888，和個人資料設定頁一致（Figma 559:2534）；左右留白由 DefaultLayout 的 container 給
.orders-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4); // 頁首和頁籤區之間 32（Figma 559:2535 → 559:2596）
  max-width: 888px;
  margin: 0 auto;
  padding-block: var(--space-6);
}

.page-heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  color: var(--color-text-primary);

  h1,
  p {
    margin: 0;
  }
}

.breadcrumb {
  color: var(--color-text-secondary);
}

// 主頁籤和子頁籤之間 24（Figma 559:2597 → 559:2604）
.tabs {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

// 子頁籤之間 12（Figma 559:2604）
.sub-tabs {
  display: flex;
  gap: 12px;
}

// 卡片之間 16（Figma 559:2611）；頁籤區到列表的 32 由 .orders-page 的 gap 給
.order-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>
