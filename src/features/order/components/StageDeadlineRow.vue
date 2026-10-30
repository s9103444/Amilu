<template>
  <div class="date-item">
    <div class="date-title">
      <span class="gray-dot" aria-hidden="true"></span>
      <span class="text-caption label-title">{{ label }}</span>
    </div>

    <!-- 狀態①：可編輯（創作者報價時）。點整個框跳出日曆，還沒選日期時框裡顯示「確認中」 -->
    <div v-if="editable" class="date-option">
      <!-- 原生日期選擇器藏起來，只借用它的日曆和值。不用 hidden：hidden 的元素沒有位置，日曆會不知道要從哪裡彈出來 -->
      <input
        ref="dateInput"
        v-model="date"
        class="native"
        type="date"
        tabindex="-1"
        aria-hidden="true"
      />
      <button
        type="button"
        class="date-button"
        :aria-label="`${label}：選擇日期`"
        @click="showPick"
      >
        <span class="text-caption" :class="date ? 'date-text' : 'pending'">
          {{ date ? dateFormat : '確認中' }}
        </span>
        <img class="calendar" :src="base + 'icons/calendar.svg'" alt="" />
      </button>
    </div>
    <!-- 狀態②：唯讀、已有日期（報價送出後） -->
    <span v-else-if="date" class="text-caption date-text">{{ dateFormat }}</span>
    <!-- 狀態③：唯讀、還沒有日期（委託人等創作者報價時） -->
    <span v-else class="text-caption pending">確認中</span>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：委託排程的一列（Figma 600:144），放在「委託排程卡」（Figma 596:6754）裡
這一列不知道什麼是階段，只顯示外面傳進來的 label。
排程卡負責組出每一列：先放「開始日期」（ORDER.work_start_date），
再依分段方案跑 [1, 4, 5] 或 [1, 2, 3, 4, 5]，用 STAGE_LABEL 換成文字（ORDER_STAGE.deadline）。
範例：
使用前先 import：import StageDeadlineRow from '@/features/order/components/StageDeadlineRow.vue'
<StageDeadlineRow v-model="workStartDate" label="開始日期" :editable="isQuoting" />
date 的格式是原生日期選擇器的 'YYYY-MM-DD'，沒填時是 ''。
*/
import { computed, useTemplateRef } from 'vue'

defineProps<{
  label: string // 左邊文字，排程卡組好再傳進來
  editable: boolean // true＝創作者報價時可以選日期
}>()
const date = defineModel<string>({ default: '' })

const base = import.meta.env.BASE_URL
const dateInput = useTemplateRef<HTMLInputElement>('dateInput')
// '2026-11-30' → '2026 / 11 / 30'（Figma 的寫法）
const dateFormat = computed(() => date.value.replaceAll('-', ' / '))

// 點日期框時叫出原生日曆。舊版 Safari（16 以前）沒有 showPicker，退而求其次讓 input 取得焦點
function showPick() {
  const input = dateInput.value
  if (!input) return
  try {
    input.showPicker()
  } catch {
    input.focus()
  }
}
</script>

<style lang="scss" scoped>
.date-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 14px 0;
}

.date-title {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

// Figma 的節點是 10px 的 neutral/300 實心圓，和框線同色
.gray-dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background-color: var(--color-border);
}

.label-title {
  color: var(--color-text-primary);
}

.date-text {
  color: var(--color-text-primary);
  white-space: nowrap;
}

.pending {
  color: var(--color-text-secondary);
  white-space: nowrap;
}

// 讓藏起來的 input 以日期框為準，日曆會從框的左下角彈出
.date-option {
  position: relative;
  flex-shrink: 0;
}

.native {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  border: 0;
  opacity: 0;
  pointer-events: none;
}

// 日期框：淺灰底、1px 灰框。Figma 內距 8／12 含框線，CSS 的框在內距外面，所以各扣 1px
.date-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg-subtle);
  font: inherit;
  cursor: pointer;
}

// 用鍵盤移到這裡時顯示外框（同 PaymentPlanCard）
.date-button:focus-visible {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

.calendar {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}
</style>
