<template>
  <button
    type="button"
    class="item text-caption"
    :class="`item--${status}`"
    :aria-current="status === 'selected' ? 'page' : undefined"
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
  'secondary' 灰字的次要項目（例如「申請終止合作」），一樣可以點
目前選到哪一項由外面記住，項目只負責顯示。寬度撐滿外層，由外層決定。
個人中心（模組三）和委託討論牆（模組四）都會用，所以放 shared。
*/
withDefaults(
  defineProps<{
    title: string
    status?: 'selected' | 'default' | 'secondary'
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
.item--secondary {
  color: var(--color-text-secondary);
}
// Figma 沒畫 hover：用比選中淺一階的底色，才分得出「滑過」和「選中」
// 只在有滑鼠的裝置套用，避免手機點完後底色卡住
@media (hover: hover) {
  .item:not(.item--selected):hover {
    background: var(--color-bg-nav-hover);
  }
}
</style>
