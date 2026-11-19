<template>
  <div class="creator-settings">
    <!-- 存好後顯示 2 秒（流程③）；位置由 SavedToast 自己固定在視口上方中央 -->
    <SavedToast v-if="showSaved" />
    <div class="page-heading">
      <p class="text-small breadcrumb">首頁／接案設定</p>
      <h1 class="text-h2">接案設定</h1>
    </div>
    <!-- 未開通（Figma 553:2468）：沒有 CREATOR_PROFILE，或 store_approved 是 false，不顯示表單（features.md 3.5） -->
    <EmptyState
      v-if="!isActivated"
      icon="icons/store.svg"
      title="尚未開通創作者模式"
      description="開通後即可設定收款帳戶、訂金比例與修改次數。"
    >
      <!-- 開通頁 /me/activate 還沒做，先不接 -->
      <template #action><Button>前往開通</Button></template>
    </EmptyState>
    <!-- 已開通（Figma 553:2351）：能看到這裡的人一定已開通，所以「已開通」直接寫死 -->
    <template v-else>
      <InfoBox>修改設定只影響之後的新委託，已成立的案件會照當時的設定進行。</InfoBox>

      <section class="card">
        <h2 class="text-h3 card-title">接案狀態</h2>
        <div class="field">
          <div class="field-title">
            <p class="text-caption">創作者商店狀態</p>
            <p class="text-note hint">唯讀，由系統依開通申請判斷</p>
          </div>
          <span class="text-small store-status">已開通</span>
        </div>
        <hr class="divider" />
        <!-- Amilu 燈：手動開關；第 3 輪儲存時，有改才另外打 PATCH /me/creator-settings/amilu-light（features.md 3.5） -->
        <div class="field">
          <p class="text-caption">Amilu 燈</p>
          <div class="options">
            <OptionButton v-model="lightStatus" name="light" value="開放">開放</OptionButton>
            <OptionButton v-model="lightStatus" name="light" value="暫停">暫停</OptionButton>
          </div>
          <p class="text-note hint">
            暫停時，你的可委託項目不會出現在首頁，委託人也無法送出新委託。
          </p>
        </div>
      </section>

      <section class="card">
        <h2 class="text-h3 card-title">收款與委託條件</h2>
        <!-- 收款帳戶：銀行代碼、帳號、戶名，字數上限對齊 CREATOR_PROFILE 欄位長度 -->
        <div class="field">
          <div class="field-title">
            <p class="text-caption">收款帳戶</p>
            <p class="text-note required">必填</p>
          </div>
          <div class="payout-row">
            <FormInput
              v-model="bankCode"
              :maxlength="3"
              :error="errors.bankCode"
              inputmode="numeric"
              placeholder="例如：812"
              >銀行代碼</FormInput
            >
            <FormInput
              v-model="accountNo"
              :maxlength="20"
              inputmode="numeric"
              :error="errors.accountNo"
              placeholder="請輸入收款帳號"
              >帳號</FormInput
            >
            <FormInput
              v-model="accountName"
              :maxlength="50"
              :error="errors.accountName"
              placeholder="請輸入戶名"
              >戶名</FormInput
            >
          </div>
        </div>
        <hr class="divider" />
        <!-- 訂金比例：三選一；說明前面有 info 圖示 -->
        <div class="field">
          <p class="text-caption">訂金比例</p>
          <div class="options">
            <OptionButton v-model="depositPercent" name="deposit" value="30%">30%</OptionButton>
            <OptionButton v-model="depositPercent" name="deposit" value="50%">50%</OptionButton>
            <!-- 資料值仍是「無需先支付」（data-model），畫面改寫成「不收訂金」：避免被看成「委託人可以先不付錢」（2026/11/19，Figma 待同步） -->
            <OptionButton v-model="depositPercent" name="deposit" value="無需先支付"
              >不收訂金（一次付清）</OptionButton
            >
          </div>
          <div class="hint-row">
            <img src="/icons/info.svg" alt="" />
            <p class="text-note hint">
              選 30%／50%
              時，委託人可以只先付訂金；若中途終止還有應付差額，平台會鎖定委託人帳號直到付清，但無法強制收款。選「不收訂金」時，委託人須一次付清全額。
            </p>
          </div>
        </div>

        <hr class="divider" />
        <!-- 修改次數：輸入框沒有標籤，旁邊接「次」 -->
        <div class="field">
          <div class="field-title">
            <p class="text-caption">修改次數</p>
            <p class="text-note required">必填</p>
          </div>
          <div class="revision-row">
            <FormInput
              v-model="revisionCount"
              :maxlength="3"
              :error="errors.revisionCount"
              inputmode="numeric"
              label-hidden
              >修改次數</FormInput
            >
            <span class="text-caption">次</span>
          </div>
          <p class="text-note hint">
            會以「包含 X
            次修改」的文字，唯讀顯示在委託申請頁、報價頁與委託討論牆；系統不會計次或攔截。
          </p>
        </div>
      </section>
      <!-- 按鈕列在卡片外面，靠右（Figma 553:2463） -->
      <div class="actions">
        <!-- 【流程②：按「取消變更」時觸發】草稿全部還原成後端的值 -->
        <Button variant="outline" @click="resetDrafts()">取消變更</Button>
        <!-- 沒改過（isDirty 是 false）就是灰的、不能按 -->
        <!-- 【流程③：按「儲存設定」時觸發】 -->
        <Button :disabled="!isDirty" @click="handleSave">儲存設定</Button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, onUnmounted } from 'vue'
