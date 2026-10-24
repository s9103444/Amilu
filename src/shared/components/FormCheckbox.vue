<template>
  <label class="checkbox">
    <!-- 真正的 checkbox 藏起來，保留鍵盤（Tab、空白鍵）和螢幕閱讀器的功能；畫面上看到的是 .box -->
    <input v-model="checked" class="native" type="checkbox" />
    <span class="box" aria-hidden="true">
      <img v-if="checked" class="check" src="/icons/check-white.svg" alt="" />
    </span>
    <span class="text text-caption">
      <slot></slot>
    </span>
  </label>
</template>

<script setup lang="ts">
/*
元件名稱：勾選框（Figma 535:2953，兩種狀態：未勾選、已勾選）
範例：
使用前先 import：import FormCheckbox from '@/shared/components/FormCheckbox.vue'
<FormCheckbox v-model="agreed">我已閱讀並同意服務條款</FormCheckbox>
agreed 是 ref(false)，勾選後變成 true
*/
const checked = defineModel<boolean>({ default: false })
</script>

<style lang="scss" scoped>
// 整個 label 都可以點，點文字也會勾選
.checkbox {
  position: relative; // 讓藏起來的原生 checkbox 待在這裡，不會跑到頁面角落
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
// 把原生 checkbox 藏起來，但不用 display: none（那樣鍵盤就選不到了）
.native {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}
// 畫面上的方框：未勾選是白底灰框
.box {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid var(--color-checkbox-border);
  border-radius: 4px;
  background: var(--color-checkbox-bg);
}

// 已勾選：深色底、白勾，框線跟底色同色
.native:checked + .box {
  border-color: var(--color-bg-inverse);
  background: var(--color-bg-inverse);
}
// 用鍵盤移到這裡時顯示外框，滑鼠點擊不顯示
.native:focus-visible + .box {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}
.check {
  width: 14px;
  height: 14px;
}
.text {
  color: var(--color-text-primary);
}
</style>
