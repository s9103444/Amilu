<template>
  <div class="options-layout">
    <div class="option-select">
      <ContentTypeSelect v-model="contentType" />
      <CategorySelect v-model="category" button-type="category" />
      <CategorySelect v-model="purpose" button-type="purpose" />
    </div>
    <div class="tag-list grab-area" ref="tagEmblaRef">
      <div class="tag-track">
        <!-- 【點標籤時】加進「已選擇」列（Embla 拖曳放開不會誤觸點擊） -->
        <HashtagLabel v-for="tag in MOCK_TAGS" :key="tag.tag_id" @click="addTag(tag.tag_id)"
          >#{{ tag.name }}</HashtagLabel
        >
      </div>
    </div>
  </div>
  <!-- 已選擇列（Figma 490:490）：把目前的篩選值畫出來，點一顆就取消那個篩選；什麼都沒選時整列不顯示 -->
  <div class="selected-row" v-if="hasSelection">
    <span class="text-caption">已選擇</span>
    <div class="selected-chips">
      <!-- 黑底：三顆下拉各最多一個值，所以用 v-if 判斷有沒有選，不用 v-for -->
      <!-- 【點黑底標籤時】把值改回「沒選」；v-model 是雙向的，下拉選單也會跟著回到沒選 -->
      <FilterChip v-if="contentType !== 'all'" @click="contentType = 'all'">{{
        contentTypeLabel
      }}</FilterChip>
      <FilterChip v-if="category !== ''" @click="category = ''">{{ categoryLabel }}</FilterChip>
      <FilterChip v-if="purpose !== ''" @click="purpose = ''">{{ purposeLabel }}</FilterChip>
      <!-- 透底：標籤可多選，所以用 v-for；【點透底標籤時】removeTag 從 selectedTags 拿掉 -->
      <FilterChip
        v-for="tag in selectedTagList"
        :key="tag.tag_id"
        variant="outline"
        @click="removeTag(tag.tag_id)"
        >#{{ tag.name }}</FilterChip
      >
    </div>
  </div>
  <!-- 作品牆（瀑布流）：外層一欄一個直排容器，內層畫這一欄分到的卡片（作品＋可委託項目混排）；分欄邏輯在 useGalleryColumns -->
  <div class="gallery">
    <!-- 欄沒有自己的 ID，它就是「第幾欄」，用位置當 key -->
    <div class="gallery-column" v-for="(column, index) in columns" :key="index">
      <!-- 大頭照先不傳（顯示預設圖）：作者資料要另外抓，之後再接 -->
      <WorkCard
        v-for="card in column"
        :type="card.type"
        :key="card.id"
        :image-url="card.image_url"
        :title="card.title"
        :author-id="card.author_id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContentTypeSelect from '@/features/explore/components/ContentTypeSelect.vue'
import CategorySelect from '@/features/explore/components/CategorySelect.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { MOCK_TAGS } from '@/mocks/tag'
import HashtagLabel from '@/shared/components/HashtagLabel.vue'
import emblaCarouselVue from 'embla-carousel-vue'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import {
  fetchWorks,
  fetchWorkImages,
  fetchCommissionItems,
  fetchCommissionImages,
} from '@/features/explore/api'
import { useGalleryColumns } from '@/features/explore/composables/useGalleryColumns'
import WorkCard from '@/features/explore/components/WorkCard.vue'
import { CONTENT_TYPE_OPTIONS } from '@/features/explore/constants'
import { CATEGORY_OPTIONS, PURPOSE_OPTIONS } from '@/mocks/classification'
import FilterChip from '@/shared/components/FilterChip.vue'
import type { GalleryCard } from '@/features/explore/types'
// 三個篩選值：下拉選了什麼，透過 v-model 存在這裡；之後拿來決定作品牆要抓哪些卡片
const contentType = ref('all')
const category = ref('')
const purpose = ref('')
// 目前選了哪些自訂標籤：存 tag_id（之後送後端篩選用 ID，名稱畫面上才查），可多選；沒選是 []
const selectedTags = ref<string[]>([])

// 【點標籤列的標籤時，模板呼叫】還沒選過才加進去，避免同一個標籤出現兩次
function addTag(tagId: string) {
  if (!selectedTags.value.includes(tagId)) {
    selectedTags.value.push(tagId)
  }
}
// 【點「已選擇」列的透底標籤時，模板呼叫】留下「不是這個 ID」的，等於把它拿掉
// filter 交出新陣列、不改原本的，所以要用 = 存回去
function removeTag(tagId: string) {
  selectedTags.value = selectedTags.value.filter((id) => id !== tagId)
}
// 「已選擇」黑底標籤的文字：v-model 存的是 value／ID，用 find 查回中文名稱（同 ContentTypeSelect 的 selectedLabel）
// 三個值一變就自動重算；沒選時找不到，?. 讓結果是 undefined（模板會用 v-if 不畫）
// 箭頭函式不加 { }：=> 後面那個值就是回傳值；加了 { } 就要自己寫 return
const contentTypeLabel = computed(
  () => CONTENT_TYPE_OPTIONS.find((item) => item.value === contentType.value)?.label,
)
const categoryLabel = computed(
  () => CATEGORY_OPTIONS.find((item) => item.value === category.value)?.label,
)
const purposeLabel = computed(
  () => PURPOSE_OPTIONS.find((item) => item.value === purpose.value)?.label,
)
// 「已選擇」透底標籤：selectedTags 只有 ID，從 MOCK_TAGS 挑出「ID 在 selectedTags 裡」的整筆，模板才拿得到 name
// 順序跟標籤列一樣，不是點擊順序
const selectedTagList = computed(() =>
  MOCK_TAGS.filter((tag) => selectedTags.value.includes(tag.tag_id)),
)
// 「已選擇」列要不要顯示：4 個值只要有一個不是「沒選」就是 true（|| ＝或）
// 每個值「沒選」長得不一樣：作品分類是 'all'、類型與用途是 ''、標籤是空陣列
const hasSelection = computed(
  () =>
    contentType.value !== 'all' ||
    category.value !== '' ||
    purpose.value !== '' ||
    selectedTags.value.length > 0,
)

