<template>
  <div class="discussion-title-bar">
    <div class="title-row">
      <span class="text-title main-title">委託討論牆</span>
      <span class="note text-small" v-if="!isClosed"
        ><img class="note-icon" :src="base + 'icons/info.svg'" alt="" />
        {{
          role === 'creator'
            ? '請善用右下角聊天室討論；需要交稿時，點選右側「上傳作品」。'
            : '請善用右下角聊天室討論；確認進度時，點選貼文下方「確認該階段審核」。'
        }}
      </span>
      <Button
        class="upload-button"
        aria-label="上傳作品"
        v-if="role === 'creator' && !isClosed"
        width="hug"
        @click="emit('upload')"
        size="sm"
        >＋ <span class="upload-label">上傳作品</span></Button
      >
    </div>
    <hr class="divider" />
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：委託討論牆標題列（Figma 616:544），放在委託討論牆右欄最上面，下方有分隔線
四種樣子由 role 和 isClosed 推出來，不另外傳狀態：
- 委託人：標題＋提醒（確認進度時點貼文下方「確認該階段審核」）
- 創作者：標題＋提醒（需要交稿時點「上傳作品」）＋「＋ 上傳作品」按鈕
- 已結案（已完成、已終止）：只有標題，拿掉提醒和按鈕（終態案件操作鎖死）
RWD（手機優先）：1024px 以下按鈕只剩「＋」、提醒掉到第二排；1024px 以上回到同一排、按鈕顯示文字
（Figma 的「CreatorTablet」）。按鈕只有一顆，只是用 CSS 藏文字，所以加 aria-label 讓報讀軟體念得到
按「上傳作品」只 emit upload，打開上傳燈箱由頁面處理
範例：
使用前先 import：import DiscussionTitleBar from '@/features/order/components/DiscussionTitleBar.vue'
<DiscussionTitleBar role="creator" :is-closed="false" @upload="openUploadLightbox" />
*/
import Button from '@/shared/components/Button.vue'
const base = import.meta.env.BASE_URL
defineProps<{
  role: 'creator' | 'commissioner' // 目前看畫面的那一方
  isClosed: boolean // 已完成或已終止
}>()
const emit = defineEmits<{
  upload: []
}>()
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;
.discussion-title-bar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.main-title {
  color: var(--color-text-primary);
  flex-shrink: 0;
  white-space: nowrap;
}
// 窄螢幕：order 把提醒排到最後、flex-basis 100% 佔滿一排，自己換到第二排
.note {
  order: 1;
  flex-basis: 100%;
  background-color: var(--color-bg-subtle);
  display: flex;
  padding: 14px 20px;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  color: var(--color-text-primary);
}
.note-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
// margin-left: auto 把按鈕推到第一排最右邊
.upload-button {
  margin-left: auto;
  flex-shrink: 0;
}
// 窄螢幕只剩「＋」
.upload-label {
  display: none;
}
.divider {
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

// 桌機：回到同一排，提醒撐滿中間剩下的寬度，按鈕顯示文字
@include bp.desktop-up {
  .title-row {
    flex-wrap: nowrap;
  }
  .note {
    order: 0;
    flex: 1;
  }
  .upload-label {
    display: inline;
  }
}
</style>
