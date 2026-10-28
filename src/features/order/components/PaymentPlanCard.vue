<template>
  <label class="plan" :class="{ 'plan--selected': isSelected }">
    <!-- 真正的 radio 藏起來：同一個 name 的一組只能選一個，鍵盤可用方向鍵切換（同 OptionButton） -->
    <input v-model="selected" class="native" type="radio" :name="name" :value="value" />
    <span class="heading">
      <span class="radio" aria-hidden="true"></span>
      <span class="title text-caption">{{ title }}</span>
      <span v-if="isSelected" class="badge text-small">已選擇</span>
    </span>
    <span class="amount text-title">{{ amount }}</span>
    <span class="note text-small">{{ note }}</span>
  </label>
</template>

<script setup lang="ts">
/*
元件名稱：付款方案卡（Figma 600:122），付款資訊頁的「先付訂金／一次付清」二選一
選取時除了換底色，還有單選圈變實心、右上出現「已選擇」，不只靠顏色區分。
範例：
使用前先 import：import PaymentPlanCard from '@/features/order/components/PaymentPlanCard.vue'
<PaymentPlanCard v-model="plan" name="payment-plan" value="deposit"
  title="先付訂金（30%）" amount="NT$ 540" note="其餘 NT$ 1,260 於最終結算時補齊" />
<PaymentPlanCard v-model="plan" name="payment-plan" value="full"
  title="一次付清" amount="NT$ 1,800" note="全額由平台託管，最終結算時無需補款" />
同一組共用同一個 v-model 和 name；plan 會變成被選那張的 value。
金額是衍生值，由外面算好再傳（訂金、其餘補款都不在這裡算）。
「無需先支付」的項目只提供一次付清，要不要顯示「先付訂金」那張由使用的頁面決定。
*/
import { computed } from 'vue'

const props = defineProps<{
  name: string // 同一組的名字，瀏覽器靠它判斷「這幾張只能選一個」
  value: string // 這張代表的方案，被選時存進 v-model
  title: string // 方案名稱
  amount: string // 金額（已格式化，例如 NT$ 540）
  note: string // 底部說明
}>()
const selected = defineModel<string>({ default: '' })

const isSelected = computed(() => selected.value === props.value)
</script>

<style lang="scss" scoped>
// 未選取：白底、淡灰 1px 框。
// Figma 的框是畫在卡片內側，內距 24 含框線；CSS 的框在內距外面，所以內距要扣掉框線寬度，
// 選取時框線變 2px、內距跟著少 1px，切換時文字才不會跳
.plan {
  position: relative; // 讓藏起來的原生 radio 待在這裡
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 23px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-bg-page);
  cursor: pointer;
  transition: border-color 0.3s ease;
}

// 已選取：淺橘底、2px 橘框
.plan--selected {
  padding: 22px;
  border: 2px solid var(--color-selected-border);
  background: var(--color-selected-bg);
}

// 藏起原生 radio，但不用 display: none（那樣鍵盤就選不到了）
.native {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}

// 用鍵盤移到這裡時顯示外框，滑鼠點擊不顯示（同 OptionButton）
.plan:has(.native:focus-visible) {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

.heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

// 單選圈：未選是白底淡灰框
.radio {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: 1.5px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg-page);
}
// 已選：6px 深色框，中間留白，看起來就是實心圓點
.plan--selected .radio {
  border: 6px solid var(--color-bg-inverse);
}

.title {
  flex: 1;
  min-width: 0;
  color: var(--color-text-primary);
}

.badge {
  flex-shrink: 0;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--color-selected-badge-bg);
  color: var(--color-text-on-dark);
  white-space: nowrap;
}

// 未選的金額是灰色，選了才變深
.amount {
  color: var(--color-text-secondary);
  white-space: nowrap;
}
.plan--selected .amount {
  color: var(--color-text-primary);
}

.note {
  color: var(--color-text-secondary);
}

// Figma 沒畫 hover，前端自訂：只有未選的那張框線變橘，提示可以點。
// 已選的還有淺橘底、2px 框、實心圓點和「已選擇」小標，所以滑過的不會跟已選的混淆
@media (hover: hover) {
  .plan:not(.plan--selected):hover {
    border-color: var(--color-selected-border);
  }
}
</style>
