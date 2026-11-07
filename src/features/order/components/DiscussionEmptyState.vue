<template>
  <div class="discussion-empty-state">
    <img
      class="empty-icon"
      :src="base + (role === 'creator' ? 'icons/image.svg' : 'icons/calendar.svg')"
      alt=""
    />
    <p class="text-body empty-title">
      {{ role === 'creator' ? `還沒有上傳${firstStage}` : `創作者還沒上傳${firstStage}` }}
    </p>
    <p class="text-small empty-description">
      {{
        role === 'creator'
          ? `完成${firstStage}後，請點選右上角「上傳作品」上傳稿件。上傳後委託人會收到通知並進行確認。`
          : `創作者正在進行${firstStage}。作品上傳後會顯示在這裡，並通知你前來確認。`
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：討論牆空狀態（Figma 616:564），討論牆還沒有任何貼文（創作者一張圖都還沒上傳）時，放在標題列下方
兩種樣子由 role 決定：
- 'commissioner'：月曆圖示，告訴委託人創作者正在畫、上傳後會通知
- 'creator'：圖片圖示，提醒創作者畫完後按右上角「上傳作品」
要不要顯示由頁面判斷（貼文數為 0 才放這個元件），這裡不判斷
範例：
使用前先 import：import DiscussionEmptyState from '@/features/order/components/DiscussionEmptyState.vue'
<DiscussionEmptyState role="commissioner" />
*/
import { STAGE_LABEL } from '@/features/order/stageLabel'

const base = import.meta.env.BASE_URL

defineProps<{
  role: 'creator' | 'commissioner' // 目前看畫面的那一方
}>()

// 還沒有貼文＝還在第一個階段。三點、五點分段的第一段都是 stage_no 1，所以固定用 1
// Figma 寫「第一階段」，依專案規則改用 STAGE_LABEL（「草稿」）
const firstStage = STAGE_LABEL[1]
</script>

<style lang="scss" scoped>
// 內容置中、上下內距 48、左右 24、圓角 16，各塊間距 8；沒有底色和外框（Figma 616:545）。寬度由外面決定
.discussion-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 48px 24px;
  border-radius: 16px;
  text-align: center;
}

// 圖示 56px（沿用 24px 的同款 icon 放大，向量圖不會糊）
// Figma 在圖示和標題之間多一塊 4px 的間距，加上 gap 8 共 12
.empty-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 4px;
}

.empty-title,
.empty-description {
  margin: 0;
}

// .text-body 是 regular，Figma 的標題是 medium
.empty-title {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.empty-description {
  color: var(--color-text-secondary);
}
</style>
