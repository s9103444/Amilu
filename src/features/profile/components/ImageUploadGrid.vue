<template>
  <div class="image-upload-grid">
    <!-- 標題列：左邊標題＋必填，右邊目前張數／上限（結構同 FormTextarea） -->
    <div class="title-content">
      <div class="note">
        <span class="text-caption label">{{ label }}</span>
        <span class="text-note label--nes">必填</span>
      </div>
      <span class="text-note count">{{ images.length }} / {{ max }} 張</span>
    </div>
    <!-- 原生選檔框藏起來，點「新增圖片」時用程式代按它（同 ProfileSettingsPage 的大頭照） -->
    <!-- 【選好檔案時】觸發 onPick；multiple：一次可以選很多張 -->
    <input
      ref="image-file"
      type="file"
      multiple
      hidden
      accept="image/jpeg, image/png, image/webp"
      @change="onPick"
    />
    <!-- 手抓左右滑（同 DiscussionPostContent）：外層是窗口（超出藏起來），裡面的軌道整條被拖著移動 -->
    <div ref="emblaRef" class="viewport grab-area">
      <div class="track">
        <!-- 第一張是封面（features.md 3.2）；key 用預覽網址，每張都不一樣 -->
        <ImageUploadSlot
          v-for="(image, index) in images"
          :key="image.url"
          :status="index === 0 ? 'uploaded-cover' : 'uploaded'"
          :src="image.url"
          @remove="removeImage(index)"
        />
        <!-- 【點「新增圖片」時】代按藏起來的選檔框，跳出選檔視窗；滿了就不顯示 -->
        <ImageUploadSlot v-if="images.length < max" status="add" @click="imageFileEl?.click()" />
      </div>
    </div>
    <!-- 格子下方：說明一直顯示；選檔不合格時多一行錯誤 -->
    <p class="text-note hint">{{ hint }}</p>
    <p v-if="error" class="text-note error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：上傳燈箱的圖片格（一般作品燈箱、委託項目燈箱共用，features.md 3.2、3.3）
範例：
使用前先 import：import ImageUploadGrid from '@/features/profile/components/ImageUploadGrid.vue'
<ImageUploadGrid v-model="images" :max="20" label="作品圖片" hint="單張 5MB 以內…" />
v-model：已選的圖片陣列（UploadImage[]），資料由燈箱持有，這裡只負責加、刪；燈箱送出時從裡面拿 file
max：最多幾張（一般作品 20、委託項目 5）
label、hint：標題列文字、格子下方說明；兩個燈箱寫法不同，由外面傳
*/
import { useTemplateRef, ref, onUnmounted } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import ImageUploadSlot from '@/shared/components/ImageUploadSlot.vue'
import type { UploadImage } from '@/features/profile/types'

const props = defineProps<{ max: number; label: string; hint: string }>()
const images = defineModel<UploadImage[]>({ required: true })
const imageFileEl = useTemplateRef<HTMLInputElement>('image-file')
// dragFree：放手停在哪就是哪，不吸附到某一格；WheelGesturesPlugin：觸控板左右滑也能捲
// 格子數量變了（新增、刪除）Embla 會自己重新計算，不用手動處理
const [emblaRef] = emblaCarouselVue({ align: 'start', dragFree: true }, [WheelGesturesPlugin()])
// 選檔不合格時的錯誤文字；空字串＝沒錯誤，每次選檔重新算
const error = ref('')
// 圖片限制（features.md 3.2、3.3，同大頭照 3.1）：格式和選檔框的 accept 一致；accept 擋不住「所有檔案」，所以這裡要再檢查
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB，換算成 byte

// 【選好檔案時觸發（input 的 @change）】逐張檢查，合格的產生預覽網址，一次加進陣列
function onPick(event: Event) {
  error.value = ''
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? []) // FileList 不是真的陣列，轉成陣列才能 for...of 以外的操作
  input.value = '' // 先清掉，下次選同一張才會再觸發 change
  const picked: UploadImage[] = []
  for (const file of files) {
    // 不合格的跳過這張、繼續看下一張（用 return 會連後面合格的一起丟掉）
    if (!ALLOWED_TYPES.includes(file.type)) {
      error.value = '圖片格式不符'
      continue
    }
    if (file.size > MAX_SIZE) {
      error.value = '圖片需在 5MB 以內'
      continue
    }
    // 已有的＋這次收的到上限就整個停下，後面的檔案都不收
    if (images.value.length + picked.length >= props.max) {
      error.value = `最多 ${props.max} 張`
      break
    }
    // 檔案還在使用者電腦上，img 不能直接顯示 File；產生一個暫時網址（blob:）給 img 用
    picked.push({ file, url: URL.createObjectURL(file) })
  }
  // 整個換成新陣列，不直接 push 進 images.value：v-model 的資料屬於燈箱，換新陣列才會正式通知燈箱更新
  images.value = [...images.value, ...picked]
}

// 【點縮圖的 ✕ 時觸發（ImageUploadSlot 的 remove）】拿掉第 index 張
function removeImage(index: number) {
  const removed = images.value[index]
  if (!removed) return // 陣列取不到是 undefined
  URL.revokeObjectURL(removed.url) // 暫時網址還給瀏覽器，不然那張圖會一直佔記憶體到關分頁
  // 同 onPick：換成新陣列；_ 代表用不到的參數（那一張本身），只看位置 i
  images.value = images.value.filter((_, i) => i !== index)
}

// 【燈箱關閉（元件拿掉）時】還沒刪的圖，暫時網址全部還給瀏覽器，不然會一直佔記憶體到關分頁
// 送出成功也一樣：送給後端的是 file，不是這個網址；編輯時傳進來的一般網址 revoke 了也沒影響
onUnmounted(() => {
  images.value.forEach((image) => URL.revokeObjectURL(image.url))
})
</script>

<style lang="scss" scoped>
// 標題列、格子、說明、錯誤上下排，間距 6（同 FormTextarea）
.image-upload-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

// 標題列：左右兩端對齊（同 FormTextarea）
.title-content {
  display: flex;
  justify-content: space-between;
}
.note {
  display: flex;
  gap: 4px;
  align-items: baseline; // 標題和「必填」小字對齊文字基線
}
.label {
  color: var(--color-text-primary);
}
.label--nes {
  color: var(--color-required);
}
.count {
  color: var(--color-text-secondary);
}

// 窗口：超出的格子藏起來；游標、禁止選字由 .grab-area 給（main.scss）
.viewport {
  overflow: hidden;
}

// 軌道：一排不換行，每格之間 16
.track {
  display: flex;
  gap: var(--space-2);

  // 每一格固定大小，不被擠扁（ImageUploadSlot 自己是 120×120）
  > * {
    flex-shrink: 0;
  }
}
</style>
