<template>
  <div class="schedule-card">
    <!-- ① 標題列：標籤依能不能改切換黑底／淺灰底 -->
    <div class="card-header">
      <span class="text-title header-title">委託排程</span>
      <span class="text-small tag" :class="{ 'tag--editable': editable }">
        {{ editable ? '可編輯' : '唯讀' }}
      </span>
    </div>

    <!-- ② 時程：每列左邊的灰點由 StageDeadlineRow 畫，點和點之間的直線由這裡的 li 畫 -->
    <ul class="timeline">
      <li class="timeline-item">
        <StageDeadlineRow v-model="startDate" label="開始日期" :editable="editable" />
      </li>
      <!-- 每個階段一列：三點分段跑 1、4、5，五點分段跑 1～5 -->
      <!-- 已報價時中間各階段的日期是灰字（只供參考），開始日期和截稿日期是黑字（Figma 590:369） -->
      <li v-for="no in stageNos" :key="no" class="timeline-item">
        <StageDeadlineRow
          v-model="deadlines[no]"
          :label="stageRowLabel(no)"
          :editable="editable"
          :muted="no !== 5"
        />
      </li>
    </ul>

    <hr class="divider" />

    <!-- ③ 金額：從報價算出來，有數字黑字、「確認中」灰字 -->
    <div class="amounts">
      <div class="amount-row">
        <span class="text-caption amount-label">{{ '訂金（' + depositPercent + '%）' }}</span>
        <span class="text-caption" :class="deposit === null ? 'pending' : 'value'">
          {{ formatPrice(deposit) }}
        </span>
      </div>
      <div class="amount-row">
        <span class="text-caption amount-label">其餘支付額</span>
        <span class="text-caption" :class="rest === null ? 'pending' : 'value'">
          {{ formatPrice(rest) }}
        </span>
      </div>
    </div>

    <hr class="divider" />

    <!-- ④ 最終報價：能改是輸入框；唯讀有值是大字，沒值是灰色「確認中」 -->
    <div class="quote-row">
      <span class="text-body quote-label">最終報價</span>
      <label v-if="editable" class="text-title quote-input">
        <span>NT$</span>
        <input
          class="quote-field"
          type="number"
          inputmode="numeric"
          min="0"
          aria-label="最終報價"
          :value="quoteAmount"
          @input="onQuoteInput"
        />
      </label>
      <span v-else-if="quoteAmount !== null" class="text-title value">
        {{ formatPrice(quoteAmount) }}
      </span>
      <span v-else class="text-caption pending">確認中</span>
    </div>

    <!-- ⑤ 底部說明 -->
    <p class="text-small pending note">
      {{
        editable
          ? '訂金比例依接案設定，訂金與其餘支付額由系統依最終報價自動計算，不可修改。'
          : '確認報價並送出付款資訊後，3 天內未完成匯款，本次委託將自動取消。'
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：委託排程卡（Figma 590:522），創作者報價、委託人等報價、付款頁都用這張
三種樣子由兩個值推出來，不另外傳狀態：
- editable 為 true：創作者報價中，日期和報價都能改
- editable 為 false、沒有資料：委託人等報價，全部顯示「確認中」
- editable 為 false、有資料：報價送出後，顯示日期與金額
範例：
使用前先 import：import ScheduleCard from '@/features/order/components/ScheduleCard.vue'
<ScheduleCard
  v-model:quote-amount="quote"
  v-model:start-date="startDate"
  v-model:deadlines="deadlines"
  stage-plan="三點分段"
  :deposit-percent="30"
  editable
/>
deadlines 用 stage_no 當鑰匙，例如三點分段 { 1: '2026-10-11', 4: '2026-10-20', 5: '2026-11-30' }
*/
import StageDeadlineRow from '@/features/order/components/StageDeadlineRow.vue'
import type { StageNo } from '@/features/order/types'
import { computed } from 'vue'
import { STAGE_LABEL } from '@/features/order/stageLabel'
import { formatAmount } from '@/shared/utils/formatAmount'
const quoteAmount = defineModel<number | null>('quoteAmount', { default: null })
const startDate = defineModel<string>('startDate', { default: '' })
const deadlines = defineModel<Partial<Record<StageNo, string>>>('deadlines', {
  default: () => ({}),
})

const props = withDefaults(
  defineProps<{
    stagePlan: '三點分段' | '五點分段' // ORDER.stage_plan_snapshot
    editable?: boolean // 沒寫就是唯讀
    depositPercent: number // ORDER.deposit_percent_snapshot
  }>(),
  {
    editable: false,
  },
)

// 這次要畫哪幾個階段（stage_no 不遞補，data-model.md 4.2）
const stageNos = computed<StageNo[]>(() => {
  if (props.stagePlan === '三點分段') {
    return [1, 4, 5]
  }
  return [1, 2, 3, 4, 5]
})

// 金額從報價算，不另外存（衍生值不存）。只用來顯示，實際應付金額由後端重算
// 訂金＝總價 × 訂金%，無條件捨去（order-lifecycle.md「階段金額拆分」）
const deposit = computed<number | null>(() => {
  if (quoteAmount.value === null) {
    return null
  }
  return Math.floor((quoteAmount.value * props.depositPercent) / 100)
})

const rest = computed<number | null>(() => {
  if (quoteAmount.value === null || deposit.value === null) {
    return null
  }
  return quoteAmount.value - deposit.value
})

function formatPrice(n: number | null): string {
  if (n === null) {
    return '確認中'
  }
  return formatAmount(n)
}

// 每一列左邊的文字：完稿那段是整筆委託的截稿日，其他是「草稿交稿」這種
function stageRowLabel(no: StageNo) {
  if (no === 5) {
    return '截稿日期'
  }
  return STAGE_LABEL[no] + '交稿'
}

// 創作者每打一個字就會呼叫一次
function onQuoteInput(event: Event) {
  const text = (event.target as HTMLInputElement).value
  // 刪光時存 null，畫面和金額才會回到「確認中」；輸入框給的是文字，要轉成數字
  if (text === '') {
    quoteAmount.value = null
  } else {
    quoteAmount.value = Number(text)
  }
}
</script>

<style lang="scss" scoped>
// 卡片：白底、圓角 24、內距 32，五塊之間間距 24（Figma 590:232）。寬度由外面決定
.schedule-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 32px;
  border-radius: 24px;
  background: var(--color-bg-page);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-title {
  color: var(--color-text-primary);
}

// 唯讀：淺灰底灰字（同 StageTag）；可編輯：黑底白字
.tag {
  flex-shrink: 0;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--color-bg-subtle);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.tag--editable {
  background: var(--color-bg-inverse);
  color: var(--color-text-on-dark);
}

.timeline {
  margin: 0;
  padding: 0;
  list-style: none;
}

// 直線：每列（最後一列除外）從自己的點中心畫到下一列的點中心。
// 同一張卡的每列一樣高，所以 top 50%、高 100% 剛好接到下一個點；
// 不寫死 26／35px，字級隨斷點變時也對得上。點 10px，線 2px 放在 left 4px 才會置中
.timeline-item {
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 4px;
  width: 2px;
  height: 100%;
  background: var(--color-border);
}

// 分隔線：整條 1px（MenuDivider 有左右留白和透明度，是 header 選單用的）
.divider {
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

.amounts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.amount-row,
.quote-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.amount-label {
  color: var(--color-text-primary);
}

// 有數字是黑字，「確認中」和底部說明是灰字
.value {
  color: var(--color-text-primary);
  white-space: nowrap;
}

.pending {
  color: var(--color-text-secondary);
  white-space: nowrap;
}

// .text-body 是 regular，Figma 的「最終報價」是 medium
.quote-label {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

// 報價輸入框：白底、深色框、圓角 10。Figma 內距 8／16 含框線，CSS 的框在內距外面，所以各扣 1px
.quote-input {
  display: flex;
  align-items: center;
  gap: 0.3em;
  padding: 7px 15px;
  border: 1px solid var(--color-border-strong);
  border-radius: 10px;
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  cursor: text;
}

// 點輸入框任何地方都看得到外框（數字欄本身不畫框）
.quote-input:focus-within {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

// 數字欄寬度跟著內容長；不支援 field-sizing 的瀏覽器先給 6 個字寬
.quote-field {
  width: 6ch;
  min-width: 2ch;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  background: none;
  color: inherit;
  font: inherit;
  appearance: textfield; // 拿掉數字欄右邊的上下箭頭
  field-sizing: content;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
}

// 有寫 width 時 field-sizing 不會生效，支援的瀏覽器改回 auto
@supports (field-sizing: content) {
  .quote-field {
    width: auto;
  }
}

// 說明是一段話，要能換行
.note {
  margin: 0;
  white-space: normal;
}
</style>