import type { CreatorSettings } from '@/features/profile/types'
import {
  fetchCreatorSettings,
  updateCreatorSettings,
  updateAmiluLight,
} from '@/features/profile/api'
import EmptyState from '@/shared/components/EmptyState.vue'
import InfoBox from '@/shared/components/InfoBox.vue'
import Button from '@/shared/components/Button.vue'
import type { LightStatus, DepositPercent } from '@/features/profile/types'
import OptionButton from '@/shared/components/OptionButton.vue'
import FormInput from '@/shared/components/FormInput.vue'
import SavedToast from '@/shared/components/SavedToast.vue'
/*
頁面：接案設定（/me/settings，Figma 1053:14412，features.md 3.5）
*/
const settings = ref<CreatorSettings | null>(null) // 後端回來的設定；null ＝ 還沒拿到，或沒開通過
// 有設定、而且 store_approved 是 true，才算已開通；模板用它決定顯示空狀態還是表單
const isActivated = computed(() => settings.value?.store_approved === true)

// 草稿：表單上正在改的值；按儲存前不會動到 settings
const lightStatus = ref<LightStatus>('開放')
const bankCode = ref('')
const accountNo = ref('')
const accountName = ref('')
const depositPercent = ref<DepositPercent>('30%')
const revisionCount = ref('') // 輸入框的值一律是字串，第 3 輪送出時再轉成數字
// 每格的錯誤文字，空字串＝沒錯；直接綁到 FormInput 的 :error
const errors = reactive({ bankCode: '', accountNo: '', accountName: '', revisionCount: '' })
const showSaved = ref(false) // 「已儲存變更」提示要不要顯示
let savedTimer: ReturnType<typeof setTimeout> | undefined // 提示的計時器，連按儲存時要先取消上一個

// 【流程②：拿到設定後、按「取消變更」時觸發】草稿還原成後端的值
function resetDrafts() {
  if (!settings.value) return
  lightStatus.value = settings.value.light_status
  bankCode.value = settings.value.payout_bank_code
  accountNo.value = settings.value.payout_account_no
  accountName.value = settings.value.payout_account_name
  depositPercent.value = settings.value.deposit_percent
  revisionCount.value = String(settings.value.revision_count) // 數字轉字串，才能放進輸入框
  // 草稿回到後端的值一定是對的，紅字一起清掉（不然按「取消變更」後紅字還留著）
  errors.bankCode = ''
  errors.accountNo = ''
  errors.accountName = ''
  errors.revisionCount = ''
}
// 【流程①：頁面打開時跑一次】讀我的接案設定
onMounted(async () => {
  settings.value = await fetchCreatorSettings()
  resetDrafts() // 【流程②】拿到設定才複製進草稿，表單才有值；沒開通時 settings 是 null，resetDrafts 會直接結束
})

// 有沒有改過：任何一格和後端的值不同就是 true；草稿或 settings 一變就會重算，儲存鈕靠它決定能不能按
const isDirty = computed(() => {
  const s = settings.value
  if (!s) return false
  return (
    lightStatus.value !== s.light_status ||
    bankCode.value !== s.payout_bank_code ||
    accountNo.value !== s.payout_account_no ||
    accountName.value !== s.payout_account_name ||
    depositPercent.value !== s.deposit_percent ||
    revisionCount.value !== String(s.revision_count)
  )
})

