<template>
  <div class="fields">
    <FormSelect
      v-model="category"
      requirement="optional"
      :options="CATEGORY_OPTIONS"
      placeholder="請選擇（限一個）"
      >作品類型</FormSelect
    >
    <FormSelect
      v-model="purpose"
      requirement="optional"
      :options="PURPOSE_OPTIONS"
      placeholder="請選擇（限一個）"
      >作品用途</FormSelect
    >
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：上傳燈箱的類型＋用途下拉（一般作品燈箱、委託項目燈箱共用，features.md 第 0 節、3.2、3.3）
範例：
使用前先 import：import ClassificationFields from '@/features/profile/components/ClassificationFields.vue'
<ClassificationFields v-model:category="category" v-model:purpose="purpose" />
v-model:category：選到的作品類型 id（category_id），沒選是 ''
v-model:purpose：選到的作品用途 id（purpose_id），沒選是 ''
兩軸都可以不選、每軸最多一個（features.md 第 0 節），所以用單選下拉
*/
import FormSelect from '@/shared/components/FormSelect.vue'
import { CATEGORY_OPTIONS, PURPOSE_OPTIONS } from '@/mocks/classification'

// 一個元件接兩個 v-model：用名字區分，外面寫 v-model:category、v-model:purpose 對上第一個參數
const category = defineModel<string>('category', { required: true })
const purpose = defineModel<string>('purpose', { required: true })
</script>

<style lang="scss" scoped>
// 類型、用途並排平分，中間 16
// minmax(0, 1fr)：最小可以縮到 0，選項文字很長時不會把欄位撐寬（同個人專頁卡片牆）
.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
}
</style>
