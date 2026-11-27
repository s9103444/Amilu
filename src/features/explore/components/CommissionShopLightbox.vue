<template>
  <Lightbox @close="emit('close')">
    <LightboxLayout
      :images="imageUrls"
      :author="author"
      :start-index="startIndex"
      @index-change="onImageChange"
    >
      <!-- <hr class="divider" /> -->
      <section class="items">
        <div class="items-header">
          <h2 class="text-caption items-title">開放委託項目</h2>
          <!-- 價格旁的說明：列表上的價格是非商用價（Figma 528:2209） -->
          <span class="text-note price-note">
            非商用價格
            <img :src="base + 'icons/help.svg'" alt="" />
          </span>
        </div>
        <!-- 點一列＝選取並展開；共用 selectedItemId，同一時間只展開一列 -->
        <!-- 【右 → 左連動：使用者親手點列時】@change 是內部 radio 的原生事件、會冒泡到元件根元素；程式改 selectedItemId 時不會觸發，剛好分得出「點的」和「捲動造成的」 -->
        <CommissionItemOption
          v-for="item in items"
          :key="item.item_id"
          v-model="selectedItemId"
          name="commission-item"
          :value="item.item_id"
          :title="item.title"
          :description="item.description"
          :price="item.price"
          :commercial-allowed="item.commercial_allowed"
          @change="scrollTargetId = item.item_id"
        />
      </section>
      <template v-if="author?.bio">
        <CommissionRules title="作者簡介">{{ author.bio }}</CommissionRules>
      </template>
      <template #action>
        <!-- 暫不接案時不能送出（features.md 2.6） -->
        <!-- TODO 申請頁還沒有路由：之後帶 selectedItemId 進申請頁（features.md 4.1） -->
        <Button :disabled="!author?.is_open">我要委託</Button>
      </template>
    </LightboxLayout>
  </Lightbox>
</template>

<script setup lang="ts">
/*
元件名稱：委託商店燈箱（Figma 526:1781，features.md 2.6）
範例：
使用前先 import：import CommissionShopLightbox from '@/features/explore/components/CommissionShopLightbox.vue'
<CommissionShopLightbox v-if="shopCreatorId" :creator-id="shopCreatorId" :item-id="shopItemId" @close="shopCreatorId = null" />
creator-id：哪位創作者的商店；item-id：從可委託卡片點進來時傳被點的那筆，那列會預先展開；從作品燈箱進來不傳。
與作品燈箱是不同元件（features.md 2.6），共用的左右版型在 LightboxLayout。
*/
import { computed, ref, watch } from 'vue'
import Lightbox from '@/shared/components/Lightbox.vue'
import Button from '@/shared/components/Button.vue'
import LightboxLayout from '@/features/explore/components/LightboxLayout.vue'
import CommissionItemOption from '@/features/explore/components/CommissionItemOption.vue'
import CommissionRules from '@/features/explore/components/CommissionRules.vue'
import { fetchAuthor, fetchCreatorCommissionItems } from '@/features/explore/api'
import type { CommissionItem, LightboxAuthor, CommissionItemImage } from '@/features/explore/types'

const props = defineProps<{
  creatorId: string
  itemId?: string
}>()
const emit = defineEmits<{ close: [] }>()

const base = import.meta.env.BASE_URL
const items = ref<CommissionItem[]>([])
const images = ref<CommissionItemImage[]>([])
const author = ref<LightboxAuthor | null>(null)
// 右側展開哪一列（item_id）；空字串＝沒選。打開時、使用者點列、左側捲到別的項目時都會變
const selectedItemId = ref('')
// 左側要捲到哪個項目（item_id）；只在打開時、使用者親手點列時變，左側自己捲動時不變
// 和 selectedItemId 分開：不然左側捲到 A 的第 2 張 → 右側換 A → 左側又被拉回 A 的第一張（features.md 2.6）
const scrollTargetId = ref('')

// 【燈箱打開時、換創作者時】抓項目與作者；有傳 itemId 就預先選那列
watch(
  () => props.creatorId,
  async (creatorId) => {
    selectedItemId.value = props.itemId ?? ''
    scrollTargetId.value = props.itemId ?? ''
    const result = await fetchCreatorCommissionItems(creatorId)
    items.value = result.items
    images.value = result.images
    author.value = await fetchAuthor(creatorId)
  },
  { immediate: true },
)
// 【images 拿到後自動算】LightboxLayout 只吃網址陣列，從整列裡挑出 image_url
const imageUrls = computed(() => images.value.map((image) => image.image_url))
// 【images 拿到後自動算】左側圖片打開時要停在第幾張（features.md 2.6 預設定位）
// images 已照 seq_no 排好，第一個 item_id 相符的就是那個項目的第一張；
// 把「項目」翻成「第幾張」給 ImageScrollList：看 scrollTargetId，它換了左側就捲到那個項目的第一張（features.md 2.6）
// 找不到（-1）：資料還沒回來，或從作品燈箱進來還沒點任何一列（空字串），從第一張（0）開始
const startIndex = computed(() => {
  const index = images.value.findIndex((image) => image.item_id === scrollTargetId.value)
  return index === -1 ? 0 : index
})

// 【左 → 右連動：左側捲到另一張時，LightboxLayout 轉傳 index-change 呼叫】右側換成那張圖所屬的項目（features.md 2.6）
function onImageChange(index: number) {
  const imageNow = images.value[index]
  if (!imageNow) return // 陣列取不到是 undefined
  selectedItemId.value = imageNow.item_id
}
</script>

<style lang="scss" scoped>
.divider {
  flex-shrink: 0;
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

// 項目列表：標題列＋各列，間距 12（Figma 526:2036）
.items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.items-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.items-title {
  margin: 0;
  color: var(--color-text-primary);
  font-weight: var(
    --font-weight-medium
  ); // 字級比 Figma 小一階（彥廷調整），粗細照 Figma 的 Medium，同作品標題
}

.price-note {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--color-text-secondary);

  img {
    width: 10px;
    height: 10px;
  }
}
</style>
