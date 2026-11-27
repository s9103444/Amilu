<template>
  <div ref="menu" class="upload-menu">
    <!-- 【流程①：點上傳圖示】開／關選單 -->
    <button type="button" class="upload" aria-label="上傳" :aria-expanded="isOpen" @click="toggle">
      <img src="/icons/upload-default.svg" alt="" class="upload-default" />
      <img src="/icons/upload-hover.svg" alt="" class="upload-hover" />
    </button>
    <ul v-if="isOpen" class="panel">
      <li v-for="item in UPLOAD_ITEMS" :key="item.key">
        <!-- 【流程②：點項目】關選單＋通知 AppHeader 打開對應的上傳燈箱 -->
        <UserSubMenuItem :icon="item.icon" :title="item.title" @click="onPick(item.key)" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：header 的上傳按鈕＋上傳選單（Figma 573:3489）
範例：
使用前先 import：import UploadMenu from '@/layouts/components/header/UploadMenu.vue'
<UploadMenu @pick="uploadKey = $event" />
點圖示開／關選單，點外面自動關閉；選項和頭像選單的「上傳作品」子選單共用 UPLOAD_ITEMS。
事件：
  pick  點了哪個選項，帶 UPLOAD_ITEMS 的 key（upload-post／upload-commission-item）；燈箱由 AppHeader 打開
*/
import { useTemplateRef } from 'vue'
import UserSubMenuItem from '@/layouts/components/header/UserSubMenuItem.vue'
import { UPLOAD_ITEMS } from '@/layouts/components/header/userMenuItems'
import { useDropdown } from '@/shared/composables/useDropdown'

// 最外層 div：點到它以外的地方才算「點外面」，所以按鈕和選單要包在同一個 div 裡
const menuEl = useTemplateRef<HTMLElement>('menu')
// 選單開關＋點外面自動關閉
const { isOpen, toggle, close } = useDropdown(menuEl)
const emit = defineEmits<{
  pick: [key: string] // 點了哪個上傳選項
}>()

// 【流程②：點選單項目時觸發】先關選單，再把 key 交給 AppHeader（燈箱放那裡，兩個入口共用）
function onPick(key: string) {
  close()
  emit('pick', key)
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
.upload-menu {
  position: relative;
  margin-inline: 4px;
}

// 上傳圖示：兩張圖疊在一起，滑過去換 hover 那張
.upload {
  display: grid;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  & img {
    grid-area: 1 / 1;
    width: 20px;
    display: block;
  }

  & .upload-hover {
    opacity: 0;
  }

  &:hover .upload-hover {
    opacity: 1;
  }

  &:hover .upload-default {
    opacity: 0;
  }
}

// 選單：浮在圖示正下方、對齊右邊（往左長才不會超出畫面）
// 外觀照抄 UserMenu 的面板；寬度跟著內容（只有兩個短項目），和圖示的距離 8px 同 UserMenu 暫定
.panel {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  width: max-content;
  margin: 8px 0 0;
  padding: 12px 0;
  border-radius: 10px;
  background: var(--color-bg-subtle);
  box-shadow: var(--shadow-menu);
}
.panel:deep(.btn) {
  padding-left: 12px;
}
</style>
