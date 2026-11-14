<template>
  <!-- 註冊頁（Figma 502:672 桌機、502:767 平板、502:809 手機）：單欄置中，沒有右側圖 -->
  <div class="register-page">
    <div class="register-content">
      <h1 class="text-h2 register-title">一同註冊，<br />加入Amilu社群！</h1>
      <!-- 在輸入框按 Enter 或點「註冊」都會觸發送出；.prevent 擋掉整頁重新載入 -->
      <form @submit.prevent>
        <div class="fields">
          <FormInput v-model="email" type="email" placeholder="請輸入信箱">Email</FormInput>
          <!-- 帳號 ID、暱稱：註冊必填（features.md 1.1） -->
          <div class="name-row">
            <FormInput v-model="userId" placeholder="請輸入英文與數字">使用者ID</FormInput>
            <FormInput v-model="nickname" placeholder="輸入中英文皆可">使用者暱稱</FormInput>
          </div>
          <FormInput v-model="password" type="password" placeholder="請輸入英文與數字" />
          <FormInput v-model="passwordConfirm" type="password" placeholder="請輸入相同的密碼">
            確認密碼
          </FormInput>
        </div>
        <FormCheckbox v-model="agreed">
          <span class="terms">我同意<span class="terms-link">服務條款與隱私權政策</span></span>
        </FormCheckbox>
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
import { ref } from 'vue'
import FormInput from '@/shared/components/FormInput.vue'
import FormCheckbox from '@/shared/components/FormCheckbox.vue'
import Button from '@/shared/components/Button.vue'
import DividerWithText from '@/shared/components/DividerWithText.vue'
import GoogleAuthButton from '@/features/account/components/GoogleAuthButton.vue'

const email = ref('')
const userId = ref('')
const nickname = ref('')
const password = ref('')
const passwordConfirm = ref('')
const agreed = ref(false)
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
