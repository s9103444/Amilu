<template>
  <div v-if="user" class="profile-settings">
    <!-- 存好後顯示 2 秒（流程③-3）；位置由 SavedToast 自己固定在視口上方中央 -->
    <SavedToast v-if="showSaved" />
    <div class="page-heading">
      <p class="text-small breadcrumb">首頁／個人資料設定</p>
      <h1 class="text-h2">個人資料設定</h1>
    </div>
    <!-- 【流程③：按「儲存變更」或在輸入框按 Enter】觸發 handleSave -->
    <form class="card" novalidate @submit.prevent="handleSave">
      <div class="avatar-field">
        <p class="text-caption">大頭照</p>
        <!-- 原生選檔框藏起來，點大頭照方塊或「更換大頭貼」時用程式代按它（同 ChatRoom） -->
        <!-- 【流程④-2：選好檔案時】觸發 onPickAvatar -->
        <input
          @change="onPickAvatar"
          ref="avatarInput"
          type="file"
          accept="image/jpeg, image/png, image/webp"
          hidden
        />
        <AvatarUpload
          :image-url="avatarPreview"
          title="上傳／更換大頭照"
          description="JPG／PNG／WebP，單張 5MB 以內，圖片需方形"
          @select="avatarInput?.click()"
        />
        <!-- 【流程④-1：點方塊或「更換大頭貼」】AvatarUpload 發出 select → 打開選檔視窗 -->
        <!-- 選檔不合格時的錯誤文字（AvatarUpload 沒有放錯誤的位置，所以放在頁面） -->
        <p class="text-note avatar-error" v-if="errors.avatar">{{ errors.avatar }}</p>
      </div>
      <hr class="divider" />
      <div class="readonly-row">
        <FormInput :model-value="'@' + user.id" readonly>帳號 ID</FormInput>
        <FormInput :model-value="user.email" readonly>Email</FormInput>
      </div>
      <FormInput v-model="nickname" requirement="necessary" :error="errors.nickname"
        >暱稱</FormInput
      >
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
      <!-- 【流程④-1：按「刪除帳號」】打開刪除燈箱 -->
      <Button @click="showDelete = true" variant="secondary" width="hug">刪除帳號</Button>
    </section>
    <DeleteProfileLightbox
      v-if="showDelete"
      :user-id="user.id"
      @close="showDelete = false"
      @deleted="handleDeleted"
    />
  </div>
</template>

