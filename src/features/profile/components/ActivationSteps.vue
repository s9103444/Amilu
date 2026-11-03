<template>
  <div class="card">
    <!-- 三步的文字來自 ACTIVATION_STEPS，完成了沒由 props 對照 key 算出來 -->
    <template v-for="(step, index) in ACTIVATION_STEPS" :key="step.key">
      <!-- 分隔線只夾在兩列中間，第一列上面不畫 -->
      <hr v-if="index > 0" class="divider" />
      <ActivationStepsItem
        :number="step.number"
        :title="step.title"
        :note="noteOf(step)"
        :done="doneByKey[step.key]"
        @action="emit('action', step.key)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：開通創作者商店的步驟清單卡（features.md 3.4，Figma 581:5776）
頁面只要傳三個事實進來，每一步完成了沒、Step1 說明要顯示什麼，都在這裡算
範例：
使用前先 import：import ActivationSteps from '@/features/profile/components/ActivationSteps.vue'
<ActivationSteps
  :phone-verified="true"
  masked-phone="0912-***-678"
  :settings-done="false"
  :has-commission-item="false"
  @action="(key) => ..."
/>
*/
import { computed } from 'vue'
import ActivationStepsItem from '@/features/profile/components/ActivationStepsItem.vue'
import {
  ACTIVATION_STEPS,
  type ActivationStep,
  type ActivationStepKey,
} from '@/features/profile/activationSteps'

const props = defineProps<{
  phoneVerified: boolean // 手機驗證過了沒
  maskedPhone?: string // 已遮罩的手機號碼，例如 0912-***-678；遮罩由頁面做好再傳
  settingsDone: boolean // 接案設定填完了沒
  hasCommissionItem: boolean // 有沒有至少 1 筆可委託項目
}>()
const emit = defineEmits<{
  action: [key: ActivationStepKey] // 哪一步的按鈕被點了，頁面再依 key 決定去哪
}>()

// 完成狀態不存，每次都由三個事實推出來
const doneByKey = computed<Record<ActivationStepKey, boolean>>(() => ({
  verify: props.phoneVerified,
  settings: props.settingsDone,
  'commission-item': props.hasCommissionItem,
}))

// Step1 的說明要用手機號碼拼；還沒驗證時 Figma 沒畫說明，先不顯示
function noteOf(step: ActivationStep): string | undefined {
  if (step.key !== 'verify') return step.note
  return props.phoneVerified && props.maskedPhone ? `已驗證 ${props.maskedPhone}` : undefined
}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  border-radius: 24px;
  background: var(--color-bg-page);
}

// 用 hr 讓分隔線有語意；瀏覽器預設的 margin 和立體框線要清掉
.divider {
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}
</style>
