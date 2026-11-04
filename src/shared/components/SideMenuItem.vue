<template>
  <button
    type="button"
    class="item text-caption"
    :class="`item--${status}`"
    :aria-current="status === 'selected' ? 'page' : undefined"
    :disabled="status === 'disabled'"
  >
    {{ title }}
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：側邊選單項目（Figma 613:561）
範例：
使用前先 import：import SideMenuItem from '@/shared/components/SideMenuItem.vue'
<SideMenuItem title="委託討論牆" :status="current === 'wall' ? 'selected' : 'default'" @click="current = 'wall'" />
status：
  'selected'  目前所在的項目，灰底
  'default'   一般項目
  'danger'    橘字，會造成重大後果的操作（例如可以申請時的「申請終止合作」）
  'disabled'  灰字、不能點（例如還不能申請時的「申請終止合作」），點了不會觸發 click
目前選到哪一項由外面記住，項目只負責顯示。寬度撐滿外層，由外層決定。
個人中心（模組三）和委託討論牆（模組四）都會用，所以放 shared。
*/
withDefaults(
  defineProps<{
    title: string
    status?: 'selected' | 'default' | 'danger' | 'disabled'
  }>(),
  { status: 'default' },
)
</script>

<style lang="scss" scoped>
// 先蓋掉 button 的瀏覽器預設樣式（灰底、框線、置中）
.item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--color-text-primary);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.item--selected {
  background: var(--color-bg-nav-selected);
}
.item--danger {
  color: var(--color-danger);
}
.item--disabled {
  color: var(--color-text-secondary);
  cursor: not-allowed;
}
// Figma 沒畫 hover：用比選中淺一階的底色，才分得出「滑過」和「選中」
// 只在有滑鼠的裝置套用，避免手機點完後底色卡住
@media (hover: hover) {
  .item:not(.item--selected):not(:disabled):hover {
    background: var(--color-bg-nav-hover);
  }
}
</style>
