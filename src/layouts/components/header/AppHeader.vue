<template>
  <!-- container：左右留白＋最寬 1440 置中（main.scss），全站共用 -->
  <header class="app-header container">
    <a class="logo" href="#" aria-label="回到首頁">
      <img :src="base + 'picture/logo-header.png'" alt="Amilu" />
    </a>

    <div class="search-area">
      <SearchBar v-model="keyword" />
    </div>

    <div class="actions">
      <a class="about text-button-md" href="#">瞭解網站</a>
      <!-- 登入後：通知、上傳、個人選單 -->
      <template v-if="loggedIn">
        <NotificationMenu />
        <button type="button" class="upload" aria-label="上傳">
          <img src="/icons/upload-default.svg" alt="" class="upload-default" />
          <img src="/icons/upload-hover.svg" alt="" class="upload-hover" />
        </button>
        <UserMenu />
      </template>
      <!-- 登入前：只有登入按鈕 -->
      <!-- 不用 RouterLink 包 Button：<a> 裡放 <button> 是不合法的 HTML，還會多出連結底線 -->
      <Button v-else variant="secondary" width="hug" @click="router.push('/login')">登入</Button>
    </div>
  </header>
</template>

<script setup lang="ts">
/*
元件名稱：網站 header（登入前 Figma 484:98、登入後 569:3299）
範例：
使用前先 import：import AppHeader from '@/layouts/components/header/AppHeader.vue'
<AppHeader :logged-in="false" />
loggedIn：false 顯示「登入」按鈕；true 顯示通知、上傳、個人選單。
登入狀態之後改由 account 的 store 提供，由 DefaultLayout 傳進來。
「登入」已接 /login；其他連結（Logo、瞭解網站、上傳）還沒有對應頁面，先不接；搜尋關鍵字也還沒有搜尋結果頁可以送。
首頁的分類下拉、自訂標籤列不在這裡，屬於首頁（explore）。
*/
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/shared/components/Button.vue'
import SearchBar from '@/layouts/components/header/SearchBar.vue'
import NotificationMenu from '@/layouts/components/header/NotificationMenu.vue'
import UserMenu from '@/layouts/components/header/UserMenu.vue'

defineProps<{
  loggedIn: boolean
}>()

const router = useRouter()
const base = import.meta.env.BASE_URL
const keyword = ref('')
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

// 數值取自 Figma 484:98（登入前）、569:3299（登入後）。手機優先
// 手機（< 768）兩行：第一行 Logo＋右側按鈕，第二行搜尋欄撐滿（Figma 沒畫 375 寬，2026/11/10 決定）
// 平板以上一行：Logo｜搜尋欄｜右側按鈕
.app-header {
  display: flex;
  flex-wrap: wrap; // 手機：放不下就換行，搜尋欄才擠得到第二行
  row-gap: var(--space-2); // 手機兩行之間的距離
  align-items: center;
  justify-content: space-between;
  width: 100%;
  // 左右留白由 .container 給，這裡只設上下，不能寫 padding 簡寫（會蓋掉左右）
  padding-block: var(--space-5) var(--space-4);

  @include bp.tablet-up {
    flex-wrap: nowrap; // 平板以上固定一行
  }
}

.logo {
  flex-shrink: 0;

  & img {
    display: block;
    width: 140px;
    height: auto; // 原圖 841×262，照比例約 48 高
  }
}

// 搜尋欄
// 手機：order 3 排到右側按鈕後面，flex-basis 100% 要整行寬，所以自己換到第二行；獨佔一行不用左右留白
// 平板以上：回到 Logo 和按鈕中間，吃掉剩下的寬度，左右各留 60（Figma）
// 注意：order 只改畫面順序，鍵盤 Tab 還是照 HTML（Logo → 搜尋 → 右側）
.search-area {
  flex: 1 1 100%;
  min-width: 0;
  max-width: 1200px;
  padding-inline: 0;
  order: 3;

  @include bp.tablet-up {
    padding-inline: 60px;
    order: 0;
    flex: 1;
  }
}

// 右側按鈕：手機間距 26（Figma 494:297），平板以上 32
.actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 26px;

  @include bp.tablet-up {
    gap: var(--space-4);
  }
}

// 瞭解網站：手機放不下，先藏起來（footer 有「網站說明」，入口不會消失）；平板以上才顯示
.about {
  display: none;
  color: var(--color-text-primary);
  text-decoration: none;
  white-space: nowrap;

  @include bp.tablet-up {
    display: inline;
  }
}

// 上傳圖示：兩張圖疊在一起，滑過去換 hover 那張
.upload {
  display: grid;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  & img {
    grid-area: 1 / 1;
    display: block;
  }

  & .upload-hover {
    opacity: 0;
  }

  &:hover .upload-hover {
    opacity: 1;
  }

  &:hover .upload-default {
    opacity: 0;
  }
}
</style>
