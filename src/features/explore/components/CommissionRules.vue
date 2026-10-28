<template>
  <div class="rules">
    <button type="button" class="header" :aria-expanded="isOpen" @click="changeStates">
      <span class="title text-body">{{ title }}</span>
      <img
        class="arrow"
        :src="base + (isOpen ? 'icons/arrow-up-gray.svg' : 'icons/arrow-down-gray.svg')"
        alt=""
      />
    </button>
    <div v-if="isOpen" class="content text-caption">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：接案規範（Figma 522:1207），作品燈箱裡可收合的文字區
範例：
使用前先 import：import CommissionRules from '@/features/explore/components/CommissionRules.vue'
<CommissionRules title="接案規範">規範內容……</CommissionRules>
<CommissionRules title="作者簡介">{{ user.bio }}</CommissionRules>  ---> Figma 範例標題是「作者簡介」，同一個樣式也能用
點標題在收合／展開間切換；開關由元件自己記住（同 CategorySelect），用的地方不用另外寫。
寬度跟著外層。
*/
import { ref } from 'vue'

defineProps<{
  title: string // 標題列的文字
}>()

// 圖示用 :src 綁定，Vite 不會自動補 base，要自己接（BASE_URL 結尾已經有 /）
const base = import.meta.env.BASE_URL
const isOpen = ref(false)

// 【點標題時觸發】開著就收、收著就開
function changeStates() {
  isOpen.value = !isOpen.value
}
</script>

<style lang="scss" scoped>
.rules {
  display: flex;
  flex-direction: column;
  width: 100%;
}

// 先蓋掉 button 的瀏覽器預設樣式（灰底、框線、置中）
.header {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: transparent;
  text-align: left;
}

.title {
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.arrow {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

// 展開後的內容：左右與標題對齊（Figma）
.content {
  padding: 0 16px;
  color: var(--color-text-primary);
  word-break: break-word;
}

// Figma 沒畫 hover，前端自訂：標題字變深，同 HashtagLabel
@media (hover: hover) {
  .header:hover .title {
    color: var(--color-text-primary);
  }
}
</style>
