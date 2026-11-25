<template>
  <Lightbox size="sm" @close="emit('close')">
    <div class="upload-work">
      <h2 class="text-h3 title">{{ heading }}</h2>
      <hr class="divider" />
      <ImageUploadGrid
        v-model="images"
        :max="20"
        label="作品圖片"
        hint="單張 5MB 以內（JPG／PNG／WebP）・第一張為封面。"
      />
      <FormInput v-model="title" requirement="necessary" placeholder="請輸入作品標題"
        >標題</FormInput
      >
      <FormTextarea v-model="content" requirement="optional" :text-limit="500">內文</FormTextarea>
      <ClassificationFields v-model:category="category" v-model:purpose="purpose" />
      <TagInput v-model="tags" />
      <div class="actions">
        <Button variant="outline" @click="emit('close')">取消</Button>
        <!-- 【按「儲存發布」時】onSubmit 送出 POST /works，存好才通知外面 -->
        <Button :disabled="!canSubmit || isSubmitting" @click="onSubmit">儲存發布</Button>
      </div>
    </div>
  </Lightbox>
</template>

<script setup lang="ts">
/*
元件名稱：上傳一般作品燈箱（features.md 3.2，Figma 上傳一般貼文）
範例：
使用前先 import：import UploadWorkLightbox from '@/features/profile/components/UploadWorkLightbox.vue'
<UploadWorkLightbox v-if="isUploadOpen" @close="isUploadOpen = false" @submit="isUploadOpen = false" /> ---> 新增
<UploadWorkLightbox v-if="isUploadOpen" work-id="w01" … /> ---> 編輯：打開時自己抓這件作品的原內容填回表單（features.md 2.7「⋯ → 編輯」）
開關由外面用 v-if 控制；表單的值存在燈箱自己裡面，外面只需要知道關了或送出了
workId：要編輯的作品 id；不傳＝新增
explore、layouts 可以 import 這個燈箱（structure.md 例外二）
事件：
  close   ✕、取消、點黑底、Esc
  submit  按「儲存發布」
*/
import { computed, onMounted, ref } from 'vue'
import Lightbox from '@/shared/components/Lightbox.vue'
import Button from '@/shared/components/Button.vue'
import FormInput from '@/shared/components/FormInput.vue'
import FormTextarea from '@/shared/components/FormTextarea.vue'
import ImageUploadGrid from '@/features/profile/components/ImageUploadGrid.vue'
import ClassificationFields from '@/features/profile/components/ClassificationFields.vue'
import type { UploadImage } from '@/features/profile/types'
import TagInput from '@/features/profile/components/TagInput.vue'
import { fetchWorkForEdit, createWork } from '@/features/profile/api'

const emit = defineEmits<{
  close: []
  submit: []
}>()
const props = defineProps<{
  workId?: string // 有值＝編輯這件作品；不傳＝新增
}>()

const title = ref('')
const content = ref('')
// 已選的圖片（file 送出用、url 預覽用）；ImageUploadGrid 透過 v-model 加、刪
const images = ref<UploadImage[]>([])
// 作品類型、用途的 id；選填，沒選是 ''（features.md 第 0 節），所以不影響能不能送出
const category = ref('')
const purpose = ref('')
// 自訂標籤文字陣列；選填，TagInput 透過 v-model 加、刪
const tags = ref<string[]>([])

// 燈箱標題：有 workId ＝ 從「⋯ → 編輯」打開；沒有 ＝ 從「上傳作品 +」打開
const heading = computed(() => (props.workId ? '編輯一般貼文' : '上傳一般貼文'))

// 【打字、加刪圖片時自動重算】能不能送出：至少 1 張圖＋標題去掉前後空白後不是空的（features.md 3.2）
const canSubmit = computed(() => images.value.length > 0 && title.value.trim() !== '')
const isSubmitting = ref(false)

// 【流程②：燈箱打開時】有 workId ＝ 編輯模式：抓原內容填回表單；沒有就是新增，維持空白
onMounted(async () => {
  if (!props.workId) return
  const edit = await fetchWorkForEdit(props.workId)
  if (!edit) return // 找不到這件作品：維持空白表單；下面就確定 edit 有值，不用 ?.
  title.value = edit.title
  content.value = edit.content
  // 資料庫沒選是 null，表單的「沒選」是 ''
  category.value = edit.category_id ?? ''
  purpose.value = edit.purpose_id ?? ''
  tags.value = edit.tags
  // 舊圖只有網址、沒有使用者電腦裡的檔案：file 給 null（UploadImage 註解）
  images.value = edit.images.map((url) => ({ file: null, url }))
})

// 【流程③：按「儲存發布」時】把表單換成後端要的格式（api.md 5.9）交給 createWork，存好再通知外面重抓
async function onSubmit() {
  if (props.workId) {
    emit('submit')
    return // TODO 編輯：PATCH /works/{id}（第 3 件做）
  }

  isSubmitting.value = true // 送出期間按鈕反灰，防連按送兩次
  try {
    await createWork({
      title: title.value.trim(),
      content: content.value.trim(),
      // 表單沒選是 ''，資料庫沒選是 null：'' || null 會得到 null
      category_id: category.value || null,
      purpose_id: purpose.value || null,
      tags: tags.value,
      // 只送檔案；新增模式不會有 null（舊圖才是 null），filter 是為了讓型別變成 File[]
      images: images.value.map((image) => image.file).filter((file): file is File => file !== null),
    })
    emit('submit') // 存好了才通知外面
  } finally {
    isSubmitting.value = false // 送失敗也要恢復按鈕，不然會一直反灰
  }
}
</script>

<style lang="scss" scoped>
// 燈箱內容：每一塊上下間距 24，同 DeleteConfirmLightbox；框的內距由 Lightbox size="sm" 給
.upload-work {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  color: var(--color-text-primary);
}

// 標題列右邊留空給 Lightbox 的 ✕
.title {
  margin: 0;
  padding-right: var(--space-4);
}

.divider {
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

// 兩顆按鈕平分寬度，中間 16
.actions {
  display: flex;
  gap: var(--space-2);

  > * {
    flex: 1;
  }
}
</style>
