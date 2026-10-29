<template>
  <button type="button" class="btn text-small" :class="{ 'btn--active': active }">
    <span>{{ buttonType === 'notify' ? '通知' : '聊天' }}</span>
    <!-- spec 5.2：只有「通知」頁籤顯示未讀數，「對話」頁籤不做未讀標記 -->
    <span v-if="buttonType === 'notify' && noticeNumber" class="red">{{ noticeNumber }}</span>
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：通知中心的頁籤按鈕（header 鈴鐺點開後的小視窗頂部，spec/features.md 5.2）
範例：
使用前先 import：import NotificationItem from '@/layouts/components/header/NotificationItem.vue'
<NotificationItem button-type="notify" :active="tab === 'notify'" :notice-number="3" @click="tab = 'notify'" />
<NotificationItem button-type="chat" :active="tab === 'chat'" @click="tab = 'chat'" />  ---> 聊天頁籤不傳數字
button-type 決定顯示「通知」或「聊天」
目前選中哪個頁籤由外面（通知視窗）記住，用 active 傳進來；這個元件只負責顯示文字顏色和底線
notice-number 傳未讀數，有數字（大於 0）才出現紅點；沒傳或傳 0 就不顯示
聊天頁籤一律不顯示紅點（spec 規定對話不做未讀標記），就算傳了數字也不會出現
active 沒傳時，Vue 會當成 false
*/
defineProps<{
  buttonType: 'notify' | 'chat'
  active?: boolean
  noticeNumber?: number
}>()
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
  margin-right: 10px;
  position: relative;
  color: var(--color-text-secondary);
  display: flex;
  width: fit-content;
  height: 36px;
  padding: 6px 0;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  transition: background-color 0.2s ease;
}
.btn--active {
  color: var(--color-text-primary);
}
.btn::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 3px;
  background-color: var(--color-button-secondary);
  transition: width 0.3s ease; /* 設定轉場動畫 */
}
.btn--active::after {
  width: 100%;
}

// 未讀數圓點：顯示實際數字，用 padding 撐開；字級用 --fs-badge（8px 固定）
// 高度 = 8px 字 + 上下各 1px = 10px。一位數靠 min-width 補成圓形，兩位數以上拉長成膠囊形
.red {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 10px;
  padding: 2px 4px;
  border-radius: 999px; // 固定的大數值，不管多寬兩端都是半圓（50% 會變橢圓）
  background-color: var(--color-button-secondary);
  color: var(--color-text-on-dark);
  font-family: var(--font-family);
  font-size: var(--fs-badge);
  line-height: 1;
}
</style>
