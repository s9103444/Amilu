<template>
  <Lightbox size="sm" @close="emit('close')">
    <div class="commission-item">
      <h2 class="text-h3 title">{{ heading }}</h2>
      <hr class="divider" />
      <ImageUploadGrid
        v-model="images"
        :max="5"
        label="作品圖片"
        hint="單張 5MB 以內（JPG／PNG／WebP）・第一張為封面。"
      />
      <FormInput v-model="title" requirement="necessary" placeholder="請輸入委託標題"
        >標題</FormInput
      >
      <FormTextarea v-model="description" requirement="necessary" :text-limit="100"
        >委託說明</FormTextarea
      >
      <!-- inputmode：手機跳數字鍵盤；電腦仍打得出英文，所以 canSubmit 要再檢查全是數字 -->
      <FormInput
        v-model="price"
        inputmode="numeric"
        requirement="necessary"
        placeholder="請輸入價格"
        >價格</FormInput
      >
      <!-- 是否可商用：兩顆單選（同 CreatorSettingsPage 的 Amilu 燈）；被選那顆的 value 存進 commercial -->
      <div class="field">
        <div class="field-title">
          <span class="text-caption">是否可商用</span>
          <span class="text-note required">必填</span>
        </div>
        <div class="options">
          <OptionButton v-model="commercial" name="commercial" value="true">開放商用</OptionButton>
          <OptionButton v-model="commercial" name="commercial" value="false"
            >僅限個人使用</OptionButton
          >
        </div>
        <p class="text-note hint">
          每個委託項目各自設定。選「僅限個人使用」時，委託人申請此項目只能選「個人」授權。
        </p>
      </div>
      <!-- 分段方案：value 直接是 stage_plan_pref 的資料值；畫面照 spec 寫三點分段（Figma 的「單段」待同步，data-model.md 第 6 節第 16 項） -->
      <div class="field">
        <div class="field-title">
          <span class="text-caption">分段方案</span>
          <span class="text-note required">必填</span>
        </div>
        <div class="options">
          <OptionButton v-model="stagePlan" name="stagePlan" value="三點分段"
            >三點分段（草稿 &gt; 精稿 &gt; 完稿）</OptionButton
          >
          <OptionButton v-model="stagePlan" name="stagePlan" value="五點分段"
            >五點分段（草稿 &gt; 線稿 &gt; 彩稿 &gt; 精稿 &gt; 完稿）</OptionButton
          >
        </div>
        <p class="text-note hint">
          每個委託項目各自設定。委託人申請此項目時依此分段進行，無法更改。
        </p>
      </div>
      <ClassificationFields v-model:category="category" v-model:purpose="purpose" />
      <TagInput v-model="tags" />
      <!-- 底部提示：這兩項不在燈箱設定，讀接案設定（features.md 3.3、3.5） -->
      <InfoBox>訂金比例與修改次數沿用接案設定。</InfoBox>
      <div class="actions">
        <Button variant="outline" @click="emit('close')">取消</Button>
        <!-- 【按「儲存發布」時】onSubmit 送出（新增 POST /commission-items、編輯 PATCH /commission-items/{id}），存好才通知外面 -->
        <Button :disabled="!canSubmit || isSubmitting" @click="onSubmit">儲存發布</Button>
      </div>
    </div>
  </Lightbox>
</template>

