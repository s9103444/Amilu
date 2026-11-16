<template>
  <div class="default-layout">
    <!-- 登入狀態讀 account 的 store：登入、登出後 header 自動跟著換 -->
    <AppHeader :logged-in="auth.isLoggedIn" @logo-click="refreshPage" />
    <!-- container：左右留白＋最寬 1440 置中（main.scss），各頁不用自己寫 -->
    <main class="container">
      <!-- 【流程③】viewKey 變了 → 目前頁面整個重建（onMounted 重跑、ref 回初始值） -->
      <RouterView :key="viewKey" />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/layouts/components/header/AppHeader.vue'
import AppFooter from '@/layouts/components/AppFooter.vue'
import { useAuthStore } from '@/features/account/store'

const auth = useAuthStore()
const route = useRoute()
// RouterView 的 key：數字一變，Vue 就拆掉目前的頁面重建一個（等於只重整這一頁，登入狀態保留）
const viewKey = ref(0)

// 【流程②：AppHeader 點 Logo 時觸發】
function refreshPage() {
  // router 沒設 scrollBehavior，換頁不會自動回頂，這裡自己捲
  window.scrollTo(0, 0)
  // 已經在首頁：RouterLink 不會換頁，改由這裡重建首頁（不在首頁時，RouterLink 會自己換過去）
  if (route.name === 'home') {
    viewKey.value++
  }
}
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
