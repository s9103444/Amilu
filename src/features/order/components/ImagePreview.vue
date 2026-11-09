<template>
  <div class="image-preview">
    <button class="close-btn" type="button" aria-label="關閉" @click="emit('close')">
      <img :src="base + 'icons/close-lightbox.svg'" alt="" />
    </button>
    <div class="preview-body">
      <ImageCarousel :images="images" :start-index="startIndex" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageCarousel from '@/features/order/components/ImageCarousel.vue'
const base = import.meta.env.BASE_URL
defineProps<{
  images: string[]
  startIndex: number
}>()
const emit = defineEmits<{
  close: []
}>()
</script>

<style lang="scss" scoped>
.image-preview {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.preview-body {
  width: min(90vw, 1200px);
}
.close-btn {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-bg-page);
}
</style>
