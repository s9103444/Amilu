<template>
  <div class="auth-layout">
    <!-- Logo 浮在左上角，蓋在頁面內容上，不佔版面高度（Figma 497:491） -->
    <RouterLink class="logo" to="/" aria-label="回到首頁">
      <img :src="base + 'picture/logo-header.png'" alt="Amilu"
    /></RouterLink>
    <!-- 登入、註冊等帳號頁放這裡（router/index.ts 的 accountRoutes） -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

const base = import.meta.env.BASE_URL
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

// 頁面底色由 body 的 --color-bg-main 提供（main.scss），這裡不重複設
.auth-layout {
  position: relative; // 給 .logo 定位用
  min-height: 100dvh;
}

// Figma：手機距上 36，平板以上距上 45；左邊跟著 grid margin（16／32／48）
.logo {
  position: absolute;
  top: 36px;
  left: var(--grid-margin);
  z-index: 1;
  width: 120px;

  @include bp.tablet-up {
    top: 45px;
  }

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
