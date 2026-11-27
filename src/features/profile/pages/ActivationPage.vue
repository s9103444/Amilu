<template>
  <div class="activate-page">
    <div class="page-heading">
      <p class="text-small breadcrumb">首頁／開通創作者模式</p>
      <h1 class="text-h2">開通創作者模式</h1>
    </div>
    <InfoBox
      >完成以下三個步驟後按「確認開通」即可開始接案，不需審核。步驟完成順序不限，每一步存檔後會回到這一頁。</InfoBox
    >
    <!-- 三步完成了沒由頁面傳三個事實進去，清單卡自己算打勾、標籤、按鈕 -->
    <!-- TODO 第 3 輪：@action 依 key 換頁或開委託項目燈箱，先不做事 -->
    <ActivationSteps
      :phone-verified="phoneVerified"
      :masked-phone="maskedPhone ?? undefined"
      :settings-done="settingsDone"
      :has-commission-item="hasCommissionItem"
      @action="() => {}"
    />
    <div class="check-layout">
      <!-- 全部完成就不用提示 -->
      <span v-if="remainingCount > 0" class="text-note remaining"
        >還有 {{ remainingCount }} 個步驟未完成，完成後才能按「確認開通」</span
      >
      <!-- 三步都完成前反灰（features.md 3.4）；TODO 第 4 輪接 POST /me/creator-onboarding/confirm -->
      <Button class="confirm" :disabled="remainingCount > 0">確認開通</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
頁面：開通創作者模式（/me/activate，Figma 581:5741，features.md 3.4）
三步驟清單：手機驗證、接案設定、新增委託項目；完成順序不限，三步都完成才能按「確認開通」
*/
import { computed, onMounted, ref } from 'vue'
import InfoBox from '@/shared/components/InfoBox.vue'
import ActivationSteps from '@/features/profile/components/ActivationSteps.vue'
import Button from '@/shared/components/Button.vue'
import { fetchCreatorOnboarding } from '@/features/profile/api'

// 三個事實＋遮好的手機號碼；API 回來前先當作都沒完成，回來後由 onMounted 蓋掉
// 不用 defineProps：這是路由直接打開的頁面，沒有父元件傳值進來
const phoneVerified = ref(false)
const settingsDone = ref(false)
const hasCommissionItem = ref(false)
const maskedPhone = ref<string | null>(null) // 例如 0912-***-678；沒手機是 null

// 【三個事實改變時自動重算】還沒完成的步數：filter 留下 false 的，數有幾個
const remainingCount = computed(
  () =>
    [phoneVerified.value, settingsDone.value, hasCommissionItem.value].filter((done) => !done)
      .length,
)

// 【流程①：頁面打開時】抓三步驟的完成狀態（GET /me/creator-onboarding），放進上面四個 ref，清單卡和 remainingCount 會跟著更新
onMounted(async () => {
  const creatorOnboardingInfo = await fetchCreatorOnboarding()
  if (!creatorOnboardingInfo) return // 沒登入：維持全部未完成
  phoneVerified.value = creatorOnboardingInfo.phone_verified
  maskedPhone.value = creatorOnboardingInfo.masked_phone
  settingsDone.value = creatorOnboardingInfo.settings_done
  hasCommissionItem.value = creatorOnboardingInfo.has_commission_item
})
</script>

<style lang="scss" scoped>
// 版心同接案設定頁：寬 888 置中，每一塊上下間距 32（Figma 581:5750）
.activate-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
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

// 麵包屑、未完成提示：灰字
.breadcrumb,
.remaining {
  color: var(--color-text-secondary);
}

// 按鈕列：提示文字＋確認開通靠右；窄螢幕放不下時換行
.check-layout {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
}

// 確認開通：Figma 固定寬 200（581:5811）
// 前面加 .check-layout 提高權重，才蓋得過 Button 自己的 width: 100%
.check-layout .confirm {
  width: 200px;
}
</style>
