<template>
  <div class="field" ref="field">
    <button type="button" class="btn" @click="toggle" :class="{ 'btn--active': isOpen }">
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
          <!-- 【點卡片時觸發】把這一項的 value 交給 selectPicked -->
          <CategoryCard
            @click="selectPicked(card.value)"
            v-if="card.imageUrl"
            :name="card.label"
            :image-url="card.imageUrl"
          />
        </li>
      </ul>
      <ul class="label-options">
        <li v-for="item in labelOptions" :key="item.value">
          <!-- 【點 hashtag 時觸發】同上 -->
          <HashtagLabel @click="selectPicked(item.value)">#{{ item.label }}</HashtagLabel>
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
<CategorySelect v-model="category" button-type="category" /> ---> 作品類型
<CategorySelect v-model="purpose" button-type="purpose" /> ---> 作品用途
category／purpose 拿到的是被選那一項的 value（category_id／purpose_id，還沒選是 ''）。
面板前 6 項是圖卡、後 4 項是 hashtag，清單來自 mocks/classification.ts。
面板會和「最近一個有 position 的外層」一樣寬：使用的地方要在放按鈕的那一列加 position: relative。
*/
import { computed, useTemplateRef } from 'vue'
import { CATEGORY_OPTIONS, PURPOSE_OPTIONS } from '@/mocks/classification'
import { useDropdown } from '@/shared/composables/useDropdown'
import CategoryCard from '@/features/explore/components/CategoryCard.vue'
import HashtagLabel from '@/shared/components/HashtagLabel.vue'

const fieldEl = useTemplateRef<HTMLElement>('field')
const base = import.meta.env.BASE_URL
// 面板開關＋點 field（按鈕＋面板）以外的地方自動關閉
const { isOpen, toggle, close } = useDropdown(fieldEl)
// 外面 v-model 傳進來的值；改 selected.value 時，Vue 會自動通知外面更新
const selected = defineModel<string>({ default: '' })
const props = withDefaults(
  defineProps<{
    buttonType: 'category' | 'purpose'
  }>(),
  {
    buttonType: 'category',
  },
)
// 【點卡片或 hashtag 時觸發，見模板】存下那一項的 value（交給外面），然後關掉面板
function selectPicked(value: string) {
  selected.value = value
  close()
}

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
  white-space: nowrap; // 按鈕文字不換行，被擠時整顆維持一行
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
  z-index: 50;
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
