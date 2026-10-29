<template>
  <button v-if="type === 'notify'" type="button" class="btn text-small">
    <!-- 未讀：紅點（Figma 匯出的圖示）；已讀：留一段空白，讓文字位置跟 Figma 一樣 -->
    <img v-if="unread" class="dot" :src="base + 'icons/notification-unread-dot.svg'" alt="未讀" />
    <span v-else class="dot-space"></span>
    <span class="content">
      <span class="text">{{ text }}</span>
      <span class="time">{{ timeText }}</span>
    </span>
  </button>
  <!-- 「對話」頁籤：spec 5.2 不做未讀標記，所以永遠沒有紅點，只留 Figma 上紅點位置的空白 -->
  <button v-else type="button" class="btn btn--chat text-small">
    <img class="avatar" :src="userPhoto" :alt="userName" />
    <span class="chat-body">
      <span class="text">{{ orderTitle }}</span>
      <span class="text chat-content">{{ chatContent }}</span>
    </span>
    <span class="time">{{ timeText }}</span>
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：通知中心的單筆項目（spec/features.md 5.2）
  type="notify"：「通知」頁籤的一筆通知（Figma 514:1617）
  type="chat"：「對話」頁籤的一個案件聊天室（Figma 821:14566）
範例：
使用前先 import：import NotificationMenuItem from '@/layouts/components/header/NotificationMenuItem.vue'
<NotificationMenuItem type="notify" unread text="乙方使用者暱稱 已上傳…" :past-timestamp="Date.now() - 10 * 60 * 1000" />
<NotificationMenuItem type="notify" text="系統已代為確認…" :past-timestamp="someTime" />  ---> 不加 unread 就是已讀（沒有紅點）
<NotificationMenuItem type="chat" :user-photo="avatarUrl" user-name="對方暱稱" order-title="頭像（肩膀以上）" chat-content="嗨嗨～您好…" :past-timestamp="someTime" />
past-timestamp 傳時間（毫秒），元件會換算成「10 分鐘前」「昨天」這類文字
chat-content 太長時，超出寬度的部分自動變成「…」
對話沒有未讀標記（spec 規定），所以 type="chat" 不用傳 unread
unread 沒傳時，Vue 會當成 false
*/
import { computed } from 'vue'

const props = defineProps<{
  type: 'notify' | 'chat'
  pastTimestamp: number // 兩種都要：通知建立時間／最新訊息時間
  // 只有 type="notify" 用
  unread?: boolean
  text?: string
  // 只有 type="chat" 用
  userPhoto?: string
  userName?: string // 對方暱稱，放在頭像的替代文字
  orderTitle?: string // 案件名稱（ORDER.item_title_snapshot），顯示在第一行
  chatContent?: string
}>()

// public/ 的圖示用 :src 綁定時要自己接 BASE_URL，部署到子路徑才不會 404
const base = import.meta.env.BASE_URL

const ONE_MINUTE = 60
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR
const ONE_MONTH = 30 * ONE_DAY

// 元件畫出來時，把「通知建立時間」換算成距離現在多久
const timeText = computed(() => {
  const diffInSeconds = Math.floor((Date.now() - props.pastTimestamp) / 1000)

  if (diffInSeconds < ONE_MINUTE) return '剛剛'
  if (diffInSeconds < ONE_HOUR) return `${Math.floor(diffInSeconds / ONE_MINUTE)} 分鐘前`
  if (diffInSeconds < ONE_DAY) return `${Math.floor(diffInSeconds / ONE_HOUR)} 小時前`
  if (diffInSeconds < 2 * ONE_DAY) return '昨天'
  if (diffInSeconds < ONE_MONTH) return `${Math.floor(diffInSeconds / ONE_DAY)} 天前`

  // 超過一個月直接顯示完整日期
  const date = new Date(props.pastTimestamp)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
})
</script>

<style lang="scss" scoped>
.btn {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  text-align: left;
  background-color: var(--color-bg-subtle);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

// 未讀紅點：圖示本身 10×16，圓點在下半部，剛好對齊第一行文字
.dot {
  flex-shrink: 0;
  width: 10px;
  height: 16px;
}

// 已讀時的佔位：Figma 已讀標記是 6×10 的空白
.dot-space {
  flex-shrink: 0;
  width: 6px;
  height: 10px;
}

// 訊息＋時間，上下排
.content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  word-break: break-word;
}

.text {
  color: var(--color-text-primary);
}

.time {
  color: var(--color-text-secondary);
  white-space: nowrap;
}

// ── 對話頁籤（Figma 821:14566）────────────────
// 頭像、文字、時間三塊垂直置中
.btn--chat {
  align-items: center;
}

// Figma 在對話列也留了 10px 寬的紅點位置（不顯示），文字才會跟通知列對齊
.chat-space {
  flex-shrink: 0;
  width: 10px;
}

.avatar {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover; // 上傳的頭像不是正方形時裁切，不變形
}

// 暱稱＋最新訊息，上下排；min-width: 0 讓它可以被壓窄，下面的省略號才會出現
.chat-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

// 訊息太長時單行顯示，超出寬度的部分用「…」取代
.chat-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// 只在有滑鼠的裝置套用，避免手機點完後一直停在 hover 色
@media (hover: hover) {
  .btn:hover {
    background-color: var(--color-bg-option-hover);
  }
}
</style>
