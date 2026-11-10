<template>
  <!-- 灰底滿版；裡面的內容用 container 置中、左右留白（main.scss），和 header、頁面對齊 -->
  <footer class="app-footer">
    <div class="inner container">
      <div class="top">
        <!-- 品牌：Logo＋標語＋社群圖示 -->
        <div class="brand">
          <img class="logo" :src="base + 'picture/logo-footer.svg'" alt="Amilu" />
          <p class="slogan text-small">致每個小小的、多彩的靈魂。</p>
          <ul class="social">
            <li v-for="item in SOCIAL_LINKS" :key="item.label">
              <a :href="item.href" :aria-label="item.label">
                <img :src="base + item.icon" alt="" />
              </a>
            </li>
          </ul>
        </div>
        <!-- 導覽：桌機、平板在右邊一排；手機在品牌下方、放不下就換行 -->
        <nav class="nav text-small" aria-label="頁尾導覽">
          <a v-for="item in NAV_LINKS" :key="item.label" :href="item.href">{{ item.label }}</a>
        </nav>
      </div>
      <hr class="divider" />
      <div class="bottom text-note">
        <p>本平台為個人專題作品，僅供作品集展示之用。</p>
        <p>© 2026 Amilu. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
/*
元件名稱：網站頁尾（Figma 641:302，桌機 641:200、平板 641:234、手機 641:268）
範例：
使用前先 import：import AppFooter from '@/layouts/components/AppFooter.vue'
<AppFooter />
寬度撐滿外層；三種版型由畫面寬度（斷點）切換，不用傳 props。
連結目前都是 '#'：頁面路由、社群網址還沒定，定了再換。
*/
const base = import.meta.env.BASE_URL

// 社群圖示（Figma 順序：GitHub、Facebook、X）
const SOCIAL_LINKS = [
  { label: 'GitHub', icon: 'icons/footer-github.svg', href: '#' },
  { label: 'Facebook', icon: 'icons/footer-facebook.svg', href: '#' },
  { label: 'X', icon: 'icons/footer-x.svg', href: '#' },
]

// 頁尾導覽（之後有路由改成 RouterLink）
const NAV_LINKS = [
  { label: '個人專頁', href: '#' },
  { label: '個人資料設定', href: '#' },
  { label: '上傳作品', href: '#' },
  { label: '約稿管理', href: '#' },
  { label: '接案設定', href: '#' },
  { label: '網站說明', href: '#' },
]
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

// 數值取自 Figma 641:302。手機優先：先寫手機（641:268），再往上疊平板、桌機
// 字級 --fs-small／--fs-caption 本身就會跟著斷點變，這裡不另外設
.app-footer {
  width: 100%;
  padding-block: var(--space-5);
  background: var(--color-footer-bg);
  color: var(--color-footer-text);

  @include tablet-up {
    padding-block: 56px var(--space-5);
  }
}

// 內容：左右留白和最寬 1440 由 .container 給
.inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  @include tablet-up {
    gap: var(--space-4);
  }
}

p {
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

//-----① 上方：品牌＋導覽-----//
// 手機上下排；平板以上左右分開
.top {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);

  @include tablet-up {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.logo {
  display: block;
  width: 120px;
  height: auto;
}

.social {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;

  & a,
  & img {
    display: block;
  }
}

// 手機：放不下就換行（列距 16、字距 24）；平板字距 24、桌機 40，不換行
.nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-3);
  white-space: nowrap;

  @include tablet-up {
    flex-wrap: nowrap;
    gap: var(--space-3);
  }

  @include desktop-up {
    gap: var(--space-5);
  }
}

//-----② 分隔線：文字色疊 40% 透明度（Figma base/500、opacity 40%）-----//
.divider {
  width: 100%;
  height: 1px;
  margin: 0;
  border: none;
  background: var(--color-footer-text);
  opacity: 0.4;
}

//-----③ 下方：聲明＋版權-----//
// 手機上下排、間距 8；平板以上左右分開
.bottom {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  @include tablet-up {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
