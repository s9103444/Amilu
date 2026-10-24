<template>
  <div class="field" ref="field">
    <div class="title">
      <label class="text-caption" :for="inputId">
        <slot></slot>
      </label>
      <span class="text-small note--required" v-if="requirement === 'required'">必填</span>
      <span class="text-small note--optional" v-else-if="requirement === 'optional'">選填</span>
    </div>
    <button
      type="button"
      :id="inputId"
      class="select"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <span class="selected text-caption" v-if="selectedOption">{{ selectedOption.label }}</span>
      <span class="hint text-caption" v-else>{{ placeholder }}</span>
      <img class="arrow" src="/icons/arrow-down-gray.svg" alt="" />
    </button>
    <ul class="panel" v-if="isOpen">
      <li
        class="option text-caption"
        v-for="option in options"
        :key="option.value"
        @click="changeSelect(option.value)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：下拉選單（Figma 欄位 568:274、選項 568:283、面板 575:4929）
範例：
使用前先 import：import FormSelect from '@/shared/components/FormSelect.vue'
<FormSelect v-model="category" requirement="required" :options="CATEGORY_OPTIONS">作品類型</FormSelect>
options 是 { value, label }[]；category 拿到的是被選那一項的 value（還沒選是 ''）
placeholder 可以改提示字，預設「請選擇一個」
*/
import { computed, useId, ref, useTemplateRef, onMounted, onBeforeUnmount } from 'vue'
const fieldEl = useTemplateRef<HTMLElement>('field')
const inputId = useId()
const props = withDefaults(
  defineProps<{
    requirement?: 'required' | 'optional'
    placeholder?: string
    options: {
      value: string
      label: string
    }[]
  }>(),
  { placeholder: '請選擇一個' },
)
const selected = defineModel<string>({ default: '' })
const selectedOption = computed(() =>
  props.options.find((option) => option.value === selected.value),
)
const isOpen = ref<boolean>(false)
// 【第 5 步：點清單裡的某一行時觸發】存下那一行的代號，然後關掉清單
function changeSelect(value: string) {
  selected.value = value
  isOpen.value = false
}
// 【點外面關閉：document 每次被按下時呼叫，見下方 onMounted】不在元件裡就關掉清單
function closeOnOutsideClick(event: PointerEvent) {
  if (!fieldEl.value?.contains(event.target as Node)) {
    isOpen.value = false
  }
}
// 元件出現時開始聽、消失前停止聽（document 是全站共用的，不收回會一直累積）
onMounted(() => {
  document.addEventListener('pointerdown', closeOnOutsideClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeOnOutsideClick)
})
</script>

<style lang="scss" scoped>
// 整個元件：標題列在上、選擇框在下
// position: relative 讓下拉面板以這裡為基準浮起來
.field {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 6px;
}
// 標題列：標籤＋必填／選填
.title {
  display: flex;
  align-items: center;
  gap: 8px;
}
label {
  color: var(--color-text-primary);
}
.note--required {
  color: var(--color-required);
}
.note--optional {
  color: var(--color-text-secondary);
}
// 選擇框：先蓋掉 button 的瀏覽器預設樣式（灰底、框線、字體、置中）
.select {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg-subtle);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
// 提示字吃掉剩餘空間，把箭頭推到最右邊
.hint {
  flex: 1;
  min-width: 0;
  color: var(--color-placeholder);
}
.selected {
  flex: 1;
  min-width: 0;
  color: var(--color-text-primary);
}
.arrow {
  flex-shrink: 0;
}
// 下拉面板：浮在選擇框正下方，蓋住後面的內容，不會把它們往下推
.panel {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  width: 100%;
  margin: 4px 0 0;
  padding: 8px;
  list-style: none;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-dropdown);
  box-shadow: var(--shadow-dropdown);
}
.option {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  color: var(--color-text-primary);
  cursor: pointer;
}
// 只在有滑鼠的裝置加 hover，避免手機點一下之後底色卡住
@media (hover: hover) {
  .option:hover {
    background: var(--color-bg-option-hover);
  }
}
</style>
