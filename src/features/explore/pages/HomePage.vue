<template>
  <div class="options-layout">
    <div class="option-select">
      <ContentTypeSelect v-model="contentType" />
      <CategorySelect v-model="category" button-type="category" />
      <CategorySelect v-model="purpose" button-type="purpose" />
    </div>
    <div class="tag-list grab-area" ref="tagEmblaRef">
      <div class="tag-track">
        <HashtagLabel v-for="tag in MOCK_TAGS" :key="tag.tag_id">#{{ tag.name }}</HashtagLabel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContentTypeSelect from '@/features/explore/components/ContentTypeSelect.vue'
import CategorySelect from '@/features/explore/components/CategorySelect.vue'
import { ref } from 'vue'
import { MOCK_TAGS } from '@/mocks/tag'
import HashtagLabel from '@/shared/components/HashtagLabel.vue'
import emblaCarouselVue from 'embla-carousel-vue'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'

// 三個篩選值：下拉選了什麼，透過 v-model 存在這裡；之後拿來決定作品牆要抓哪些卡片
const contentType = ref('all')
const category = ref('')
const purpose = ref('')
// 【頁面載入時】Embla 接手標籤列：滑鼠拖、觸控板、手機滑都能左右移動；dragFree：放開停在原地，不吸附
const [tagEmblaRef] = emblaCarouselVue({ align: 'start', dragFree: true }, [WheelGesturesPlugin()])
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

// 篩選列（Figma 484:98 的 490:247）：左邊三顆下拉、右邊自訂標籤
// 手機：下拉一行、標籤一行，上下排；平板以上：同一行左右排
// position: relative 放在整列：CategorySelect 的面板以這裡為基準，撐滿整列寬（Figma 面板 496:2017 寬 1350）
.options-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  @include bp.tablet-up {
    flex-direction: row;
    align-items: center;
  }
}

// 三顆下拉：不換行、不被標籤擠小（Figma 按鈕 116 寬、每顆相隔 140）
.option-select {
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  align-items: center;
  gap: var(--space-2);
}

// 標籤列（Embla，同 DiscussionPostContent 的照片列）
// .tag-list 是窗口：吃掉剩下的寬度，超出的藏起來；min-width: 0 才縮得進剩下的空間
// .tag-track 是軌道：所有標籤橫排，比窗口寬；拖曳時 Embla 用 transform 移動它，不是捲軸
.tag-list {
  flex: 1;
  min-width: 0;
  overflow: hidden; // 游標、禁止選字由 .grab-area 給（main.scss）
}

.tag-track {
  display: flex;
  gap: var(--space-2);

  // 標籤不縮，寬度維持文字長度
  & > * {
    flex-shrink: 0;
  }
}
</style>
