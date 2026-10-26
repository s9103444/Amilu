<template>
  <div class="field" ref="field">
    <button type="button" class="btn" @click="changeStates" :class="{ 'btn--active': isOpen }">
      <span class="text-button-md">{{ title }}</span>
      <img
        :src="base + (isOpen ? 'icons/arrow-up-black.svg' : 'icons/arrow-down-gray.svg')"
        alt=""
      />
    </button>
    <div class="panel" v-if="isOpen">
      <p class="text-body panel-title">{{ title }}</p>
      <ul class="card-options">
        <li v-for="card in cardOptions" :key="card.value">
          <CategoryCard v-if="card.imageUrl" :name="card.label" :image-url="card.imageUrl" />
        </li>
      </ul>
      <ul class="label-options">
        <li v-for="item in labelOptions" :key="item.value">
          <HashtagLabel>#{{ item.label }}</HashtagLabel>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：首頁類型下拉選單（Figma 觸發按鈕 490:469、面板 496:1933）
範例：
使用前先 import：import CategorySelect from '@/features/explore/components/CategorySelect.vue'
<CategorySelect button-type="category" /> ---> 作品類型
<CategorySelect button-type="purpose" /> ---> 作品用途
面板前 6 項是圖卡、後 4 項是 hashtag，清單來自 mocks/classification.ts。
面板會和「最近一個有 position 的外層」一樣寬：使用的地方要在放按鈕的那一列加 position: relative。
尚未完成：點選後把選到的 value 交給外面（v-model）。
*/
import { computed, ref, useTemplateRef } from 'vue'
import { CATEGORY_OPTIONS, PURPOSE_OPTIONS } from '@/mocks/classification'
import { useClickOutside } from '@/shared/composables/useClickOutside'
import CategoryCard from '@/features/explore/components/CategoryCard.vue'
import HashtagLabel from '@/shared/components/HashtagLabel.vue'
const fieldEl = useTemplateRef<HTMLElement>('field')
const base = import.meta.env.BASE_URL
const isOpen = ref(false)
const props = withDefaults(
  defineProps<{
    buttonType: 'category' | 'purpose'
  }>(),
  {
    buttonType: 'category',
  },
)
// 【點按鈕時觸發】面板開著就關、關著就開
function changeStates() {
  isOpen.value = !isOpen.value
}
// 【點外面時觸發，由下方 useClickOutside 呼叫】關掉面板
function statesOff() {
  isOpen.value = false
}
// 【點外面關閉】點到 field（按鈕＋面板）以外的地方時，呼叫 statesOff
useClickOutside(fieldEl, statesOff)

// 按鈕文字和面板標題共用
const title = computed(() => (props.buttonType === 'category' ? '作品類型' : '作品用途'))
// 依按鈕種類決定面板用哪一份清單（buttonType 變了會自動重算）
const options = computed(() =>
  props.buttonType === 'category' ? CATEGORY_OPTIONS : PURPOSE_OPTIONS,
)
// 前 6 項畫成卡片、後 4 項畫成 hashtag（第 0～5 格／第 6 格到最後）
const cardOptions = computed(() => options.value.slice(0, 6))
const labelOptions = computed(() => options.value.slice(6))
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

.btn {
  cursor: pointer;
  padding: 0;
  border: none;
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
}
.btn--active {
  color: var(--color-text-primary);
}
.panel {
  display: flex;
  flex-direction: column;
  gap: 20px; // 標題、卡片、hashtag 之間（Figma）
  background-color: var(--color-bg-subtle);
  position: absolute;
  left: 0;
  right: 0;
  top: 130%;
  box-shadow: var(--shadow-dropdown);
  padding: 24px 30px;
  border-radius: 14px;
}
.panel-title {
  margin: 0;
  color: var(--color-text-secondary);
}
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
ul.card-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
ul.label-options {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  & li {
    width: fit-content;
  }
}

@include bp.tablet-up {
  ul.card-options {
    grid-template-columns: repeat(3, 1fr);
  }
}
@include bp.desktop-up {
  ul.card-options {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
