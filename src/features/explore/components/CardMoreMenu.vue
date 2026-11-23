<template>
  <div ref="menu" class="more-menu">
    <!-- 【流程②：點「⋯」】開／關選單；點外面自動關（useDropdown） -->
    <button type="button" class="more" aria-label="更多" :aria-expanded="isOpen" @click="toggle">
      <img :src="base + 'icons/more.svg'" alt="" />
    </button>
    <ul v-if="isOpen" class="panel">
      <li v-for="item in CARD_MORE_ITEMS" :key="item.key">
        <!-- 【流程③：點編輯／刪除】關選單＋通知卡片，見 onSelect -->
        <CardMoreMenuItem :icon="item.icon" :title="item.title" @click="onSelect(item.key)" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：個人頁卡片右下的「⋯」按鈕＋編輯／刪除選單（features.md 2.7），放在 ProfileWorkCard 裡
範例：
<CardMoreMenu @edit="..." @delete="..." />
點「⋯」開／關，點外面自動關；按鈕和選單包在同一個 div，useDropdown 才分得出「點外面」
選單外觀照 header 的 UploadMenu；選項是 CardMoreMenuItem
事件：
  edit    點「編輯貼文」（之後開上傳燈箱）
  delete  點「刪除貼文」（頁面開確認燈箱）
選單只負責通知，刪哪一張、開什麼燈箱由頁面決定（它不知道自己在哪張卡片上）
*/
import { CARD_MORE_ITEMS } from '@/features/explore/constants'
import { useDropdown } from '@/shared/composables/useDropdown'
import { useTemplateRef } from 'vue'
import CardMoreMenuItem from '@/features/explore/components/CardMoreMenuItem.vue'
const base = import.meta.env.BASE_URL
const menuEl = useTemplateRef<HTMLElement>('menu')
const { isOpen, toggle, close } = useDropdown(menuEl)
const emit = defineEmits<{ edit: []; delete: [] }>()

// 【流程③：點編輯／刪除時】先關選單，再通知卡片點了哪個（要打開什麼由頁面決定）
// 不能直接 emit(key)：defineEmits 把每個事件各算一種呼叫法，key 是「兩者之一」時 TS 不知道該對哪一種
function onSelect(key: 'edit' | 'delete') {
  close()
  if (key === 'edit') {
    emit('edit')
  } else {
    emit('delete')
  }
}
</script>

<style lang="scss" scoped>
// 拿掉 <ul> 預設的圓點和左邊空白
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

// 外框：讓選單以這裡為基準定位
.more-menu {
  position: relative;
}

// 「⋯」：點擊範圍 44px，圖示 18px（從 ProfileWorkCard 搬過來）
.more {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: transparent;
}

// 選單：浮在「⋯」正下方、對齊右邊（「⋯」在卡片右下角，往左長才不會超出畫面）
// 外觀照抄 UploadMenu 的面板
.panel {
  position: absolute;
  bottom: 80%;
  right: 0;
  z-index: 10;
  width: max-content;
  margin: 8px 0 0;
  padding: 12px 0;
  border-radius: 10px;
  background: var(--color-bg-subtle);
  box-shadow: var(--shadow-menu);
}
</style>
