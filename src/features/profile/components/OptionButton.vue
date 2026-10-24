<template>
  <label class="option-button">
    <!-- 真正的 radio 藏起來：同一個 name 的一組只能選一個，鍵盤可用方向鍵切換 -->
    <input v-model="selected" class="native" type="radio" :name="name" :value="value" />
    <span class="face text-caption">
      <img v-if="selected === value" class="check" src="/icons/check-option-button.svg" alt="" />
      <slot></slot>
    </span>
  </label>
</template>

<script setup lang="ts">
/*
元件名稱：選項按鈕（Figma 552:206，單選：Amilu 燈開放／暫停、訂金比例）
選取時除了換底色，還會加打勾圖示，不只靠顏色區分。
範例：
使用前先 import：import OptionButton from '@/features/profile/components/OptionButton.vue'
<OptionButton v-model="deposit" name="deposit" value="30">30%</OptionButton>
<OptionButton v-model="deposit" name="deposit" value="50">50%</OptionButton>
<OptionButton v-model="deposit" name="deposit" value="0">無需先支付</OptionButton>
同一組共用同一個 v-model 和 name；deposit 會變成被選那顆的 value
*/
defineProps<{
  name: string // 同一組的名字，瀏覽器靠它判斷「這幾顆只能選一個」
  value: string // 這顆代表的值，被選時存進 v-model
}>()
const selected = defineModel<string>({ default: '' })
</script>

<style lang="scss" scoped>
.option-button {
  position: relative; // 讓藏起來的原生 radio 待在這裡
  display: inline-flex;
  cursor: pointer;
}
// 藏起原生 radio，但不用 display: none（那樣鍵盤就選不到了）
.native {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}
// 未選取：淺灰底。框線先留透明的 1px，選取時才不會因為多了框線而變大
.face {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 14px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: var(--color-bg-subtle);
  color: var(--color-text-primary);
  white-space: nowrap;
}
// 已選取：淺橘底、橘框、前面加勾
.native:checked + .face {
  border-color: var(--color-selected-border);
  background: var(--color-selected-bg);
}
// 用鍵盤移到這裡時顯示外框，滑鼠點擊不顯示
.native:focus-visible + .face {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}
.check {
  width: 18px;
  height: 18px;
}
</style>
