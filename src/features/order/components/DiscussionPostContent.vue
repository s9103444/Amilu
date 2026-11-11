<template>
  <div class="post">
    <!-- 發文者列：左邊頭像＋暱稱／@id，右邊上傳時間＋階段標籤 -->
    <div class="post-header">
      <div class="author">
        <img class="avatar" :src="userImgUrl || DEFAULT_AVATAR_URL" alt="" />
        <div class="names">
          <span class="nickname text-caption">{{ userName }}</span>
          <span class="user-id text-small">@{{ userId }}</span>
        </div>
      </div>
      <div class="meta">
        <span class="upload-time text-small">上傳時間：{{ uploadTimeStamp }}</span>
        <StageTag :stage_no="currentStage" />
      </div>
    </div>
    <div ref="emblaRef" class="photos grab-area">
      <div class="tracks">
        <button
          v-for="(url, index) in uploadImageUrl"
          :key="index"
          type="button"
          @click="emit('preview', index)"
        >
          <img :src="url" alt="" />
        </button>
      </div>
    </div>
    <!-- 操作列：四種樣子由頁面傳 action 決定，元件不判斷（Figma 617:582） -->
    <div v-if="action === 'confirm'" class="actions">
      <Button variant="secondary" width="hug" @click="emit('modRequest')">提出意見申請</Button>
      <Button width="hug" @click="emit('stageConfirm')">確認該階段審核 ›</Button>
    </div>
    <div v-else-if="action === 'confirmed'" class="actions">
      <Button width="hug" disabled>提出修改意見</Button>
      <Button width="hug" disabled>已確認該階段</Button>
    </div>
    <p v-else-if="action === 'awaiting-payment'" class="awaiting-payment text-button-md">
      付款完成後取得完稿
    </p>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：討論牆貼文（Figma 617:582）：發文者列＋稿件照片列＋操作列
action（由頁面判斷後傳入）：
  'confirm'          委託人看到還沒確認的階段：「提出意見申請」＋「確認該階段審核」
  'confirmed'        這個階段已確認：兩顆灰色、不能按的按鈕
  'awaiting-payment' 只付訂金、完稿還沒補款：灰字「付款完成後取得完稿」
  'none'             創作者視角、已結案：沒有操作列
點照片 emit preview（張數從 0 開始），預覽燈箱由頁面打開
*/
import Button from '@/shared/components/Button.vue'
import StageTag from '@/features/order/components/StageTag.vue'
import type { StageNo } from '@/features/order/types'
import emblaCarouselVue from 'embla-carousel-vue'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import { DEFAULT_AVATAR_URL } from '@/shared/constants'
defineProps<{
  userImgUrl: string
  userName: string
  userId: string
  uploadTimeStamp: string
  currentStage: StageNo
  uploadImageUrl: string[]
  action: 'confirm' | 'confirmed' | 'awaiting-payment' | 'none'
}>()
const emit = defineEmits<{
  modRequest: []
  stageConfirm: []
  preview: [index: number]
}>()
const [emblaRef] = emblaCarouselVue({ align: 'start' }, [WheelGesturesPlugin()])
</script>

<style lang="scss" scoped>
// 數值取自 Figma 617:582（討論牆貼文）
.post {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
}

//-----① 發文者列-----//
.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0; // 讓暱稱過長時能縮、顯示「…」，不把右邊的時間擠掉
}

// 頭像（圓角方形，全站統一 --radius-avatar；尺寸照 Figma 48px）
.avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-avatar);
  object-fit: cover;
}

// 暱稱和 @id 在 Figma 是同一組、中間沒有間距
.names {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.nickname,
.user-id {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nickname {
  color: var(--color-text-primary);
}

// Figma 的 @id 和上傳時間是 neutral/300，沒有對應的文字 token，先跟 OrderSidePanel、UserInfoBar 一樣用次要文字色
.user-id,
.upload-time {
  color: var(--color-text-secondary);
}

.meta {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 12px;
}

.upload-time {
  white-space: nowrap;
}

//-----② 稿件照片列（Embla：可拖拉，放開吸附左緣）-----//
.photos {
  overflow: hidden; // 游標、禁止選字由 .grab-area 給（main.scss）
  & .tracks {
    display: flex;
    gap: var(--space-1);
    & button {
      flex: 0 0 auto;
      border: none;
      padding: 0;
      background: transparent;
      cursor: inherit;
      & img {
        display: block;
        width: auto;
        height: 450px;
        border-radius: var(--radius-post-image);
        background: var(--color-bg-main); // 圖片還沒載入時的灰底（Figma 預覽框 base/200）
      }
    }
  }
}

//-----③ 操作列（靠右）-----//
.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

// 只是提示文字，不是按鈕（Figma 用 Button-md 字級、neutral/500）
.awaiting-payment {
  margin: 0;
  text-align: right;
  color: var(--color-text-secondary);
}
</style>