<script setup lang="ts">
/*
頁面：個人資料設定（/me/profile，Figma 547:3017，features.md 3.1）
入口：header 個人選單「個人資料設定」。照 Figma 先不放左側選單（structure.md 3.5）。
分 4 輪做：①畫面與資料 ②儲存變更 ③大頭照選檔 ④刪除帳號燈箱
帳號 ID、email 只顯示；暱稱、簡介複製一份當草稿，按「儲存變更」才寫回登入者（打字時登入者資料不會跟著變）。
登入者讀 account 的 useAuthStore；存好後用 updateCurrentUser 寫回（structure.md 2.2 的例外）。
*/
import { computed, ref, reactive, onUnmounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/account/store'
import AvatarUpload from '@/shared/components/AvatarUpload.vue'
import FormInput from '@/shared/components/FormInput.vue'
import FormTextarea from '@/shared/components/FormTextarea.vue'
import Button from '@/shared/components/Button.vue'
import { updateProfile } from '@/features/profile/api'
import SavedToast from '@/shared/components/SavedToast.vue'
import DeleteProfileLightbox from '@/features/profile/components/DeleteProfileLightbox.vue'

const router = useRouter()
const auth = useAuthStore()
// 登入者；重新整理後是 null（登入狀態沒存），模板用 v-if 不顯示表單，「沒登入導回登入頁」之後再做
const user = computed(() => auth.currentUser)

// 【流程②：頁面建立時】把可修改的欄位複製成草稿；bio 沒填是 null，輸入框要字串，所以換成 ''
const nickname = ref(user.value?.nickname ?? '')
const bio = ref(user.value?.bio ?? '')
// 每欄的錯誤文字，空字串＝沒錯；直接綁到 FormInput 的 :error
const errors = reactive({ nickname: '', avatar: '' })
// 大頭照：avatarInput ＝ 藏起來的選檔框（名字對應模板的 ref）
// avatarFile ＝ 選好、還沒存的檔案；avatarPreview ＝ 畫面上顯示的網址，一開始是目前的大頭照，選圖後換成預覽網址
const avatarInput = useTemplateRef<HTMLInputElement>('avatarInput')
const avatarFile = ref<File | null>(null)
const avatarPreview = ref(user.value?.avatar_url ?? null)
// 刪除帳號燈箱開著沒（燈箱用 v-if，打開＝重新建立）
const showDelete = ref(false)

// 「已儲存變更」提示：showSaved 控制顯示；savedTimer 存「2 秒後收起」計時器的號碼牌，放在函式外，下次儲存才拿得到上一次的
const showSaved = ref(false)
let savedTimer: ReturnType<typeof setTimeout> | undefined

// 大頭照限制（features.md 3.1）：格式和選檔框的 accept 一致；accept 擋不住「所有檔案」，所以這裡要再檢查
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB，換算成 byte

// 【流程④-2：選好檔案時觸發（input 的 @change）】檢查格式和大小，合格就存成草稿並產生預覽網址
// 只是預覽，按「儲存變更」才會送出（第 3 輪段 B）
function onPickAvatar(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = '' // 先清掉，不管合不合格，下次選同一張才會再觸發
  if (!file) return // 使用者打開選檔視窗後按了取消
  if (!ALLOWED_TYPES.includes(file.type)) {
    errors.avatar = '圖片格式不符'
    return
  }
  if (file.size > MAX_SIZE) {
    errors.avatar = '圖片需在 5MB 以內'
    return
  }
  errors.avatar = ''
  avatarFile.value = file
  // 檔案還在使用者電腦上，img 不能直接顯示 File；產生一個暫時網址（blob:）給 img 用
  avatarPreview.value = URL.createObjectURL(file)
}

// 【流程③：按「儲存變更」時觸發（form 的 @submit）】
async function handleSave() {
  // ① 檢查：暱稱必填，只打空白也算沒填；有錯就停在這裡
  const updateNickname = nickname.value.trim()
  if (updateNickname === '') {
    errors.nickname = '請輸入暱稱'
    return
  }
  errors.nickname = ''
  // ② 送出：簡介沒填送 null（和 USER.bio 一致）；大頭照沒選新圖時 avatarFile 是 null ＝ 不換
  const updateBio = bio.value.trim()
  const saved = await updateProfile({
    nickname: updateNickname,
    bio: updateBio || null,
    avatar: avatarFile.value,
  })

  // 【流程③-2：存好後寫回登入者】下次進這頁複製草稿時才會是新的值
  auth.updateCurrentUser(saved)
  // 草稿也換成存好的值（去掉前後空白），輸入框和登入者一致
  nickname.value = saved.nickname
  bio.value = saved.bio ?? ''
  // 草稿檔案已經存過了，清掉；不然下次只改暱稱也會再送一次同一張圖
  avatarFile.value = null

  // 【流程③-3：顯示提示 2 秒】先取消上一次的計時器，連按兩次時第二次才會完整顯示 2 秒
  clearTimeout(savedTimer)
  showSaved.value = true
  savedTimer = setTimeout(() => {
    showSaved.value = false
  }, 2000)
}

// 【流程④-3：燈箱送出 deleted（帳號已刪除）時觸發】關燈箱、登出、回首頁
// 登出是 structure.md 2.2 的例外：只限刪除帳號成功後
function handleDeleted() {
  showDelete.value = false
  auth.logOut()
  router.push('/')
}

// 【離開頁面時】取消還沒到期的計時器，不留下還在跑的計時器
onUnmounted(() => {
  clearTimeout(savedTimer)
})
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

// 大頭照錯誤文字：和 FormInput 的錯誤文字同色
.avatar-error {
  margin: 0;
  color: var(--color-error);
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