// 【頁面載入時】Embla 接手標籤列：滑鼠拖、觸控板、手機滑都能左右移動；dragFree：放開停在原地，不吸附
const [tagEmblaRef] = emblaCarouselVue({ align: 'start', dragFree: true }, [WheelGesturesPlugin()])
// 作品牆的卡片（作品＋可委託項目已轉成同一個形狀）：一開始是空的，loadWorks 跑完才填進來
// <GalleryCard[]> 不能省：只寫 ref([])，TypeScript 會當成永遠裝不了東西的陣列
const cards = ref<GalleryCard[]>([])
// 【頁面建立時】交給 useGalleryColumns 分欄；傳 ref 本身（不是 cards.value），fetch 回來後 columns 會自動重算
const { columns } = useGalleryColumns(cards)

// 【頁面掛上後、篩選值改變時呼叫】抓作品＋可委託項目 → 轉成同一種卡片 → 新到舊排
async function loadWorks() {
  // ① 依作品分類決定要抓哪幾種（值見 constants.ts：all／commission／work）
  const wantWorks = contentType.value !== 'commission'
  const wantItems = contentType.value !== 'work'
  const filter = { category: category.value, purpose: purpose.value, tag_ids: selectedTags.value }

  // ② 不需要的那種直接給空陣列
  const works = wantWorks ? await fetchWorks(filter) : []
  const items = wantItems ? await fetchCommissionItems(filter) : []
  const workImages = await fetchWorkImages()
  const itemImages = await fetchCommissionImages()

  // ③ 轉成同一個形狀；封面在這裡就找好：用 id 去圖片清單找 seq_no 1，找不到用 ?? 換成空字串
  const workCards = works.map((work): GalleryCard => ({
    id: work.work_id,
    type: 'work',
    image_url:
      workImages.find((image) => image.work_id === work.work_id && image.seq_no === 1)?.image_url ??
      '',
    title: work.title,
    author_id: work.user_id,
    created_at: work.created_at,
  }))
  const itemCards = items.map((item): GalleryCard => ({
    id: item.item_id,
    type: 'commission-item',
    image_url:
      itemImages.find((image) => image.item_id === item.item_id && image.seq_no === 1)?.image_url ??
      '',
    title: item.title,
    author_id: item.creator_id,
    created_at: item.created_at,
  }))

  // ④ 合併後新到舊；created_at 格式都一樣（ISO＋08:00），字串比大小就等於比時間
  cards.value = [...workCards, ...itemCards].sort(
    (a, b) => b.created_at.localeCompare(a.created_at), //比較兩件作品的建立時間，讓比較新的排在前面
  )
}

// 【頁面掛上後】第一次載入作品牆；await 只能寫在 async 函式裡，所以包在 onMounted(async ...)
// 不在 script 最上層直接 await：那會把元件變成非同步元件，要外層包 <Suspense> 才能顯示
onMounted(async () => {
  await loadWorks()
})

// 【任何篩選值改變時】重新載入；deep：selectedTags 用 push 改內容，不加 deep 監看不到
watch([contentType, category, purpose, selectedTags], loadWorks, { deep: true })
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

// 已選擇列（Figma 490:490）：「已選擇」文字＋右邊一排可取消的標籤
// 列內間距照 Figma（文字到標籤 28、標籤之間 18）；與上方篩選列的距離是頁面排版，用 8 的倍數（Figma 29 → 32）
.selected-row {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: var(--space-4);
}

// 「已選擇」文字不被標籤擠小、不換行
.selected-row > .text-body {
  flex-shrink: 0;
  color: var(--color-text-primary);
}

// 標籤排：Figma 超出切掉，前端改成換行（手機很窄，選多了才看得到全部）
// 換行後上下也要有間距，所以 gap 只寫一個值（上下左右都 18）
.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  min-width: 0;
}

// 作品牆（瀑布流）：欄左右並排、平分寬度；欄數由 useGalleryColumns 讀 --gallery-columns 決定
// align-items: flex-start：每欄高度跟著自己的內容，不被拉成跟最高那欄一樣
// 欄間距用 --grid-gutter（手機 16／平板 16／桌機 24），與上方篩選列的距離用頁面排版間距 --space-*
.gallery {
  display: flex;
  gap: var(--grid-gutter);
  align-items: flex-start;
  margin-top: var(--space-3);
}

// 一欄：flex: 1 平分寬度；min-width: 0 允許比內容窄，長標題才不會把這欄撐寬（同 .tag-list）
// 欄裡的卡片上下排，上下間距跟欄間距一樣；卡片寬度由 WorkCard 的 width: 100% 撐滿欄寬
.gallery-column {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--grid-gutter);
  min-width: 0;
}
</style>
