<template>
  <div class="warning-box">
    <div class="warning-box__title">
      <img src="/icons/warning.svg" alt="" />
      <p class="text-body">{{ title }}</p>
    </div>
    <ul v-if="items?.length" class="text-caption warning-box__list">
      <li v-for="item in items" :key="item">・{{ item }}</li>
    </ul>
    <p v-else class="text-caption warning-box__content"><slot></slot></p>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：警語框（例如刪除帳號前的提醒）
範例：
使用前先 import：import WarningBox from '@/shared/components/WarningBox.vue'
<WarningBox title="你還有尚未結束的委託">請等委託完成後，再刪除帳號。</WarningBox> ---> 段落款
<WarningBox title="刪除後無法復原" :items="['個人頁將不再公開顯示', '無法再登入此帳號']" /> ---> 條列款（每項前面自動加「・」）
寬度撐滿
*/
defineProps<{
  title: string
  items?: string[]
}>()
</script>

<style lang="scss" scoped>
.warning-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: 12px;
  background: var(--color-error-bg);
}

.warning-box__title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-error);

  & > img {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  & > p {
    flex: 1;
    min-width: 0;
    margin: 0;
  }
}

.warning-box__content,
.warning-box__list {
  margin: 0;
  color: var(--color-text-primary);
}

//-----條列款-----//
.warning-box__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  list-style: none;
}
</style>