<script setup lang="ts">
/*
元件名稱：上傳委託項目燈箱（features.md 3.3）
範例：
使用前先 import：import CommissionItemLightbox from '@/features/profile/components/CommissionItemLightbox.vue'
<CommissionItemLightbox v-if="isItemOpen" @close="isItemOpen = false" @submit="isItemOpen = false" /> ---> 新增
<CommissionItemLightbox v-if="isItemOpen" item-id="c01" … /> ---> 編輯：打開時自己抓這個項目的原內容填回表單（features.md 2.7「⋯ → 編輯」）
itemId：要編輯的項目 id；不傳＝新增
開關由外面用 v-if 控制；表單的值存在燈箱自己裡面，外面只需要知道關了或送出了
入口：header 上傳選單「委託項目」、開通流程 Step3（features.md 3.4）；explore、layouts 可以 import（structure.md 例外二）
圖片格、類型＋用途、標籤和一般作品燈箱共用同一組小元件
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
import InfoBox from '@/shared/components/InfoBox.vue'
import OptionButton from '@/shared/components/OptionButton.vue'
import {
  fetchCommissionItemForEdit,
  createCommissionItem,
  updateCommissionItem,
} from '@/features/profile/api'

const props = defineProps<{
  itemId?: string // 有值＝編輯這個項目；不傳＝新增
}>()
const emit = defineEmits<{
  close: []
  submit: []
}>()

const title = ref('')
// 委託說明，100 字內必填；名字對齊 COMMISSION_ITEM 的 description
const description = ref('')
// 價格先存字串（FormInput 的 v-model 是字串），送出時再轉數字
const price = ref('')
// 已選的圖片（file 送出用、url 預覽用）；ImageUploadGrid 透過 v-model 加、刪
const images = ref<UploadImage[]>([])
// 作品類型、用途的 id；選填，沒選是 ''（features.md 第 0 節），所以不影響能不能送出
const category = ref('')
const purpose = ref('')
// 是否可商用：OptionButton 的 value 只能是字串，先存 'true'／'false'，送出時用 === 'true' 轉成 commercial_allowed 的 boolean
// 必填但沒有預設值，'' ＝還沒選
const commercial = ref<'' | 'true' | 'false'>('')
// 分段方案：值直接對齊 stage_plan_pref；'' ＝還沒選
const stagePlan = ref<'' | '三點分段' | '五點分段'>('')
// 自訂標籤文字陣列；選填，TagInput 透過 v-model 加、刪
const tags = ref<string[]>([])

// 【打字、加刪圖片、點選項時自動重算】能不能送出：必填的全部成立才行（features.md 3.3）
// 至少 1 張圖、標題和說明去掉前後空白後不是空的、價格從頭到尾只有數字（擋掉「1,500」「abc」、空字串）、可商用和分段方案都選了
const canSubmit = computed(
  () =>
    images.value.length > 0 &&
    title.value.trim() !== '' &&
    description.value.trim() !== '' &&
    /^\d+$/.test(price.value) &&
    commercial.value !== '' &&
    stagePlan.value !== '',
)

// 燈箱標題：有 itemId ＝ 從「⋯ → 編輯」打開；沒有 ＝ 從「上傳作品 +」或 header 打開
const heading = computed(() => (props.itemId ? '編輯委託項目' : '上傳委託項目'))
const isSubmitting = ref(false)

// 【流程②：燈箱打開時】有 itemId ＝ 編輯模式：抓原內容填回表單；沒有就是新增，維持空白
onMounted(async () => {
  if (!props.itemId) return
  const edit = await fetchCommissionItemForEdit(props.itemId)
  if (!edit) return // 找不到這個項目：維持空白表單；下面就確定 edit 有值，不用 ?.
  title.value = edit.title
  description.value = edit.description
  // 價格：資料庫是數字，FormInput 要字串
  price.value = String(edit.price)
  // 可商用：資料庫是 boolean，OptionButton 的 value 是字串
  commercial.value = edit.commercial_allowed ? 'true' : 'false'
  // 分段方案：資料值和選項的 value 一樣，直接放
  stagePlan.value = edit.stage_plan_pref
  // 資料庫沒選是 null，表單的「沒選」是 ''
  category.value = edit.category_id ?? ''
  purpose.value = edit.purpose_id ?? ''
  tags.value = edit.tags
  // 舊圖只有網址、沒有使用者電腦裡的檔案：file 給 null（UploadImage 註解）
  images.value = edit.images.map((url) => ({ file: null, url }))
})

// 【流程③：按「儲存發布」時】把表單換成後端要的格式（api.md 5.9）：有 itemId 交給 updateCommissionItem（編輯），沒有交給 createCommissionItem（新增），存好再通知外面重抓
async function onSubmit() {
  // canSubmit 已經擋過，但 TS 不知道；這行讓下面的 stagePlan 型別確定是 '三點分段' | '五點分段'
  if (commercial.value === '' || stagePlan.value === '') return

  isSubmitting.value = true // 送出期間按鈕反灰，防連按送兩次
  try {
    // 新增、編輯共用的欄位
    const base = {
      title: title.value.trim(),
      description: description.value.trim(),
      price: Number(price.value), // '1500' → 1500；canSubmit 已確認全是數字
      commercial_allowed: commercial.value === 'true', // 'true' → true，'false' → false
      stage_plan_pref: stagePlan.value,
      // 表單沒選是 ''，資料庫沒選是 null
      category_id: category.value || null,
      purpose_id: purpose.value || null,
      tags: tags.value,
      // 只拿這次新加的檔案：map 拆成只剩 file → filter 濾掉舊圖的 null（型別變成 File[]）
      images: images.value.map((image) => image.file).filter((file): file is File => file !== null),
    }
    if (props.itemId) {
      // itemId 是「⋯ → 編輯」打開時 UserProfilePage 傳進來的
      await updateCommissionItem(props.itemId, {
        ...base,
        // 留下的舊圖：file 是 null 的就是舊圖，只取網址，照畫面順序
        kept_image_urls: images.value
          .filter((image) => image.file === null)
          .map((image) => image.url),
      })
    } else {
      await createCommissionItem(base)
    }
    emit('submit') // 存好了才通知外面
  } finally {
    isSubmitting.value = false // 送失敗也要恢復按鈕
  }
}
</script>

<style lang="scss" scoped>
// 燈箱內容：每一塊上下間距 24，同 DeleteConfirmLightbox；框的內距由 Lightbox size="sm" 給
.commission-item {
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

// 單選欄位：標題列、選項、說明上下排，間距 12（同 CreatorSettingsPage 的 .field）
.field {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
// 標題＋「必填」：字級不同，對齊文字基線（同 FormInput）
.field-title {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
// 「必填」顏色同 FormInput、FormTextarea、ImageUploadGrid
.required {
  color: var(--color-required);
}
// 選項：一行放不下就換行（五點分段那顆很長，窄的時候會掉到第二行）
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.hint {
  margin: 0;
  color: var(--color-text-secondary);
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
