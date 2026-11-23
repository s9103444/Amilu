<template>
  <Lightbox size="sm" @close="emit('close')">
    <div class="delete-dialog">
      <h2 class="text-h3 title">刪除貼文</h2>
      <hr class="divider" />
      <p class="text-body">確定要刪除「{{ title }}」嗎？</p>
      <div class="actions">
        <Button variant="outline" @click="emit('close')">取消</Button>
        <Button variant="danger" @click="emit('confirm')">確認刪除</Button>
      </div>
    </div>
  </Lightbox>
</template>

<script setup lang="ts">
/*
元件名稱：個人頁卡片的刪除確認燈箱（features.md 2.7），版型照刪除帳號燈箱的確認層（DeleteProfileLightbox）
範例：
使用前先 import：import DeleteConfirmLightbox from '@/features/explore/components/DeleteConfirmLightbox.vue'
<DeleteConfirmLightbox v-if="deletingCard" :title="deletingCard.title" @close="deletingCard = null" @confirm="..." />
只負責問「確定嗎」：真的刪除、刪完更新列表由頁面處理
事件：
  close    ✕、取消、點黑底、Esc
  confirm  按「確認刪除」
*/
import Lightbox from '@/shared/components/Lightbox.vue'
import Button from '@/shared/components/Button.vue'

defineProps<{
  title: string // 要刪的作品／項目標題，顯示在問句裡
}>()
const emit = defineEmits<{ close: []; confirm: [] }>()
</script>

<style lang="scss" scoped>
// 燈箱內容：每一塊上下間距 24，同 DeleteProfileLightbox；框的內距由 Lightbox size="sm" 給
.delete-dialog {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  color: var(--color-text-primary);
}

.title,
p {
  margin: 0;
}

// 標題列右邊留空給 Lightbox 的 ✕，長標題才不會壓到
.title {
  padding-right: var(--space-4);
}

// 作品標題可能很長又沒空格，允許任意位置換行
p {
  overflow-wrap: anywhere;
}

.divider {
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

// 兩顆按鈕平分寬度，中間 16（同 DeleteProfileLightbox）
.actions {
  display: flex;
  gap: var(--space-2);

  > * {
    flex: 1;
  }
}
</style>
