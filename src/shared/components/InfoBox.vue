<template>
  <div class="info-box">
    <img src="/icons/info.svg" alt="" />
    <p class="text-caption info-box__text"><slot></slot></p>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：提示框（一行資訊提示，例如付款期限）
範例：
使用前先 import：import InfoBox from '@/shared/components/InfoBox.vue'
<InfoBox>請於 2026/10/03 23:59 前使用 ATM 轉帳至收款帳號付款。</InfoBox> ---> 寬度撐滿
*/
</script>

<style lang="scss" scoped>
.info-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: 12px;
  background: var(--color-bg-subtle);

  & > img {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
  }
}

.info-box__text {
  flex: 1;
  min-width: 0;
  margin: 0;
  color: var(--color-text-primary);
}
</style>
