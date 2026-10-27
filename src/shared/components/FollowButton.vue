<template>
  <button
    class="btn"
    type="button"
    :class="[
      size === 'xs' ? 'text-small btn--xs' : 'text-button-sm',
      { 'btn--followed': followed },
    ]"
  >
    <span class="label" :class="{ 'label--hidden': followed }">Follow +</span>
    <span class="label" :class="{ 'label--hidden': !followed }">Followed</span>
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：追蹤按鈕（追蹤／已追蹤）
範例：
<FollowButton :followed="isFollowed" @click="isFollowed = !isFollowed" />
followed 為 true 顯示「Followed」灰底款，false 顯示「Follow +」外框款；
兩段文字疊在同一格，所以切換時按鈕寬度不會跳動。追蹤狀態由外面記住，按鈕只負責顯示。
size：預設 'sm'（個人頁、燈箱）；'xs' 是追蹤使用者列裡的小尺寸（Figma 522:1212）
*/
withDefaults(
  defineProps<{
    followed: boolean
    size?: 'sm' | 'xs'
  }>(),
  { size: 'sm' },
)
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
  width: fit-content;
  display: inline-grid;
  padding: var(--button-padding-sm);
  align-items: center;
  justify-items: center;
  border-radius: var(--radius-button);
  color: var(--color-text-primary);
  background: transparent;
  border: 1px solid currentColor;
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease;
}
// 小尺寸：只改留白和圓角，顏色和狀態跟一般尺寸一樣
.btn--xs {
  padding: var(--button-padding-xs);
  border-radius: var(--radius-button-xs);
}
// 兩段文字疊在同一格，按鈕寬度取較寬的那段；隱藏的那段仍佔位，但不會被看到或念出
.label {
  grid-area: 1 / 1;
}
.label--hidden {
  visibility: hidden;
}
.btn--followed {
  border-color: transparent;
  background: var(--color-button-followed-bg);
  color: var(--color-button-followed-text);
}
@media (hover: hover) {
  .btn:not(.btn--followed):hover {
    color: var(--color-text-on-dark);
    border-color: var(--color-text-primary);
    background: var(--color-text-primary);
  }
}
</style>
