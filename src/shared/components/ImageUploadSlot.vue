<template>
  <button v-if="status === 'add'" type="button" class="text-small upload-slot upload-slot--add">
    <img src="/icons/plus.svg" alt="" />
    {{ addLabel }}
  </button>
  <div v-else class="upload-slot">
    <img v-if="src" class="upload-slot__image" :src="src" alt="" />
    <!-- 左上角標記，不需要時 show-badge 傳 false -->
    <span v-if="status === 'uploaded-cover' && showBadge" class="text-small upload-slot__badge">
      {{ badge }}
    </span>
    <!-- 點擊範圍 44px，圓鈕只有 17px -->
    <button type="button" class="upload-slot__remove" aria-label="移除圖片" @click="emit('remove')">
      <span class="upload-slot__remove-dot">
        <img src="/icons/x-white.svg" alt="" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：圖片上傳格（上傳燈箱用）
範例：
使用前先 import：import ImageUploadSlot from '@/shared/components/ImageUploadSlot.vue'
<ImageUploadSlot status="uploaded-cover" src="圖片網址" @remove="移除這張" /> ---> 已上傳，左上有「封面」標記
<ImageUploadSlot status="uploaded-cover" badge="1" /> ---> 標記改成序號
<ImageUploadSlot status="uploaded-cover" :show-badge="false" /> ---> 不顯示標記
<ImageUploadSlot status="uploaded" src="圖片網址" /> ---> 已上傳，沒有標記
<ImageUploadSlot status="add" @click="開啟選檔" /> ---> 新增圖片（虛線框）
只負責外觀，選檔與檢查由外面處理
*/
withDefaults(
  defineProps<{
    status?: 'uploaded-cover' | 'uploaded' | 'add'
    src?: string
    badge?: string
    showBadge?: boolean
    addLabel?: string
  }>(),
  {
    status: 'uploaded-cover',
    badge: '封面',
    showBadge: true,
    addLabel: '新增圖片',
  },
)

const emit = defineEmits<{
  remove: []
}>()
</script>

<style lang="scss" scoped>
.upload-slot {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  background: var(--color-bg-main);
  overflow: hidden;
}

.upload-slot__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-slot__badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--color-overlay);
  color: var(--color-text-on-dark);
  white-space: nowrap;
}

.upload-slot__remove {
  position: absolute;
  top: 0;
  left: 76px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.upload-slot__remove-dot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 17px;
  height: 17px;
  border-radius: 999px;
  background: var(--color-overlay);
  transition: background 0.3s ease;
}

// 用鍵盤移到移除鈕時，外框畫在 17px 圓點外圍，滑鼠點擊不顯示（同 OptionButton）
.upload-slot__remove:focus-visible {
  outline: none;
}
.upload-slot__remove:focus-visible .upload-slot__remove-dot {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

//-----新增圖片（虛線框）-----//
.upload-slot--add {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border: 1.5px dashed var(--color-border);
  background: var(--color-bg-page);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.3s ease;
}

.upload-slot--add:focus-visible {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

// Figma 沒畫 hover，前端自訂：
// 新增格白底變淺灰；移除鈕滑過整個 44px 點擊範圍時，半透明圓變實心深色
@media (hover: hover) {
  .upload-slot--add:hover {
    background: var(--color-bg-subtle);
  }
  .upload-slot__remove:hover .upload-slot__remove-dot {
    background: var(--color-bg-inverse);
  }
}
</style>
