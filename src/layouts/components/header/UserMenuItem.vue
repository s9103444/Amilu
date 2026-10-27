<template>
  <button type="button" class="btn">
    <div class="left">
      <img class="icon" :src="base + icon" alt="" />
      <div class="layout">
        <span class="main-title text-small">{{ mainTitle }}</span>
        <span v-if="subTitle" class="sub-title">{{ subTitle }}</span>
      </div>
    </div>
    <img v-if="subRequire && isOpen" src="/icons/arrow-up-black.svg" alt="" />
    <img v-if="subRequire && isOpen === false" src="/icons/arrow-down-black.svg" alt="" />
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：個人選單的主項目（Figma 選單項目 518:206）
範例：
使用前先 import：import UserMenuItem from '@/layouts/components/header/UserMenuItem.vue'
<UserMenuItem icon="icons/user.svg" main-title="個人專頁" sub-title="個人展示頁面" />
<UserMenuItem icon="icons/logout.svg" main-title="登出" />  ---> 不傳 sub-title 就只有標題
<UserMenuItem icon="icons/circle-plus.svg" main-title="上傳作品" sub-title="一般 or 委託項目"
  sub-require :is-open="isUploadOpen" @click="isUploadOpen = !isUploadOpen" />  ---> 有子選單時加 sub-require，右側出現箭頭
icon 傳 public/ 底下的路徑，開頭不加 /（元件內會自動接上 BASE_URL，部署到子路徑才不會 404）
展開／收合由外面（UserMenu）記住，這個元件只負責顯示箭頭方向
subRequire、isOpen 沒傳時，Vue 會當成 false
*/
// icon 用 :src 綁定，Vite 不會自動補 base，要自己接（BASE_URL 結尾已經有 /）
const base = import.meta.env.BASE_URL
defineProps<{
  icon: string
  mainTitle: string
  subTitle?: string
  subRequire?: boolean
  isOpen?: boolean
}>()
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between; // 箭頭推到最右邊
  align-items: center;
  width: 100%;
  padding: 8px 12px 8px 16px;
  border: none;
  text-align: left;
  background: var(--color-bg-subtle);
  transition: background 0.3s ease;
}

// 圖示＋兩行文字，橫向排
.left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  flex-shrink: 0; // 文字很長時圖示不被擠小
}

.layout {
  display: flex;
  flex-direction: column;
  white-space: nowrap;
}

.main-title {
  color: var(--color-text-primary);
}

// Figma text style `note`：10px 固定，不隨斷點變化
.sub-title {
  font-family: var(--font-family);
  font-size: var(--fs-note);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
  color: var(--color-text-secondary);
}

// 只在有滑鼠的裝置套用，避免手機點完後一直停在 hover 色
@media (hover: hover) {
  .btn:hover {
    background: var(--color-bg-option-hover);
  }
}
</style>
