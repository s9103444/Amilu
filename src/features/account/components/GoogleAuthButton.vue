<template>
  <button type="button" class="text-button-md btn">
    <img src="/icons/icon-google.svg" alt="" aria-hidden="true" />
    <span>Google</span>
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：Google 登入／註冊按鈕
範例：
<GoogleAuthButton @click="用 Google 登入" />
只出現在登入頁與註冊頁。寬度 100%，由外層容器決定；文字固定為「Google」，沒有 props。
*/
</script>

<style lang="scss" scoped>
.btn {
  border: none;
  cursor: pointer;
  display: flex;
  width: 100%;
  padding: 14px 0;
  justify-content: center;
  align-items: center;
  gap: var(--button-gap-md);
  border-radius: 10px;
  background: var(--color-bg-subtle);
  transition: background-color 0.3s ease;
}
@media (hover: hover) {
  .btn:hover {
    background: var(--color-bg-subtle-hover);
  }
}
</style>
