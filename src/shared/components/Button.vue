<template>
  <button
    type="button"
    class="btn"
    :class="[
      size === 'sm' ? 'text-button-sm btn--sm' : 'text-button-md',
      {
        'btn--secondary': variant === 'secondary',
        'btn--outline': variant === 'outline',
        'btn--hug': width === 'hug',
      },
    ]"
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
<Button variant="outline"> ---> 黑框黑字款（例如開通清單的「修改」）
<Button disabled>登入</Button> ---> 按鈕失效
<Button size="sm" width="hug">前往填寫</Button> ---> 小尺寸（Figma Amilu/Button-sm），字級、內距、間距都跟著變小
*/
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline'
    width?: 'full' | 'hug'
    size?: 'md' | 'sm'
  }>(),
  {
    size: 'md',
  },
)
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
  white-space: nowrap;
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

//-----黑框黑字按鈕樣式-----//
.btn--outline {
  background: var(--color-button-outline-bg);
  color: var(--color-button-outline);
  border: 1px solid var(--color-button-outline);
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
  // 彩虹漸層 hover 只給主按鈕；次要、黑框款各自換底色
  .btn:not(.btn--secondary):not(.btn--outline):not(:disabled):hover::before {
    opacity: 1;
  }

  .btn--secondary:not(:disabled):hover {
    background: var(--color-button-secondary-hover-bg);
  }

  .btn--outline:not(:disabled):hover {
    background: var(--color-button-outline-hover-bg);
  }
}
.btn--sm {
  padding: var(--button-padding-sm);
  gap: var(--button-gap-sm);
}
</style>
