<template>
  <!-- 註冊頁（Figma 502:672 桌機、502:767 平板、502:809 手機）：單欄置中，沒有右側圖 -->
  <div class="register-page">
    <div class="register-content">
      <h1 class="text-h2 register-title">一同註冊，<br />加入Amilu社群！</h1>
      <!-- 在輸入框按 Enter 或點「註冊」都會觸發送出；.prevent 擋掉整頁重新載入 -->
      <!-- novalidate：關掉瀏覽器自己的 Email 檢查泡泡，錯誤統一由下面的 validate() 顯示 -->
      <form novalidate @submit.prevent="handleSubmit">
        <div class="fields">
          <FormInput v-model="email" type="email" placeholder="請輸入信箱" :error="errors.email">
            Email
          </FormInput>
          <!-- 帳號 ID、暱稱：註冊必填（features.md 1.1） -->
          <div class="name-row">
            <FormInput v-model="userId" placeholder="請輸入英文與數字" :error="errors.userId">
              使用者ID
            </FormInput>
            <FormInput v-model="nickname" placeholder="輸入中英文皆可" :error="errors.nickname">
              使用者暱稱
            </FormInput>
          </div>
          <FormInput
            v-model="password"
            type="password"
            placeholder="請輸入英文與數字"
            :error="errors.password"
          />
          <FormInput
            v-model="passwordConfirm"
            type="password"
            placeholder="請輸入相同的密碼"
            :error="errors.passwordConfirm"
          >
            確認密碼
          </FormInput>
        </div>
        <!-- 勾選框＋錯誤文字包一層：錯誤貼在勾選框下方，不吃 form 的 34 間距 -->
        <div class="agree">
          <FormCheckbox v-model="agreed">
            <span class="terms">我同意<span class="terms-link">服務條款與隱私權政策</span></span>
          </FormCheckbox>
          <p v-if="errors.agreed" class="agree-error text-note">{{ errors.agreed }}</p>
        </div>
        <Button type="submit">註冊</Button>
      </form>
      <div class="other-login">
        <DividerWithText />
        <GoogleAuthButton />
      </div>
    </div>
    <p class="copyright text-note">© 2026 Amilu. All rights reserved.</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import FormInput from '@/shared/components/FormInput.vue'
import FormCheckbox from '@/shared/components/FormCheckbox.vue'
import Button from '@/shared/components/Button.vue'
import DividerWithText from '@/shared/components/DividerWithText.vue'
import GoogleAuthButton from '@/features/account/components/GoogleAuthButton.vue'
import { emailError, requiredError } from '@/features/account/validation'

const email = ref('')
const userId = ref('')
const nickname = ref('')
const password = ref('')
const passwordConfirm = ref('')
const agreed = ref(false)
// 每欄的錯誤文字，空字串＝沒錯
const errors = reactive({
  email: '',
  userId: '',
  nickname: '',
  password: '',
  passwordConfirm: '',
  agreed: '',
})

// 確認密碼：先檢查必填，再比對和密碼是否一樣
function passwordConfirmError(): string {
  const required = requiredError(passwordConfirm.value, '確認密碼')
  if (required) {
    return required
  }
  if (passwordConfirm.value !== password.value) {
    return '兩次密碼不一致'
  }
  return ''
}

// 檢查每一欄、把錯誤文字寫進 errors；全部通過回傳 true
// ID、密碼的格式規則（長度、可用字元）spec 還沒定，等後端確認後再加
function validate(): boolean {
  errors.email = emailError(email.value)
  errors.userId = requiredError(userId.value, '使用者ID')
  errors.nickname = requiredError(nickname.value, '使用者暱稱')
  errors.password = requiredError(password.value, '密碼')
  errors.passwordConfirm = passwordConfirmError()
  errors.agreed = agreed.value ? '' : '請勾選同意服務條款與隱私權政策'
  return Object.values(errors).every((msg) => msg === '')
}

// 【流程：按「註冊」或在輸入框按 Enter 時觸發（form 的 @submit）】
function handleSubmit() {
  // ① 先檢查，有錯就停在這裡，畫面上會顯示錯誤文字
  if (!validate()) {
    return
  }
  // ② TODO 通過後：呼叫註冊 API（ID 重複由後端回錯，ACC-01），成功後 auth.loginAs 並回首頁
}
</script>

<style lang="scss" scoped>
// 整頁：內容置中，版權字貼底（寬度下限沿用登入頁的決定）
.register-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  min-width: 375px;
  min-height: 100dvh;
  padding: 120px var(--grid-margin) 40px; // 上方留給左上角的 Logo
}

// Figma 三種寬度的表單都是 614 寬
.register-content {
  width: 100%;
  max-width: 614px;
  display: flex;
  flex-direction: column;
  gap: 34px;
}

.register-title {
  margin: 0;
  text-align: center;
  color: var(--color-text-primary);
}

form {
  display: flex;
  flex-direction: column;
  gap: 34px;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

// 使用者ID、暱稱並排，各佔一半（手機也並排，照 Figma）
.name-row {
  display: flex;
  gap: 15px;

  > * {
    flex: 1;
    min-width: 0;
  }
}

// 勾選框文字：Figma 用次要文字色，「服務條款與隱私權政策」加底線
// （條款頁還沒有，先不做連結）
.terms {
  color: var(--color-text-secondary);
}
.terms-link {
  text-decoration: underline;
}

// 勾選框和它的錯誤文字：間距同 FormInput 標籤與錯誤的 4
.agree {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.agree-error {
  margin: 0;
  color: var(--color-error);
}

.other-login {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.copyright {
  margin: auto 0 0; // 內容不夠高時把版權字推到最底
  color: var(--color-accent-muted);
}
</style>
