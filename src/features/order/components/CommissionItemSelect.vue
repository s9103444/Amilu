<template>
  <div class="select" :class="{ 'select--open': isOpen }">
    <!-- 收合：整塊是一顆按鈕，顯示目前選的項目，點了展開 -->
    <button
      v-if="!isOpen && selectedItem"
      class="summary"
      type="button"
      :aria-expanded="isOpen"
      @click="btnOpen"
    >
      <img
        class="cover cover--lg"
        :src="findCover(selectedItem.item_id)"
        :alt="selectedItem.title"
      />
      <span class="info info--lg">
        <span class="text-body item-title">{{ selectedItem.title }}</span>
        <span class="text-small item-subtitle">{{ selectedItem.description }}</span>
      </span>
      <span class="toggle">
        <span class="text-small">更換項目</span>
        <img class="arrow" :src="base + 'icons/arrow-down-gray.svg'" alt="" />
      </span>
    </button>

    <!-- 展開：上面一列「收合」，下面列出這位創作者的所有項目 -->
    <template v-else>
      <button class="header" type="button" :aria-expanded="isOpen" @click="btnOpen">
        <span class="toggle">
          <span class="text-small">收合</span>
          <img class="arrow" :src="base + 'icons/arrow-up-gray.svg'" alt="" />
        </span>
      </button>
      <ul class="list">
        <li
          v-for="item in items"
          :key="item.item_id"
          class="list-item"
          :class="{ 'list-item--selected': item.item_id === selectedId }"
          @click="selectItem(item.item_id)"
        >
          <img class="cover cover--sm" :src="findCover(item.item_id)" :alt="item.title" />
          <span class="info">
            <span class="text-body item-title">{{ item.title }}</span>
            <span class="text-small item-subtitle">{{ item.description }}</span>
          </span>
          <!-- 已選那列顯示橘色勾勾；其他列放同尺寸的空位，文字寬度才會一致 -->
          <span v-if="item.item_id === selectedId" class="check">
            <img :src="base + 'icons/check-white-bold.svg'" alt="" />
          </span>
          <span v-else class="check-placeholder" aria-hidden="true"></span>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  MOCK_COMMISSION_ITEMS as items,
  MOCK_COMMISSION_ITEM_IMAGES as images,
} from '@/mocks/commissionItem'
const base = import.meta.env.BASE_URL
const isOpen = ref(false)
const selectedId = ref(items[0]!.item_id)
const selectedItem = computed(() => items.find((item) => item.item_id === selectedId.value))
// 每一列畫縮圖時呼叫：拿這列的 item_id，到圖片陣列找 seq_no 為 1 的封面（data-model.md 2.2）
function findCover(itemId: string) {
  const cover = images.find((image) => image.item_id === itemId && image.seq_no === 1)
  return cover?.image_url ?? ''
  //cover !== undefined ? cover.image_url : undefined
}
function btnOpen() {
  isOpen.value = !isOpen.value
}
function selectItem(itemId: string) {
  selectedId.value = itemId
  isOpen.value = false
}

/*
元件名稱：委託項目選擇（Figma 592:329），委託申請頁第①區「委託項目與規格」最上面（features.md 4.1）
收合時只顯示目前選的項目；點「更換項目」展開該創作者所有項目，點一列＝換成那個項目並收合
*/
</script>

<style lang="scss" scoped>
// 外框：收合是淺灰框，展開時框變深一階（Figma 592:293／592:303）
.select {
  overflow: hidden; // 展開時已選那列的灰底才不會蓋到圓角
  border: 1px solid var(--color-border);
  border-radius: 15px;
  background: var(--color-bg-subtle);
}

.select--open {
  padding-bottom: 8px;
  border-color: var(--color-border-expanded);
}

// 按鈕清掉瀏覽器預設樣式，字體跟著外面
.summary,
.header {
  width: 100%;
  margin: 0;
  border: none;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

// 用鍵盤移到按鈕時顯示外框，滑鼠點擊不顯示（同 CommissionItemOption）
.summary:focus-visible,
.header:focus-visible {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: -2px;
}

// 收合：縮圖、項目資訊、「更換項目」三塊靠上對齊
.summary {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
}

// 展開的標題列：「收合」靠右
.header {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px 4px;
}

// 「更換項目」／「收合」＋箭頭
.toggle {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
}

.arrow {
  width: 14px;
  height: 14px;
}

// 縮圖：收合 88、展開列 64；圖片還沒載入或沒有圖時先顯示底色
.cover {
  flex-shrink: 0;
  border-radius: 8px;
  background: var(--color-bg-main);
  object-fit: cover;
}

.cover--lg {
  width: 88px;
  height: 88px;
}

.cover--sm {
  width: 64px;
  height: 64px;
}

// 標題與說明：收合間距 6、展開列間距 4
.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.info--lg {
  gap: 6px;
}

.item-title {
  color: var(--color-text-primary);
  overflow-wrap: anywhere; // 標題太長時換行，不撐破外框
}

.item-subtitle {
  color: var(--color-text-secondary);
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  cursor: pointer;
}

.list-item--selected {
  background: var(--color-bg-list-selected);
}

// 已選標記：24px 橘色圓底＋14px 白勾
.check,
.check-placeholder {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.check {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  background: var(--color-selected-badge-bg);
}

// Figma 沒畫 hover，前端自訂：沒選的那列滑過時底色變淺灰，提示可以點（同側邊選單）
@media (hover: hover) {
  .list-item:not(.list-item--selected):hover {
    background: var(--color-bg-subtle-hover);
  }
}
</style>
