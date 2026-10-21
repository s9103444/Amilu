<template>
  <button type="button" class="text-button-sm btn">
    <span>開通創作者模式</span><img src="/icons/arrow-right-white.svg" alt="" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：個人選單裡的「開通創作者模式」按鈕
範例：
<ActivateCreatorButton @click="開通創作者" />
hover 時背景換成按下款漸層，右箭頭往右移 2px。文字固定，沒有 props。
*/
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
  border: none;
  display: inline-flex;
  padding: var(--button-padding-sm);
  justify-content: center;
  align-items: center;
  gap: var(--button-gap-sm);
  width: fit-content;
  border-radius: var(--radius-button);
  color: var(--color-button-text-primary);
  background: var(--gradient-button-primary);
  z-index: 1;
  position: relative;
  overflow: hidden;
  & img {
    display: block;
    transition: transform 0.3s ease;
  }
}
.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-button-primary-active);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}
@media (hover: hover) {
  .btn:hover::before {
    opacity: 1;
  }
  .btn:hover img {
    transform: translateX(2px);
  }
}
</style>