// 【流程③：按「儲存設定」時觸發】檢查 → 送出設定 → 燈有改才送燈 → 寫回、顯示提示
async function handleSave() {
  // ① 檢查：4 格都先檢查完再決定要不要停，使用者一次看到所有錯；有錯就停在這裡
  errors.bankCode = /^\d{3}$/.test(bankCode.value) ? '' : '請輸入 3 碼數字的銀行代碼'
  errors.accountNo = /^\d+$/.test(accountNo.value) ? '' : '請輸入收款帳號（只能是數字）'
  errors.accountName = accountName.value.trim() === '' ? '戶名不得為空' : ''
  errors.revisionCount = /^\d+$/.test(revisionCount.value) ? '' : '請輸入 0 以上的整數'
  if (errors.bankCode || errors.accountNo || errors.accountName || errors.revisionCount) return

  // ② 送出設定（PATCH /me/creator-settings）：修改次數從字串轉回數字，戶名去掉前後空白
  const saved = await updateCreatorSettings({
    payout_bank_code: bankCode.value,
    payout_account_no: accountNo.value,
    payout_account_name: accountName.value.trim(),
    deposit_percent: depositPercent.value,
    revision_count: Number(revisionCount.value),
  })
  // ③ Amilu 燈走另一支 API，有改才送（features.md 3.5）
  // light ＝ 存好之後的燈：先假設沒改（舊值），有改才換成 api 回傳的新值；settings 一定有值，能按到儲存的人已開通
  let light = settings.value!.light_status
  if (lightStatus.value !== light) {
    light = await updateAmiluLight(lightStatus.value)
  }
  // ④ 寫回：saved 沒有燈，用 light 補上；再把草稿換成存好的值，isDirty 變回 false，儲存鈕變灰
  settings.value = { ...saved, light_status: light }
  resetDrafts()

  // 顯示提示 2 秒：先取消上一次的計時器，連按兩次時第二次才會完整顯示 2 秒

  clearTimeout(savedTimer)
  showSaved.value = true
  savedTimer = setTimeout(() => {
    showSaved.value = false
  }, 2000)
}

// 【離開頁面時】取消還沒到期的計時器，不留下還在跑的計時器
onUnmounted(() => {
  clearTimeout(savedTimer)
})
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

// 整頁：置中、最寬 888，和個人資料設定頁一致（Figma 553:2360）；左右留白由 DefaultLayout 的 container 給
.creator-settings {
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

// 麵包屑、欄位旁的「唯讀…」、欄位下方說明：灰字
.breadcrumb,
.hint {
  color: var(--color-text-secondary);
}

// 白色卡片：接案狀態、收款與委託條件（Figma 553:2393、553:2413）；手機內距縮小
.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-3);
  border-radius: var(--radius-card);
  background: var(--color-bg-card);
  color: var(--color-text-primary);

  @include bp.tablet-up {
    padding: var(--space-5);
  }

  h2,
  p {
    margin: 0;
  }
}

// 卡片標題：Figma 用 H3 的 Medium，比 .text-h3 預設的 bold 細一階
.card-title {
  font-weight: var(--font-weight-medium);
}

// 一個欄位：標題列、內容、說明之間 12（Figma 553:2395）
.field {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

// 欄位標題列：標題＋「唯讀…」或「（必填）」並排，字級不同所以用 baseline 對齊文字底線（Figma 553:2396）
.field-title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-1);
}

// 「（必填）」：比標題小一階，但維持主要文字色（和灰字的「唯讀…」提示區分）
.required {
  color: var(--color-button-secondary);
}

// 「已開通」小標籤：淺綠底膠囊（Figma 553:2399）
.store-status {
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--color-success-bg);
  color: var(--color-text-primary);
}

// 選項按鈕一排，之間 12；太窄時換行（Figma 553:2404）
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

// 說明前面有 info 圖示時（訂金比例，Figma 553:2444）：圖示 18、和文字間距 6
.hint-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;

  img {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
  }
}

.divider {
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

// 收款帳戶三欄：手機上下排；平板以上並排，銀行代碼 180、帳號撐滿、戶名 240（Figma 553:2418）
.payout-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  @include bp.tablet-up {
    flex-direction: row;

    > :nth-child(1) {
      flex: 0 0 180px;
    }
    > :nth-child(2) {
      flex: 1;
      min-width: 0;
    }
    > :nth-child(3) {
      flex: 0 0 240px;
    }
  }
}

// 修改次數：輸入框寬 120，後面接「次」，底部對齊（Figma 553:2454）
.revision-row {
  display: flex;
  align-items: center;
  gap: 12px;

  > :first-child {
    width: 120px;
  }
}

// 按鈕列靠右，之間 16；取消 160、儲存 200（Figma 553:2463）
.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);

  > :nth-child(1) {
    width: 160px;
  }
  > :nth-child(2) {
    width: 200px;
  }
}
</style>
