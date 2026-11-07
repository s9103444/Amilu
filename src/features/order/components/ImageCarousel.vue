<template>
  <div class="img-carousel" :class="direction">
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
    direction?: 'horizontal' | 'vertical'
  }>(),
  {
    direction: 'horizontal',
  },
)
const options = computed(() => ({
  axis: props.direction === 'vertical' ? ('y' as const) : ('x' as const),
}))

const [emblaRef, emblaApi] = emblaCarouselVue(options) //會回傳兩個ref
const selectedIndex = ref(0)
const canPrev = ref(false)
const canNext = ref(false)

function update(api: EmblaCarouselType) {
  selectedIndex.value = api.selectedScrollSnap()
  canPrev.value = api.canScrollPrev()
  canNext.value = api.canScrollNext()
}

watch(emblaApi, (api) => {
  console.log('emblaApi 變了：', api)
  if (!api) return
  update(api)
  api.on('select', update)
  api.on('reInit', update)
})

const base = import.meta.env.BASE_URL
</script>

<style lang="scss" scoped>
.btn-prev-pic {
  & img {
    transform: scaleX(-1); // 左右翻轉：向右箭頭變向左
  }
}
.btn-disable {
  opacity: 0.5;
}
</style>
