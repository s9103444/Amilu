<template>
  <div class="tab-bar" role="tablist">
    <div class="tabs">
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        role="tab"
        class="text-caption tab"
        :class="{ 'tab--active': model === item.value }"
        :aria-selected="model === item.value"
        @click="model = item.value"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
/*
元件名稱：主頁籤（Figma 559:2597，約稿管理的「已委託／已接案」）
範例：
使用前先 import：import TabBar from '@/shared/components/TabBar.vue'
<TabBar
  v-model="tab"
  :items="[
    { value: 'commissioned', label: '已委託' },
    { value: 'received', label: '已接案' },
  ]"
/>
v-model 綁目前選中的 value；點別的頁籤會改掉它，畫面要換什麼內容由外面決定。
選中的頁籤字變深、底下有橘線；整列下方有一條灰色分隔線，寬度撐滿。
*/
defineProps<{
  items: { value: T; label: string }[]
}>()

const model = defineModel<T>({ required: true })
</script>

<style lang="scss" scoped>
// 整列底下的灰色分隔線（Figma 559:2603）
.tab-bar {
  width: 100%;
  border-bottom: 1px solid var(--color-border);
}

// 頁籤之間 32（Figma 559:2598）
.tabs {
  display: flex;
  gap: var(--space-4);
}

// 每個頁籤：高 36、底線 2px；沒選中時底線和背景同色看不出來（Figma 用 base/100）
.tab {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 6px 0;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.3s ease;
}

.tab--active {
  border-bottom-color: var(--color-tab-active);
  color: var(--color-text-primary);
}

// 用鍵盤移到頁籤時顯示外框，滑鼠點擊不顯示（同 OptionButton）
.tab:focus-visible {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

// Figma 沒畫 hover，前端自訂：沒選中的頁籤滑過時字變深
@media (hover: hover) {
  .tab:not(.tab--active):hover {
    color: var(--color-text-primary);
  }
}
</style>
