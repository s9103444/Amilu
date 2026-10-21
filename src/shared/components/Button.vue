<template>
  <button
    type="button"
    class="text-button-md btn"
    :class="{ 'btn--secondary': variant === 'secondary', 'btn--hug': width === 'hug' }"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
/* 
元件名稱：主要、次要按鈕元件 
範例：
使用前先 import：import Button from '@/shared/components/Button.vue'
<Button>登入</Button> ---> 主要樣式款(width 100%)
<Button variant="secondary">登入</Button> ---> 次要樣式款(width 100%)
<Button width="hug"> ---> 主要樣式款(width auto)
<Button width="hug" variant="secondary"> ---> 次要樣式款(width auto)
<Button disabled>登入</Button> ---> 按鈕失效
*/
defineProps<{
  variant?: 'primary' | 'secondary'
  width?: 'full' | 'hug'
}>()
</script>

<style lang="scss" scoped>
//-----主要按鈕樣式-----//
.btn {
  cursor: pointer;
  display: flex;
  border: none;
  padding: var(--button-padding-md);
  justify-content: center;
  align-items: center;
  gap: var(--button-gap-md);
  border-radius: var(--radius-button);
  color: var(--color-button-text-primary);
  width: 100%;
  position: relative;
  background: var(--gradient-button-primary);
  z-index: 1;
  overflow: hidden;
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

//-----次要按鈕樣式-----//
.btn--secondary {
  background: var(--color-button-secondary-bg);
  color: var(--color-button-secondary);
  border: 1px solid var(--color-button-secondary);
  transition: background 0.3s ease;
}

.btn--hug {
  width: auto;
}

//-----按鈕失效樣式-----//
.btn:disabled {
  cursor: not-allowed;
  border: none;
  background: var(--color-button-disabled-bg);
  color: var(--color-button-disabled-text);
}
//-----hover裝置限制-----//
@media (hover: hover) {
  .btn:not(.btn--secondary):not(:disabled):hover::before {
    opacity: 1;
  }

  .btn--secondary:not(:disabled):hover {
    background: var(--color-button-secondary-hover-bg);
  }
}
</style>
