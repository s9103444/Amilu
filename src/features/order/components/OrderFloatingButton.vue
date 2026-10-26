<template>
  <button
    type="button"
    class="btn"
    :class="{ 'btn--info': status === 'info' }"
    :aria-label="status === 'chat' ? '開啟聊天室' : '查看案件資訊'"
  >
    <img :src="base + (status === 'chat' ? 'icons/message.svg' : 'icons/profile.svg')" alt="" />
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：委託討論牆右下角的浮動按鈕（Figma node 585:12563）
範例：
<OrderFloatingButton status="chat" /> ---> 開啟聊天室（漸層底）
<OrderFloatingButton status="info" /> ---> 查看案件資訊（深色底）
位置（固定在右下角）由使用它的頁面決定，元件本身只負責圓形按鈕的外觀。
*/
const base = import.meta.env.BASE_URL
defineProps<{
  status: 'chat' | 'info'
}>()
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: var(--gradient-button-primary);
  box-shadow: var(--shadow-floating);
}
.btn--info {
  background: var(--color-button-floating-info-bg);
}
.btn img {
  display: block;
}
</style>
