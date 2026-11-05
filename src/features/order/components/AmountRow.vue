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

// 欄位變窄時，左邊的名稱換行，右邊的金額不讓位
// keep-all：中文不在字和字中間斷，只在括號這類標點前換行，例如「創作者可得」／「（已確認階段）」
// overflow-wrap：名稱裡沒有標點又放不下時，才退回任意位置斷開，不會擠出卡片
.text-label {
  min-width: 0;
  color: var(--color-text-primary);
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.text-value {
  flex-shrink: 0;
  color: var(--color-text-secondary);
  white-space: nowrap; // 金額不斷成兩行
}

// .text-body 是 regular，Figma 的強調值是 medium，這裡補上
.row-emphasis {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}
</style>
