<template>
  <div ref="menu" class="notification-menu">
    <!-- 鈴鐺：圖示固定用沒有紅點的版本（滑過去換 hover 色），紅點另外用 ::after 疊上去 -->
    <button
      type="button"
      class="bell"
      :class="{ 'bell--unread': unreadCount > 0 }"
      aria-label="通知中心"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
      @mouseenter="isBellHover = true"
      @mouseleave="isBellHover = false"
    >
      <img :src="bellIcon" alt="" />
    </button>

    <div v-if="isOpen" class="panel">
      <!-- 頁籤列：點哪個頁籤就切到哪個；「全部標為已讀」只在通知頁籤、而且有未讀時出現 -->
      <div class="tabs">
        <NotificationItem
          button-type="notify"
          :active="tab === 'notify'"
          :notice-number="unreadCount"
          @click="tab = 'notify'"
        />
        <NotificationItem button-type="chat" :active="tab === 'chat'" @click="tab = 'chat'" />
        <button
          v-if="tab === 'notify' && unreadCount > 0"
          type="button"
          class="mark-all text-small"
          @click="markAllRead"
        >
          全部標為已讀
        </button>
      </div>

      <!-- 「通知」頁籤 -->
      <ul v-if="tab === 'notify'" class="list">
        <li v-for="item in notifications" :key="item.notification_id">
          <NotificationMenuItem
            type="notify"
            :unread="!item.is_read"
            :text="item.content"
            :past-timestamp="Date.parse(item.created_at)"
          />
        </li>
        <li v-if="notifications.length === 0" class="empty text-small">目前沒有通知</li>
      </ul>

      <!-- 「對話」頁籤：每個案件一列，顯示最新一則訊息 -->
      <ul v-else class="list">
        <li v-for="chat in chats" :key="chat.order_id">
          <NotificationMenuItem
            type="chat"
            :user-photo="chat.partner.avatar_url ?? defaultAvatar"
            :user-name="chat.partner.nickname"
            :order-title="chat.item_title_snapshot"
            :chat-content="chat.message.content || '[圖片]'"
            :past-timestamp="Date.parse(chat.message.created_at)"
          />
        </li>
        <li v-if="chats.length === 0" class="empty text-small">目前沒有對話</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：header 的通知中心（鈴鐺＋展開視窗，spec/features.md 5.2）
範例：
使用前先 import：import NotificationMenu from '@/layouts/components/header/NotificationMenu.vue'
<NotificationMenu />
組成：
  鈴鐺按鈕 → 點了打開／關閉視窗，點視窗外面也會關閉
  頁籤列 → NotificationItem ×2（通知／聊天），通知頁籤旁顯示未讀數
  列表 → NotificationMenuItem，type 跟著目前的頁籤切換
資料目前讀 src/mocks/notification.ts，後端好了改成從 API／store 拿
*/
import { computed, ref, useTemplateRef } from 'vue'
import NotificationItem from '@/layouts/components/header/NotificationItem.vue'
import NotificationMenuItem from '@/layouts/components/header/NotificationMenuItem.vue'
import { useClickOutside } from '@/shared/composables/useClickOutside'
import { MOCK_CHAT_PREVIEWS, MOCK_NOTIFICATIONS } from '@/mocks/notification'

const base = import.meta.env.BASE_URL
const defaultAvatar = base + 'picture/default-user-pic.png'

const menuEl = useTemplateRef<HTMLElement>('menu')
const isOpen = ref(false)
const isBellHover = ref(false)
const tab = ref<'notify' | 'chat'>('notify')

// 複製一份 mock，「全部標為已讀」改的是這份，不會動到 mock 原本的資料
const notifications = ref(MOCK_NOTIFICATIONS.map((item) => ({ ...item })))
const chats = MOCK_CHAT_PREVIEWS

// 未讀數不另外存，每次從通知列表算（spec「衍生值不存」）
const unreadCount = computed(() => notifications.value.filter((item) => !item.is_read).length)

// 鈴鐺圖示：只在 default／hover 兩張之間換（兩張都是 20×25，切換時不會位移）
// 有紅點的那兩張圖（26×30）不用了，紅點改由 CSS 的 .bell--unread::after 畫，按「全部標為已讀」時鈴鐺才不會跳動
const bellIcon = computed(() => {
  const status = isBellHover.value ? 'hover' : 'default'
  return `${base}icons/notification-${status}.svg`
})

// 【點視窗外面時觸發】關閉視窗，下次打開回到「通知」頁籤
useClickOutside(menuEl, () => {
  isOpen.value = false
  tab.value = 'notify'
})

// 【按「全部標為已讀」時觸發】所有通知改成已讀，紅點和頁籤數字會跟著消失
function markAllRead() {
  notifications.value.forEach((item) => {
    item.is_read = true
  })
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

// 外框：讓視窗以這裡為基準定位
.notification-menu {
  position: relative;
  width: fit-content;
}

.bell {
  position: relative; // 讓紅點以鈴鐺為基準定位
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

// 有未讀通知時，鈴鐺右上角的紅點（直徑 6px）
// 位置照 Figma 有紅點的鈴鐺圖換算：那張圖的鈴鐺往下移了 4.5px、紅點圓心在 (23, 3)，
// 換到 20×25 的鈴鐺上，紅點左上角就是 left 20px、top -4.5px
// 用 absolute 疊在上面，不佔版面，所以出現或消失時鈴鐺本身不會動
.bell--unread::after {
  content: '';
  position: absolute;
  top: -4.5px;
  left: 20px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-button-secondary); // 跟頁籤的未讀數同色（accent/orange）
}

// 視窗：浮在鈴鐺正下方、對齊右邊（鈴鐺在 header 右側，往左長才不會超出畫面）
// 寬度 340px 跟 Figma 單筆通知一樣（514:1617）；圓角、陰影、和鈴鐺的距離沿用個人選單（UserMenu），
// Figma 沒有畫組合好的通知視窗，這幾個值是暫定
.panel {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  width: 340px;
  margin-top: 8px;
  padding: 12px 0 0;
  overflow: hidden;
  border-radius: 10px;
  background: var(--color-bg-subtle);
  box-shadow: var(--shadow-menu);
}

// 頁籤列：左右留 14px 跟列表文字對齊；底線要露出來，所以下方留 5px（頁籤底線 bottom: -5px）
.tabs {
  display: flex;
  align-items: center;
  padding: 0 14px 5px;
}

// 「全部標為已讀」推到最右邊（暫定樣式，Figma 沒畫）
.mark-all {
  margin-left: auto;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
}

// 列表：太多筆時視窗內捲動，不把整個視窗拉長（最大高度暫定）
.list {
  max-height: 400px;
  overflow-y: auto;
}

.empty {
  padding: 24px 14px;
  color: var(--color-text-secondary);
  text-align: center;
}

@media (hover: hover) {
  .mark-all:hover {
    color: var(--color-text-primary);
  }
}
</style>
