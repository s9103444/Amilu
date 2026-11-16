<template>
  <div v-if="user" class="profile-settings">
    <div class="page-heading">
      <p class="text-small breadcrumb">首頁／個人資料設定</p>
      <h1 class="text-h2">個人資料設定</h1>
    </div>
    <!-- 【流程③：按「儲存變更」】第 2 輪才做 -->
    <form class="card" novalidate @submit.prevent="handleSave">
      <div class="avatar-field">
        <p class="text-caption">大頭照</p>
        <AvatarUpload title="上傳／更換大頭照" description="JPG／PNG／WebP，單張 5MB 以內" />
      </div>
      <hr class="divider" />
      <div class="readonly-row">
        <FormInput :model-value="'@' + user.id" readonly>帳號 ID</FormInput>
        <FormInput :model-value="user.email" readonly>Email</FormInput>
      </div>
      <FormInput v-model="nickname" requirement="necessary" :error="errors.nickname">暱稱</FormInput>
      <FormTextarea v-model="bio" requirement="optional">簡介</FormTextarea>
      <div class="actions"><Button type="submit" width="hug">儲存變更</Button></div>
    </form>
    <section class="card danger-zone">
      <div>
        <p class="text-caption">刪除帳號</p>
        <p class="text-small hint">
          刪除後將無法登入，也無法復原。有進行中的委託或尚未補齊的款項時無法刪除。
        </p>
      </div>
      <!-- 第 4 輪接確認燈箱 -->
      <Button variant="secondary" width="hug">刪除帳號</Button>
    </section>
  </div>
</template>

<script setup lang="ts">
/*
頁面：個人資料設定（/me/profile，Figma 547:3017，features.md 3.1）
入口：header 個人選單「個人資料設定」。照 Figma 先不放左側選單（structure.md 3.5）。
分 4 輪做：①畫面與資料（本輪）②儲存變更 ③大頭照選檔 ④刪除帳號燈箱
帳號 ID、email 只顯示；暱稱、簡介複製一份當草稿，按「儲存變更」才寫回（打字時 header 的暱稱不會跟著變）。
登入者讀 account 的 useAuthStore（structure.md 2.2 的唯讀例外）。
*/
import { computed, ref, reactive } from 'vue'
import { useAuthStore } from '@/features/account/store'
import AvatarUpload from '@/shared/components/AvatarUpload.vue'
import FormInput from '@/shared/components/FormInput.vue'
import FormTextarea from '@/shared/components/FormTextarea.vue'
import Button from '@/shared/components/Button.vue'

const auth = useAuthStore()
// 登入者；重新整理後是 null（登入狀態沒存），模板用 v-if 不顯示表單，「沒登入導回登入頁」之後再做
const user = computed(() => auth.currentUser)

// 【流程②：頁面建立時】把可修改的欄位複製成草稿；bio 沒填是 null，輸入框要字串，所以換成 ''
const nickname = ref(user.value?.nickname ?? '')
const bio = ref(user.value?.bio ?? '')
// 每欄的錯誤文字，空字串＝沒錯；直接綁到 FormInput 的 :error
const errors = reactive({ nickname: '' })

// 【流程③：按「儲存變更」時觸發（form 的 @submit）】
function handleSave() {
  // TODO 第 2 輪：檢查暱稱必填，通過後呼叫 PATCH /me/profile，成功後更新登入者資料
}
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

// 整頁：置中、最寬 888（Figma 547:3026）；左右留白由 DefaultLayout 的 container 給
.profile-settings {
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

// 麵包屑、刪除帳號說明：灰字
.breadcrumb,
.hint {
  color: var(--color-text-secondary);
}

.divider {
  width: 100%;
  margin: 4px 0;
  border: none;
  border-top: 1px solid var(--color-border-light);
}

// 白色卡片：個人資料卡片、刪除帳號區共用（Figma 547:3030、547:3048）
.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: var(--radius-card);
  background: var(--color-bg-card);
  color: var(--color-text-primary);

  p {
    margin: 0;
  }
}

.avatar-field {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// 帳號 ID、Email 並排；寬度不夠時（手機）自動換成上下兩行
.readonly-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);

  > * {
    flex: 1;
    min-width: 240px;
  }
}

.actions {
  display: flex;
  justify-content: flex-end;
}

// 刪除帳號區：手機說明在上、按鈕在下；平板以上左說明、右按鈕（Figma 只畫桌機）
.danger-zone {
  gap: var(--space-3);

  @include bp.tablet-up {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-5);
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 6px; // Figma 547:3049
  }
}
</style>
