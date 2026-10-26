<template>
  <div class="work-info">
    <p class="text-body title">{{ title }}</p>
    <p class="text-caption description">{{ description }}</p>
    <div v-if="tags?.length" class="tags">
      <HashtagLabel v-for="tag in tags" :key="tag" variant="post">#{{ tag }}</HashtagLabel>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：作品內容（Figma 522:1214，作品燈箱右側的標題、說明與標籤）
範例：
使用前先 import：import WorkInfo from '@/features/explore/components/WorkInfo.vue'
<WorkInfo title="作品標題" description="作品說明文字" :tags="['厚塗', '半厚塗']" />
標籤傳名稱就好（TAG.name，不含 #），畫面上會自動加「#」；沒有標籤時整列不顯示。
標籤用 shared 的 HashtagLabel（variant="post"，只顯示、不能點）。
*/
import HashtagLabel from '@/shared/components/HashtagLabel.vue'

defineProps<{
  title: string
  description: string
  tags?: string[]
}>()
</script>

<style lang="scss" scoped>
.work-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  word-break: break-word;
}

.title,
.description {
  margin: 0;
  color: var(--color-text-primary);
}

// 標籤太多時換行：列距 8、欄距 12（Figma）
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
}
</style>
