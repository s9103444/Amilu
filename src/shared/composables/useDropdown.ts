/*
下拉選單的開關：記住開或關、提供 toggle／close，並且點外面自動關閉。
範例：
使用前先 import：import { useDropdown } from '@/shared/composables/useDropdown'
const fieldEl = useTemplateRef<HTMLElement>('field')   // 模板最外層加 ref="field"
const { isOpen, toggle, close } = useDropdown(fieldEl)
模板：按鈕 @click="toggle"、清單 v-if="isOpen"；選完某一項時呼叫 close()
要在 <script setup> 最上層呼叫（不能放在函式或 if 裡），裡面的 useClickOutside 才會綁到這個元件。
*/
import { ref, type Ref } from 'vue'
import { useClickOutside } from '@/shared/composables/useClickOutside'

export function useDropdown(target: Readonly<Ref<HTMLElement | null>>) {
  // 每個元件呼叫一次，就各自有一份 isOpen，選單之間互不影響
  const isOpen = ref(false)

  // 【點按鈕時觸發】開 ↔ 關
  function toggle() {
    isOpen.value = !isOpen.value
  }

  // 【選完某一項、或點到外面時觸發】關掉
  function close() {
    isOpen.value = false
  }

  // 【點外面關閉】點到 target 以外的地方時呼叫 close
  useClickOutside(target, close)

  // 交給元件：isOpen 給模板判斷、toggle 給按鈕、close 給選完時用
  return { isOpen, toggle, close }
}
