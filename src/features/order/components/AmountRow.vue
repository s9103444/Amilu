<template>
  <div class="row-layout">
    <span class="text-caption text-label">{{ label }}</span>
    <!-- 字級和顏色都只換右邊：強調時 20px 黑字，平常 16px 灰字 -->
    <span class="text-value" :class="emphasis ? 'text-body row-emphasis' : 'text-caption'">
      {{ value }}
    </span>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：款項列（Figma 617:589），用在委託討論牆的補款卡、結算卡明細
emphasis：這張卡要使用者看的那個數字（應補付、撥款給創作者）設 true，其他參考資訊不用傳
value 由卡片格式化好再傳進來，因為不一定是金額（例如「補款期限」放的是日期）
範例：
使用前先 import：import AmountRow from '@/features/order/components/AmountRow.vue'
<AmountRow label="委託總額" value="NT$ 1,800" />
<AmountRow label="應補付" value="NT$ 1,260" emphasis />
*/
withDefaults(
  defineProps<{
    label: string
    value: string
    emphasis?: boolean
  }>(),
  {
    emphasis: false,
  },
)
</script>

<style lang="scss" scoped>
.row-layout {
  display: flex;
  justify-content: space-between;
  align-items: center; // 強調時右邊比較高，左邊要垂直置中
  gap: 16px; // Figma 沒有間距，前端自訂：文字太長時兩邊不會黏在一起
  width: 100%;
}

.text-label {
  color: var(--color-text-primary);
  white-space: nowrap;
}

.text-value {
  color: var(--color-text-secondary);
  white-space: nowrap; // 金額不斷成兩行
}

// .text-body 是 regular，Figma 的強調值是 medium，這裡補上
.row-emphasis {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}
</style>
