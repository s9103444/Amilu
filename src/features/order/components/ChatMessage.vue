<template>
  <div class="message text-small" :class="{ 'message--mine': sender === 'mine' }">
    <div class="layout">
      <img v-if="sender === 'other'" class="avatar" :src="avatarUrl" alt="" />
      <span v-if="text" class="text" :class="{ 'message-text--mine': sender === 'mine' }">{{
        text
      }}</span>
      <img v-if="imageUrl" class="image" :src="imageUrl" alt="訊息圖片" />
    </div>
    <span class="time-stamp">{{ timeText }}</span>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：聊天室的一則訊息（spec/features.md 4.7，Figma 600:165）
範例：
使用前先 import：import ChatMessage from '@/features/order/components/ChatMessage.vue'
<ChatMessage sender="other" :avatar-url="partnerAvatar" text="你好！草稿預計…" created-at="2026-10-29T14:02:00+08:00" />
<ChatMessage sender="other" :avatar-url="partnerAvatar" :image-url="message.image_url" :created-at="message.created_at" />
<ChatMessage sender="mine" text="好的，我補一張服裝參考" :created-at="message.created_at" />  ---> 自己的訊息靠右、不顯示頭像
sender 由外面（聊天室視窗）判斷：MESSAGE.sender_id 等於目前登入者就傳 'mine'，否則傳 'other'
有傳 text 就顯示文字氣泡，有傳 image-url 就顯示圖片；兩個都傳時文字在前、圖片在後
created-at 傳 MESSAGE.created_at（ISO 字串），元件只顯示「時:分」（例如 09:05）；日期分隔線由聊天室視窗負責
圖片最大 140×100，等比例縮小、不裁切
*/
import { computed } from 'vue'

const props = defineProps<{
  sender: 'other' | 'mine'
  text?: string
  imageUrl?: string
  avatarUrl?: string
  createdAt: string
}>()

const timeText = computed(() => {
  const date = new Date(props.createdAt)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
})
</script>

<style lang="scss" scoped>
// 一則訊息佔滿一整列；時間貼齊內容底部（Figma items-end）
// 列與列的間距、聊天視窗的內距交給外層聊天視窗決定，這裡不加
.message {
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  gap: 8px;
}
// 頭像＋內容：頭像也要貼齊底部，對齊最後一行文字
.layout {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.avatar {
  flex-shrink: 0; // 文字很長時頭像不被擠扁
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
// 對方的文字氣泡：左下角是小圓角，指向左邊的頭像
.text {
  display: flex;
  padding: 10px 14px;
  flex-direction: column;
  align-items: flex-start;
  max-width: 248px; // Figma 文字寬 220 + 左右內距 28；短訊息會跟著縮
  background-color: var(--color-chat-bubble-other);
  border-radius: var(--radius-chat-bubble);
  border-bottom-left-radius: var(--radius-chat-bubble-tail);
  white-space: pre-wrap; // 保留使用者打的換行
  overflow-wrap: anywhere; // 很長的網址也會折行，不撐破氣泡
}
.image {
  max-width: 140px;
  max-height: 100px;
  border-radius: var(--radius-chat-image);
}
// 自己的訊息：整列反過來排，變成「時間 → 內容」並靠右
.message--mine {
  flex-direction: row-reverse;
}
// 自己的文字氣泡：右下角是小圓角
.message-text--mine {
  background-color: var(--color-chat-bubble-mine);
  border-radius: var(--radius-chat-bubble);
  border-bottom-right-radius: var(--radius-chat-bubble-tail);
}
.time-stamp {
  flex-shrink: 0;
  color: var(--color-chat-time);
  white-space: nowrap;
}
</style>
