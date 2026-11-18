<template>
  <OverlayScrollbarsComponent class="image-scroll-list" defer>
    <!-- 軌道：手機橫排、平板以上直排；往哪個方向超出，套件就在那個方向畫捲軸 -->
    <div class="track">
      <div v-for="(url, index) in images" :key="index" class="item">
        <img :src="url" alt="" />
      </div>
    </div>
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
/*
元件名稱：燈箱圖片列（手機橫向、平板以上垂直捲動，停下時自動對齊某張圖）
用在：作品展示燈箱、委託商店燈箱（features.md 2.5、2.6）
手機左右滑、對齊每張的左緣；平板以上上下捲、對齊每張的頂端（手機橫向是 2026/11/16 彥廷決定，spec 寫垂直）
圖片不能點，不用輪播。對齊靠 CSS scroll-snap，不用 JS；方向只靠 CSS 換排法，套件不用另外設定
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
@use '@/styles/breakpoints' as bp;

// height: 100% 跟著外層燈箱的高度；沒寫的話會被圖片撐高，捲的會是外層，snap 就沒作用
.image-scroll-list {
  height: 100%;
}
// 對齊方向：手機左右、平板以上上下
.image-scroll-list :deep([data-overlayscrollbars-viewport]) {
  scroll-snap-type: x mandatory;

  @include bp.tablet-up {
    scroll-snap-type: y mandatory;
  }
}
// 直向捲軸放左側：套件預設貼右邊（right: 0），改成貼左邊；手機是橫向捲軸，在底部不用動
.image-scroll-list :deep(.os-scrollbar-vertical) {
  @include bp.tablet-up {
    right: auto;
    left: 0;
  }
}
.image-scroll-list :deep(.os-theme-dark) {
  --os-handle-bg: var(--color-scrollbar-thumb);
  --os-handle-bg-hover: var(--color-scrollbar-thumb);
  --os-handle-bg-active: var(--color-scrollbar-thumb);
  --os-size: 8px;
}

// 軌道和捲動區一樣大；每張圖佔滿一整格（flex-basis 100%），超出軌道的部分由外層捲動
.track {
  display: flex;
  height: 100%;

  @include bp.tablet-up {
    flex-direction: column;
  }
}

// 手機對齊左緣、平板以上對齊頂端（start 會跟著捲動方向）
.item {
  flex: 0 0 100%;
  min-width: 0;
  min-height: 0;
  scroll-snap-align: start;

  & img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
