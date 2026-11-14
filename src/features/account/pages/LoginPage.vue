<template>
  <div class="login-page">
    <!-- 左欄：表單區＋最下面的版權字 -->
    <div class="login-panel">
      <div class="login-content">
        <div class="login-heading">
          <h1 class="text-h2">使用者登入</h1>
          <p class="text-small">登入 Amilu，在專業的節奏裡，與創作者並肩完成每一次委託。</p>
        </div>
        <!-- 在輸入框按 Enter 或點「登入」都會觸發送出；.prevent 擋掉整頁重新載入 -->
        <form @submit.prevent>
          <FormInput v-model="email" type="email">Email</FormInput>
          <FormInput v-model="password" type="password" />
          <p class="forgot text-small">忘記密碼？</p>
          <div class="action">
            <Button type="submit">登入</Button>
            <Button variant="secondary" @click="router.push('/register')">註冊</Button>
          </div>
        </form>
        <div class="other-login">
          <DividerWithText />
          <GoogleAuthButton />
        </div>
      </div>
      <p class="copyright text-note">© 2026 Amilu. All rights reserved.</p>
    </div>
    <!-- 右欄：裝飾圖，手機版隱藏 -->
    <div class="login-cover">
      <img :src="loginCover" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '@/shared/components/FormInput.vue'
import Button from '@/shared/components/Button.vue'
import DividerWithText from '@/shared/components/DividerWithText.vue'
import GoogleAuthButton from '@/features/account/components/GoogleAuthButton.vue'
import loginCover from '@/assets/account/login-cover.webp'
const router = useRouter()
const email = ref('')
const password = ref('')
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

// 整頁：手機只有左欄；平板以上左欄＋右欄圖（Figma 977:14307）
.login-page {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
  min-width: 375px; // 比 375 窄時不再縮，改出橫向捲軸，避免版面擠壞到無法操作
  gap: 40px;
  min-height: 100dvh; // 用 min-height：內容比螢幕高時可以往下長，不會溢出
  padding: 120px var(--grid-margin) 40px;
}

// 左欄：表單區＋版權字整組垂直置中
.login-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;

  @include bp.desktop-up {
    padding-inline: 100px;
  }
}

.login-content {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.login-heading {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--color-text-primary);

  h1,
  p {
    margin: 0;
  }
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

// 忘記密碼：靠右，和上下間距同 form 的 gap
.forgot {
  display: block;
  margin: 0;
  text-align: right;
  color: var(--color-text-link);
}

.action {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.other-login {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.copyright {
  margin: 0;
  color: var(--color-accent-muted);
}

// 右欄圖：手機隱藏；平板固定 309 寬；桌機和左欄對分
.login-cover {
  display: none;
  @include bp.tablet-up {
    display: block;
    flex: 0 0 309px;
    overflow: hidden;
    border-radius: var(--radius-login-cover);
  }

  @include bp.desktop-up {
    flex: 1;
    min-width: 0;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover; // 欄寬比例和圖不同時裁切，不變形
  }
}
</style>
