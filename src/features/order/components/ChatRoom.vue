<template>
  <div class="room-container">
    <div class="room-header">
      <img class="other-user-photo" :src="avatarUrl" alt="" />
      <div class="layout-text-with-cross">
        <div class="layout-text">
          <span class="text-caption other-name">{{ otherName }}</span>
          <span class="text-small project-name">{{ projectName }}</span>
        </div>
        <button type="button" class="cross" aria-label="關閉聊天室" @click="emit('close')">
          <img :src="base + 'icons/cross-black.svg'" alt="" />
        </button>
      </div>
    </div>
    <!-- 訊息列表：訊息多的時候只有這一塊捲動，標題列和輸入列固定不動 -->
    <!-- 【流程③：任何一張圖片載完時觸發】圖片載完列表會變高，再捲一次到底 -->
    <div ref="list" class="chat-content" @load.capture="scrollToBottom">
      <template v-for="(message, index) in messages" :key="message.message_id">
        <span v-if="showDate(index)" class="date-divider text-small">{{
          formatDate(message.created_at)
        }}</span>
        <ChatMessage
          :sender="message.sender_id === currentUserId ? 'mine' : 'other'"
          :avatar-url="avatarUrl"
          :text="message.content"
          :image-url="message.image_url ?? undefined"
          :created-at="message.created_at"
        />
      </template>
    </div>
    <!-- 輸入列（Figma 592:281）：上傳圖片鈕、文字框、送出鈕；選檔和送出的動作之後再接 -->
    <form class="type-area" @submit.prevent="onSubmit">
      <!-- 原生選檔框藏起來，按圖片鈕時用程式代按它 -->
      <input
        ref="file"
        type="file"
        accept="image/jpeg, image/png, image/webp"
        hidden
        @change="onPickImage"
      />
      <button type="button" class="icon-button" aria-label="上傳圖片" @click="fileInput?.click()">
        <img :src="base + 'icons/image.svg'" alt="" />
      </button>
      <input
        type="text"
        class="type-text-area text-small"
        v-model="draft"
        placeholder="輸入訊息…"
      />
      <!-- type="submit"：點這顆和在輸入框按 Enter 都會觸發 form 的 submit -->
      <button type="submit" class="send-button" aria-label="送出" :disabled="draft.trim() === ''">
        <img :src="base + 'icons/send.svg'" alt="" />
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef, watch, ref } from 'vue'
import type { Message } from '@/features/order/types'
import ChatMessage from '@/features/order/components/ChatMessage.vue'
import { MOCK_MESSAGES } from '@/mocks/order'
const base = import.meta.env.BASE_URL
const listEl = useTemplateRef<HTMLElement>('list')
const fileInput = useTemplateRef<HTMLInputElement>('file')
const draft = ref('')
const props = defineProps<{
  avatarUrl: string // 對方頭像
  otherName: string
  projectName: string
  messages: Message[] // 整串訊息，由舊到新
  currentUserId: string // 我是誰
  readonly?: boolean
}>()

function formatDate(isoString: string) {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year} / ${month} / ${day}`
}
function showDate(index: number) {
  if (index === 0) return true
  const current = props.messages[index]!
  const previous = props.messages[index - 1]!
  return formatDate(current.created_at) !== formatDate(previous.created_at)
}
function scrollToBottom() {
  const el = listEl.value
  if (!el) return // 元素還沒畫出來時是 null
  el.scrollTop = el.scrollHeight
}
// 【流程①：視窗打開、訊息畫完時觸發】
onMounted(scrollToBottom)
// 【流程②：訊息數量變多時觸發】先等 Vue 把新訊息畫出來，再捲
watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    scrollToBottom()
  },
)
const emit = defineEmits<{
  send: [text: string]
  'send-image': [file: File]
  close: []
}>()

// 【流程④：按送出鈕或 Enter 時觸發】
function onSubmit() {
  const trimmed = draft.value.trim()
  if (trimmed === '') {
    return
  }
  emit('send', trimmed)
  draft.value = ''
}
// 【流程⑤：選好圖片時觸發】一則最多 1 張，所以只取第一個檔案
function onPickImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return // 使用者打開選檔視窗後按了取消
  emit('send-image', file)
  input.value = '' // 清掉，下次選同一張圖才會再觸發 change
}
</script>

<style lang="scss" scoped>
// 視窗高度固定（Figma 673px），裡面的訊息列表才有範圍可以捲動
// overflow: hidden：訊息列表的灰底才不會蓋出圓角外面
.room-container {
  display: flex;
  flex-direction: column;
  height: 673px;
  overflow: hidden;
  border-radius: var(--radius-chat-window);
  border: 1px solid var(--color-border);
  background: var(--color-bg-page);
  box-shadow: var(--shadow-chat-window);
}
// 標題列（Figma 592:250）：頭像和文字垂直置中，下面一條分隔線
.room-header {
  display: flex;
  flex-shrink: 0; // 訊息很多時不被壓扁
  align-items: center;
  padding: 14px 12px 14px 20px;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
}
.other-user-photo {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
// 文字＋關閉鈕：關閉鈕靠右上角（Figma 距標題列上緣、右緣各 17px）
.layout-text-with-cross {
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  min-width: 0; // 讓名字太長時可以被壓窄，才會出現「…」
  padding-right: 5px; // 標題列右邊 12px ＋ 5px ＝ Figma 的 17px
}
.layout-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
// 暱稱和案件名稱都只顯示一行，太長用「…」截斷
.other-name,
.project-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.other-name {
  color: var(--color-text-primary);
}
.project-name {
  color: var(--color-text-secondary);
}
.cross {
  display: flex;
  flex-shrink: 0;
  margin-top: 3px; // 文字區從上緣 14px 開始，再往下 3px ＝ Figma 的 17px
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}
.cross img {
  width: 12px;
  height: 12px;
}
// 訊息列表（Figma 592:258）：佔滿標題列和輸入列中間剩下的高度，超出就在裡面捲動
// min-height: 0 是必要的：flex 子元素預設不會比內容矮，不加的話會撐開視窗、不會捲動
.chat-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow-y: auto;
  background-color: var(--color-bg-subtle);
  padding: 16px 20px 20px 20px;
}
// 日期分隔線（Figma 592:259）：置中、和訊息時間一樣淡；上下間距由列表的 gap 16px 負責
.date-divider {
  flex-shrink: 0;
  color: var(--color-chat-time);
  text-align: center;
}
// 輸入列：左邊留 8px，因為圖片鈕本身有 44px 點擊範圍，icon 看起來已經離邊框有距離
.type-area {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 12px 16px 12px 8px;
  border-top: 1px solid var(--color-border);
}
// 上傳圖片鈕：icon 24px，點擊範圍放大到 44px，手指比較好按
.icon-button {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}
.type-text-area {
  border: none;
  display: flex;
  padding: 10px 16px;
  width: 100%;
  min-width: 0; // input 預設有最小寬度，不加的話會把送出鈕擠出去
  align-items: center;
  flex: 1 0 0;
  border-radius: 999px;
  background: var(--color-bg-subtle);
  color: var(--color-text-primary);
  font-family: inherit; // input 預設不繼承字體
}
.type-text-area::placeholder {
  color: var(--color-placeholder);
}
// 送出鈕：44px 圓形，漸層沿用主按鈕（Figma 角度 -70.6° 和 --gradient-button-primary 的 289° 是同一個方向）
.send-button {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--gradient-button-primary);
  cursor: pointer;
}
.send-button img {
  width: 20px;
  height: 20px;
}
</style>
