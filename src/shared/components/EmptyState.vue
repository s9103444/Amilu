<template>
  <div class="empty-state">
    <div class="text">
      <img v-if="icon" class="icon" :src="base + icon" alt="" />
      <h2 class="text-h3 title">{{ title }}</h2>
      <p class="text-caption description">{{ description }}</p>
    </div>
    <div v-if="$slots.action" class="action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：空狀態（Figma 559:3152，約稿管理「尚未開通創作者模式」）
範例：
使用前先 import：import EmptyState from '@/shared/components/EmptyState.vue'
<EmptyState icon="icons/store.svg" title="尚未開通創作者模式" description="開通後即可在這裡查看接到的委託。">
  <template #action><Button>前往開通</Button></template>
</EmptyState>
icon 傳 public/ 底下的路徑，開頭不加 /（同 UserMenuItem）；不傳就不顯示圖示
按鈕放 #action，寬度固定 200（Figma），Button 用預設的 width="full" 撐滿這 200；沒放就不顯示按鈕區
*/
defineProps<{
  icon?: string
  title: string
  description: string
}>()

// icon 用 :src 綁定，Vite 不會自動補 base，要自己接（BASE_URL 結尾已經有 /）
const base = import.meta.env.BASE_URL
</script>

<style lang="scss" scoped>
// 置中直排；文字區和按鈕之間 40，上 60、下 72（Figma 559:3152）
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  padding: 60px var(--space-5) 72px;
  text-align: center;
}

// 圖示、標題、說明之間 16（Figma 559:3153）
.text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

// 圖示照原檔尺寸 90×88，不另外設寬高
.icon {
  display: block;
}

// Figma 用 H3 的 Medium，比 .text-h3 預設的 bold 細一階
.title {
  margin: 0;
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.description {
  margin: 0;
  color: var(--color-text-secondary);
}

// 按鈕寬 200，上方多留 8（Figma 559:3163）
.action {
  width: 200px;
  padding-top: var(--space-1);
}
</style>
