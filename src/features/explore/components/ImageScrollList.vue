<template>
  <OverlayScrollbarsComponent
    class="image-scroll-list"
    :options="{ scrollbars: { autoHide: 'scroll' } }"
    defer
  >
    <div v-for="(url, index) in images" :key="index" class="item">
      <img :src="url" alt="" />
    </div>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
/*
元件名稱：燈箱圖片列（垂直捲動，停下時自動對齊某張圖的頂端）
用在：作品展示燈箱、委託商店燈箱（features.md 2.5、2.6）
只負責把圖片由上往下排；圖片不能點，不用輪播。對齊靠 CSS scroll-snap，不用 JS
高度由外面的燈箱決定：外層要給固定高度（或 max-height），這裡才捲得動
範例：
使用前先 import：import ImageScrollList from '@/features/explore/components/ImageScrollList.vue'
<ImageScrollList :images="['/works/a.jpg', '/works/b.jpg']" />
*/
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

defineProps<{
  images: string[]
}>()
</script>

<style lang="scss" scoped>
// height: 100% 跟著外層燈箱的高度；沒寫的話會被圖片撐高，捲的會是外層，snap 就沒作用
.image-scroll-list {
  height: 100%;
}
.image-scroll-list :deep([data-overlayscrollbars-viewport]) {
  scroll-snap-type: y mandatory;
}
.image-scroll-list :deep(.os-theme-dark) {
  --os-handle-bg: var(--color-scrollbar-thumb);
  --os-handle-bg-hover: var(--color-scrollbar-thumb);
  --os-handle-bg-active: var(--color-scrollbar-thumb);
  --os-size: 10px;
}

.item {
  scroll-snap-align: start;
  height: 100%;
  & img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
