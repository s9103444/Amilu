<template>
  <OverlayScrollbarsComponent
    class="image-scroll-list"
    defer
    @os-initialized="onInitialized"
    @os-scroll="onScroll"
  >
    <!-- 軌道：手機橫排、平板以上直排；往哪個方向超出，套件就在那個方向畫捲軸 -->
    <div class="track" ref="trackRef">
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
<ImageScrollList :images="urls" :start-index="3" />  ---> 打開時直接停在第 4 張（從 0 算）；之後 start-index 換值就捲過去（委託商店燈箱用，features.md 2.6）
事件：
  index-change  使用者捲到另一張時送出，帶那張是第幾張（從 0 算）；委託商店燈箱用來換右側選取
*/
import { ref, watch, nextTick } from 'vue'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { OverlayScrollbars } from 'overlayscrollbars'
const props = withDefaults(defineProps<{ images: string[]; startIndex?: number }>(), {
  startIndex: 0,
})
const emit = defineEmits<{ 'index-change': [index: number] }>()
const trackRef = ref<HTMLElement | null>(null)
// 真正在捲的元素（套件建的）；初始化前是 null。不用 ref：畫面不需要因為它改變而更新
let viewport: HTMLElement | null = null

// 【條件 A：套件建好捲動區時，模板的 @os-initialized 呼叫】
function onInitialized(instance: OverlayScrollbars) {
  viewport = instance.elements().viewport
  scrollToStart()
}

// 【條件 B：圖片資料回來時】要等 Vue 把 <img> 畫出來（nextTick），trackRef 裡才找得到那張圖
watch(
  () => props.images,
  async () => {
    await nextTick()
    scrollToStart()
  },
)
// 【條件 C：start-index 換值時】委託商店燈箱右側點了別列；圖片早就畫好了，不用等 nextTick
watch(
  () => props.startIndex,
  () => {
    scrollToStart()
  },
)

// 【條件 A、B、C 都會呼叫】打開時 A、B 誰先到不一定：先到的那次會因為另一邊還沒好而 return，後到的那次才真的捲
// 距離＝已經捲了多少＋（目標圖離畫面頂端 − 捲動框離畫面頂端）；直的看 top、手機橫的看 left，不在捲的方向差值是 0
function scrollToStart() {
  if (viewport === null) return

  const item = trackRef.value?.children[props.startIndex]
  if (!item) return

  const itemRect = item.getBoundingClientRect()
  const viewportRect = viewport.getBoundingClientRect()

  viewport.scrollTo({
    top: viewport.scrollTop + itemRect.top - viewportRect.top,
    left: viewport.scrollLeft + itemRect.left - viewportRect.left,
  })
}
// 上一次通知出去的張數；放函式外面才記得住。只有換張時才 emit，捲動中同一張不重複通知
let currentIndex = 0
// 【左 → 右連動：使用者捲動時，套件的 @os-scroll 呼叫，一秒觸發很多次】把捲動位置換算成第幾張
// 每張圖＝框的高（平板以上直捲）或框的寬（手機橫捲），所以「捲了多少 ÷ 一張多大」四捨五入就是第幾張
function onScroll() {
  if (viewport === null) return
  const viewportHeight = viewport.clientHeight
  const viewportWidth = viewport.clientWidth
  const topImageNo = Math.round(viewport.scrollTop / viewportHeight)
  const leftImageNo = Math.round(viewport.scrollLeft / viewportWidth)
  const index = topImageNo + leftImageNo // 不在捲的那個方向一定是 0，相加就等於有在捲的那個

  if (currentIndex === index) return
  currentIndex = index
  emit('index-change', index)
}
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
