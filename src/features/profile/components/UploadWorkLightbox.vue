<template>
  <Lightbox size="sm" @close="emit('close')">
    <div class="upload-work">
      <h2 class="text-h3 title">上傳一般貼文</h2>
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
        <!-- 【按「儲存發布」時】先只通知外面；POST /works 等圖片做完再接（api.md） -->
        <Button :disabled="!canSubmit" @click="emit('submit')">儲存發布</Button>
      </div>
    </div>
  </Lightbox>
</template>

<script setup lang="ts">
/*
元件名稱：上傳一般作品燈箱（features.md 3.2，Figma 上傳一般貼文）
範例：
使用前先 import：import UploadWorkLightbox from '@/features/profile/components/UploadWorkLightbox.vue'
<UploadWorkLightbox v-if="isUploadOpen" @close="isUploadOpen = false" @submit="isUploadOpen = false" />
開關由外面用 v-if 控制；表單的值存在燈箱自己裡面，外面只需要知道關了或送出了
explore、layouts 可以 import 這個燈箱（structure.md 例外二）
事件：
  close   ✕、取消、點黑底、Esc
  submit  按「儲存發布」
*/
import { computed, ref } from 'vue'
import Lightbox from '@/shared/components/Lightbox.vue'
import Button from '@/shared/components/Button.vue'
import FormInput from '@/shared/components/FormInput.vue'
import FormTextarea from '@/shared/components/FormTextarea.vue'
import ImageUploadGrid from '@/features/profile/components/ImageUploadGrid.vue'
import ClassificationFields from '@/features/profile/components/ClassificationFields.vue'
import type { UploadImage } from '@/features/profile/types'
import TagInput from '@/features/profile/components/TagInput.vue'

const emit = defineEmits<{
  close: []
  submit: []
}>()

const title = ref('')
const content = ref('')
// 已選的圖片（file 送出用、url 預覽用）；ImageUploadGrid 透過 v-model 加、刪
const images = ref<UploadImage[]>([])
// 作品類型、用途的 id；選填，沒選是 ''（features.md 第 0 節），所以不影響能不能送出
const category = ref('')
const purpose = ref('')

// 【打字、加刪圖片時自動重算】能不能送出：至少 1 張圖＋標題去掉前後空白後不是空的（features.md 3.2）
const canSubmit = computed(() => images.value.length > 0 && title.value.trim() !== '')
const tags = ref<string[]>([])
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
