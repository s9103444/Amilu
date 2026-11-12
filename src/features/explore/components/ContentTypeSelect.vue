<template>
  <div class="field" ref="field">
    <button type="button" class="btn" @click="toggle" :class="{ 'btn--active': isOpen }">
      <span class="text-button-md">{{ selectedLabel ?? '作品分類' }}</span>
      <img
        :src="base + (isOpen ? 'icons/arrow-up-black.svg' : 'icons/arrow-down-gray.svg')"
        alt=""
      />
    </button>
    <ul class="panel" v-if="isOpen">
      <li
        class="option text-caption"
        :class="{ 'option--selected': option.value === selected }"
        v-for="option in CONTENT_TYPE_OPTIONS"
        :key="option.value"
        @click="selectPicked(option.value)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useDropdown } from '@/shared/composables/useDropdown'
import { useTemplateRef, computed } from 'vue'
import { CONTENT_TYPE_OPTIONS } from '@/features/explore/constants'
const fieldEl = useTemplateRef<HTMLElement>('field')
const base = import.meta.env.BASE_URL
// 面板開關＋點 field（按鈕＋面板）以外的地方自動關閉
const { isOpen, toggle, close } = useDropdown(fieldEl)
// 外面 v-model 傳進來的值；改 selected.value 時，Vue 會自動通知外面更新
const selected = defineModel<string>({ default: 'all' })

// 按鈕文字：用 selected 存的 value 找出對應的中文 label；selected 一變就自動重算
const selectedLabel = computed(() => {
  const selectedOne = CONTENT_TYPE_OPTIONS.find((option) => option.value === selected.value)
  return selectedOne?.label
})
// 【點選項時觸發，見模板】存下那一項的 value（交給外面），然後關掉面板
function selectPicked(value: string) {
  selected.value = value
  close()
}
</script>

<style lang="scss" scoped>
// 按鈕：同 CategorySelect（Figma 490:469），沒展開灰字、展開黑字
// 面板：Figma 沒畫，2026/11/11 決定沿用 FormSelect 的清單樣式（token 同一組）
// position: relative 讓面板以這顆按鈕為基準浮起來（不像 CategorySelect 撐滿整列）
.field {
  position: relative;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  white-space: nowrap; // 按鈕文字不換行，被擠時整顆維持一行
}

.btn--active {
  color: var(--color-text-primary);
}

// 浮在按鈕正下方，蓋住後面的內容；寬度跟著選項文字，不被按鈕寬度限制
.panel {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  width: max-content;
  min-width: 100%;
  margin: 8px 0 0;
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
  color: var(--color-text-secondary);
  white-space: nowrap;
  cursor: pointer;
}

// 目前選中的那項：黑字粗體（按鈕文字固定，只能靠這裡看出選了哪個）
.option--selected {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
}

// 只在有滑鼠的裝置加 hover，避免手機點一下之後底色卡住（同 FormSelect）
@media (hover: hover) {
  .option:hover {
    background: var(--color-bg-option-hover);
  }
}
</style>
