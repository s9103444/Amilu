<template>
  <div class="settlement-preview">
    <span class="text-caption preview-title">結算試算</span>
    <AmountRow label="委託人已付" :value="formatAmount(paid)" />
    <AmountRow label="創作者可得（已確認階段）" :value="formatAmount(creatorEarns)" />
    <AmountRow :label="refundLabel" :value="formatAmount(Math.abs(refund))" emphasis />
    <span class="text-small note"
      >委託人可取得最近一次雙方確認過的階段稿件（去浮水印）；尚無確認階段時不提供。</span
    >
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：結算試算（Figma 626:118），放在終止合作燈箱裡（features.md 4.9）
三個數字由後端算好（燈箱跟後端拿試算結果），這裡只負責排版和格式化，不算錢
唯一的顯示規則：退款是負數時，代表委託人還要再付，標題改成「委託人應補付」、數字顯示正數
最下面那句說明是 spec 規定的固定文字，所以直接寫在 template 裡
範例：
使用前先 import：import SettlementPreview from '@/features/order/components/SettlementPreview.vue'
<SettlementPreview :paid="1800" :creator-earns="540" :refund="1260" />   ---> 委託人退款 NT$ 1,260
<SettlementPreview :paid="540" :creator-earns="900" :refund="-360" />    ---> 委託人應補付 NT$ 360
*/
import { computed } from 'vue'
import AmountRow from '@/features/order/components/AmountRow.vue'
import { formatAmount } from '@/shared/utils/formatAmount'
const props = defineProps<{
  paid: number // 委託人已付
  creatorEarns: number // 創作者可得
  refund: number // 委託人退款，負數＝委託人應補付
}>()

const refundLabel = computed(() => {
  if (props.refund < 0) {
    return '委託人應補付'
  }
  return '委託人退款'
})
</script>

<style lang="scss" scoped>
// 淺灰底、內距 20、圓角 16，標題、三列、說明之間都是間距 8（Figma 626:118）。寬度由燈箱決定
.settlement-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  background: var(--color-bg-subtle);
}

.preview-title {
  color: var(--color-text-primary);
}

// 固定說明：灰色小字，太長時換行
.note {
  color: var(--color-text-secondary);
}
</style>
