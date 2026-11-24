<template>
  <div class="tag-input">
    <!-- 【在輸入框按 Enter 時】觸發 onEnter；keydown 從 input 往外傳到 FormInput 最外層的 div，掛在元件上就收得到 -->
    <FormInput
      v-model="draft"
      requirement="optional"
      placeholder="輸入後按 Enter 新增"
      @keydown.enter="onEnter"
      >自訂標籤</FormInput
    >
    <!-- 已加的標籤：點一下（✕）刪掉；key 用文字，addTag 已經擋掉重複，不會撞 -->
    <div v-if="tags.length" class="chips">
      <FilterChip
        v-for="(tag, index) in tags"
        :key="tag"
        variant="outline"
        @click="removeTag(index)"
        >{{ tag }}</FilterChip
      >
    </div>
    <!-- 建議標籤：已加過的不顯示；【點一下時】跟按 Enter 走同一個 addTag -->
    <div v-if="suggestions.length" class="suggestions">
      <HashtagLabel v-for="tag in suggestions" :key="tag" @click="addTag(tag)"
        >#{{ tag }}</HashtagLabel
      >
    </div>
    <p class="text-note hint">已存在的同名標籤會直接沿用（不分大小寫、忽略前後空白）。</p>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：上傳燈箱的自訂標籤（一般作品燈箱、委託項目燈箱共用，features.md 第 0 節、3.2、3.3）
範例：
使用前先 import：import TagInput from '@/features/profile/components/TagInput.vue'
<TagInput v-model="tags" />
v-model：已加的標籤文字陣列（string[]），資料由燈箱持有，送出時直接送這個陣列（api.md 5.8）
加標籤兩種方式：輸入框打字按 Enter、點建議標籤；數量不限、可以不填
這裡只擋「同一次上傳重複加」；跟全站既有標籤的比對、沿用由後端做（api.md 5.8）
*/
import { computed, ref } from 'vue'
import FormInput from '@/shared/components/FormInput.vue'
import FilterChip from '@/shared/components/FilterChip.vue'
import HashtagLabel from '@/shared/components/HashtagLabel.vue'

const tags = defineModel<string[]>({ required: true })
// 輸入框裡正在打、還沒按 Enter 的字
const draft = ref('')
// 系統建議的常見風格標籤（features.md 第 0 節）
const SUGGESTED_TAGS = [
  '二次元',
  '寫實',
  '半寫實',
  'Q版',
  '厚塗',
  '賽璐璐',
  '日系',
  '韓系',
  '古風',
  '奇幻',
]

// 兩邊都轉小寫再比，英文不分大小寫（features.md 第 0 節）
function hasTag(name: string) {
  return tags.value.some((tag) => tag.toLowerCase() === name.toLowerCase())
}

// 【加刪標籤時自動重算】建議列只留還沒加的；用 hasTag 比，打了「q版」也會把「Q版」藏起來
const suggestions = computed(() => SUGGESTED_TAGS.filter((tag) => !hasTag(tag)))

// 【按 Enter、點建議標籤時都會呼叫】去空白 → 空的不加 → 重複不加 → 換成新陣列（理由同 ImageUploadGrid）
function addTag(name: string) {
  const newTag = name.trim()
  if (newTag === '') return // 只打空白就按 Enter
  if (hasTag(newTag)) return
  tags.value = [...tags.value, newTag]
}

// 【在輸入框按 Enter 時觸發】注音選字按的 Enter 也會觸發，isComposing 是 true 代表還在選字，不加
function onEnter(event: KeyboardEvent) {
  if (event.isComposing) return
  addTag(draft.value)
  draft.value = ''
}

// 【點已加標籤時觸發（FilterChip 的 click）】拿掉第 index 個；標籤只是文字，不用像圖片 revoke
function removeTag(index: number) {
  tags.value = tags.value.filter((_, i) => i !== index)
}
</script>

<style lang="scss" scoped>
// 輸入框、已加標籤、建議、說明上下排，間距 6（同 FormTextarea、ImageUploadGrid）
.tag-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

// 已加標籤、建議標籤：一行排不下就換行
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1); // 上下左右都 8
}

.hint {
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
