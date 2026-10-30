<template>
  <label class="item" :class="{ 'item--selected': isSelected }">
    <!-- 真正的 radio 藏起來：同一個 name 的一組只能選一個，鍵盤可用方向鍵切換（同 PaymentPlanCard） -->
    <input v-model="selected" class="native" type="radio" :name="name" :value="value" />
    <span class="header">
      <span class="name-price">
        <span class="name-tag">
          <span class="title text-caption">{{ title }}</span>
          <CommercialTag v-if="commercialAllowed" />
        </span>
        <span class="price text-small">{{ priceText }}</span>
      </span>
      <img
        class="arrow"
        :src="base + (isSelected ? 'icons/arrow-up-gray.svg' : 'icons/arrow-down-gray.svg')"
        alt=""
      />
    </span>
    <span v-if="isSelected" class="description">{{ description }}</span>
    <span v-if="isSelected" class="check" aria-hidden="true">
      <img :src="base + 'icons/check-white-sm.svg'" alt="" />
    </span>
  </label>
</template>

<script setup lang="ts">
/*
元件名稱：委託項目列（Figma 526:216），委託商店燈箱右側的可委託項目列表
點一列＝選取並展開；同一組共用 v-model，所以點別列時前一列自動收合（同一時間只展開一列）。
範例：
使用前先 import：import CommissionItemOption from '@/features/explore/components/CommissionItemOption.vue'
<CommissionItemOption
  v-for="item in items"
  :key="item.item_id"
  v-model="selectedItemId"
  name="commission-item"
  :value="item.item_id"
  :title="item.title"
  :description="item.description"
  :price="item.price"
  :commercial-allowed="item.commercial_allowed"
/>
selectedItemId 會變成被選那列的 item_id，「我要委託」用它帶入申請頁（features.md 4.1）。
從首頁點可委託項目卡片進來時，把 selectedItemId 預設成被點的那個 item_id，就會預先展開那列（features.md 2.6）。
*/
import { computed } from 'vue'
import CommercialTag from '@/shared/components/CommercialTag.vue'

const props = defineProps<{
  name: string // 同一組的名字，瀏覽器靠它判斷「這幾列只能選一個」
  value: string // 這列代表的項目（item_id），被選時存進 v-model
  title: string // COMMISSION_ITEM.title
  description: string // COMMISSION_ITEM.description，展開時才顯示
  price: number // COMMISSION_ITEM.price
  commercialAllowed: boolean // COMMISSION_ITEM.commercial_allowed，true 才顯示「可商用」
}>()
const selected = defineModel<string>({ default: '' })

const base = import.meta.env.BASE_URL
const isSelected = computed(() => selected.value === props.value)
const priceText = computed(() => `NT$ ${props.price.toLocaleString('zh-TW')}`)
</script>

<style lang="scss" scoped>
// 收合：淺灰底、1px 灰框。
// Figma 的框畫在內側、內距 12／16 含框線；CSS 的框在內距外面，所以內距要扣掉框線寬度，
// 展開時框變 1.5px、內距跟著再少 0.5px，切換時文字才不會跳（同 PaymentPlanCard）
.item {
  position: relative; // 讓藏起來的 radio 和右上角勾勾以這裡為準
  display: flex;
  flex-direction: column;
  gap: 8px; // 只在展開、出現說明時才有作用
  padding: 11px 15px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-subtle);
  cursor: pointer;
  transition: border-color 0.3s ease;
}

// 展開＝已選取：1.5px 橘框，右上角出現勾勾
.item--selected {
  padding: 10.5px 14.5px;
  border: 1.5px solid var(--color-selected-border);
}

// 藏起原生 radio，但不用 display: none／hidden（那樣鍵盤就選不到了）
.native {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}

// 用鍵盤移到這裡時顯示外框，滑鼠點擊不顯示（同 PaymentPlanCard）
.item:has(.native:focus-visible) {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

// 標題列：左邊名稱與價格、右邊箭頭
.header {
  display: flex;
  align-items: center;
  gap: 8px;
}

// 名稱與價格：空間不夠時價格換到下一行
.name-price {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 4px 8px;
  min-width: 0;
}

.name-tag {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  min-width: 0;
}

.title {
  color: var(--color-text-primary);
  overflow-wrap: anywhere; // 標題太長時換行，不撐破卡片
}

.price {
  color: var(--color-text-primary);
  white-space: nowrap;
}

.arrow {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

// 說明：字樣同可商用標籤（Figma text style `note`）
.description {
  color: var(--color-text-secondary);
  font-family: var(--font-family);
  font-size: var(--fs-note);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
  text-box: trim-both cap alphabetic;
}

// 右上角勾勾：Figma 的位置是從外框量（上 -6.5、右 -7.5），
// CSS 的 absolute 從框線內側量，所以再往外推 1.5px 框線寬度
.check {
  position: absolute;
  top: -8px;
  right: -9px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 19px;
  height: 19px;
  border-radius: 999px;
  background: var(--color-selected-badge-bg);
}

// Figma 沒畫 hover，前端自訂：只有未選的那列框線變橘，提示可以點（同 PaymentPlanCard）
@media (hover: hover) {
  .item:not(.item--selected):hover {
    border-color: var(--color-selected-border);
  }
}
</style>
