<template>
  <div class="img-carousel">
    <div ref="emblaRef" class="view-port">
      <div class="track">
        <div v-for="(url, index) in images" :key="index" class="slide">
          <img :src="url" alt="" />
        </div>
      </div>
    </div>
    <!-- 按鈕放在 view-port 外面：track 裡的每個子元素都會被 Embla 當成一張圖 -->
    <button
      :disabled="!canPrev"
      :class="{ 'btn-disable': !canPrev }"
      type="button"
      class="btn-prev-pic"
      aria-label="上一張"
      @click="emblaApi?.scrollPrev()"
    >
      <img :src="base + 'icons/arrow-right-gray.svg'" alt="" />
    </button>
    <button
      :disabled="!canNext"
      :class="{ 'btn-disable': !canNext }"
      type="button"
      class="btn-next-pic"
      aria-label="下一張"
      @click="emblaApi?.scrollNext()"
    >
      <img :src="base + 'icons/arrow-right-gray.svg'" alt="" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaCarouselType } from 'embla-carousel'
const props = withDefaults(
  defineProps<{
    images: string[]
    startIndex?: number
  }>(),
  {
    startIndex: 0,
  },
)
const options = computed(() => ({
  startIndex: props.startIndex,
}))

const [emblaRef, emblaApi] = emblaCarouselVue(options) //會回傳兩個ref

const canPrev = ref(false)
const canNext = ref(false)

function update(api: EmblaCarouselType) {
  canPrev.value = api.canScrollPrev()
  canNext.value = api.canScrollNext()
}

watch(emblaApi, (api) => {
  if (!api) return
  update(api)
  api.on('select', update)
  api.on('reInit', update)
})

const base = import.meta.env.BASE_URL
</script>

<style lang="scss" scoped>
.img-carousel {
  position: relative;
  width: 100%;
}
.view-port {
  overflow: hidden;
}
.track {
  display: flex;
}
.slide {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  & img {
    display: block;
    max-width: 100%;
    max-height: 80vh;
  }
}
.btn-prev-pic,
.btn-next-pic {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-bg-page);
}
.btn-prev-pic {
  left: var(--space-2);
  & img {
    transform: scaleX(-1); // 左右翻轉：向右箭頭變向左
  }
}
.btn-next-pic {
  right: var(--space-2);
}
.btn-disable {
  opacity: 0.5;
}
</style>
