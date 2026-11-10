<template>
  <div class="default-layout">
    <!-- 登入狀態讀 account 的 store：登入、登出後 header 自動跟著換 -->
    <AppHeader :logged-in="auth.isLoggedIn" />
    <!-- container：左右留白＋最寬 1440 置中（main.scss），各頁不用自己寫 -->
    <main class="container">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/layouts/components/header/AppHeader.vue'
import AppFooter from '@/layouts/components/AppFooter.vue'
import { useAuthStore } from '@/features/account/store'

const auth = useAuthStore()
</script>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
main {
  flex: 1;
  width: 100%; // flex 直排時子元素預設會縮到內容寬，要撐滿才會吃到 container 的 max-width
}
</style>
