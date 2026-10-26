<template>
  <button v-if="variant === 'button'" type="button" class="text-button-sm hashtag hashtag--button">
    <slot></slot>
  </button>
  <span v-else class="text-caption hashtag"><slot></slot></span>
</template>

<script setup lang="ts">
/*
元件名稱：自訂標籤（hashtag）
範例：
使用前先 import：import HashtagLabel from '@/shared/components/HashtagLabel.vue'
<HashtagLabel @click="套用這個標籤">#厚塗</HashtagLabel> ---> 篩選列右側可點的建議標籤
<HashtagLabel variant="post">#厚塗</HashtagLabel> ---> 貼文裡只顯示、不能點
*/
withDefaults(
  defineProps<{
    variant?: 'button' | 'post'
  }>(),
  {
    variant: 'button',
  },
)
</script>

<style lang="scss" scoped>
.hashtag {
  color: var(--color-text-secondary);
  white-space: nowrap;
}

//-----可點的款式-----//
.hashtag--button {
  cursor: pointer;
  padding: 0;
  border: none;
  background: none;
  transition: color 0.2s ease;
}
@media (hover: hover) {
  .hashtag--button:hover {
    color: var(--color-text-primary);
  }
}
</style>
