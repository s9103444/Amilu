<template>
  <form class="search" role="search" @submit.prevent="onSubmit">
    <label class="layout"
      ><span class="visually-hidden">搜尋本站內容</span>
      <img src="/icons/search.svg" alt="" />
      <input
        v-model="searchText"
        class="text-caption input"
        type="search"
        placeholder="輸入搜尋關鍵字"
      />
    </label>
  </form>
</template>

<script setup lang="ts">
/*
元件名稱：header 搜尋列
範例：
<SearchBar v-model="keyword" @search="onSearch" />
v-model 綁頁面的 ref，輸入的字會同步回去；
按 Enter 送出時觸發 search 事件，帶的是去掉前後空白的關鍵字，只有空白時不送出。
點框內任何位置（包含放大鏡）都會聚焦到輸入框。
寬度跟著外層，由放它的 header 決定。
*/
const emit = defineEmits<{
  search: [keyword: string]
}>()
const searchText = defineModel<string>({ default: '' })
function onSubmit() {
  const trimmed = searchText.value.trim()
  if (trimmed === '') {
    return
  }
  emit('search', trimmed)
}
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-subtle);

  // input 拿掉了 outline，改由外框變深提示「焦點在這裡」
  &:focus-within {
    border-color: var(--color-text-secondary);
  }
}
.layout {
  cursor: text;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
.input {
  outline: none;
  flex: 1;
  min-width: 0;
  border: none;
  background-color: transparent;
  color: var(--color-text-primary);
  &::placeholder {
    color: var(--color-placeholder);
  }
  &::-webkit-search-cancel-button {
    appearance: none;
  }
}
</style>
