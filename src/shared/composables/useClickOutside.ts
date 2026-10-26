/*
點外面就觸發：點到 target 以外的地方時，呼叫 onOutside。常用在下拉選單「點外面關閉」。
範例：
使用前先 import：import { useClickOutside } from '@/shared/composables/useClickOutside'
const fieldEl = useTemplateRef<HTMLElement>('field')   // 模板最外層加 ref="field"
useClickOutside(fieldEl, () => { isOpen.value = false })
要在 <script setup> 最上層呼叫（不能放在函式或 if 裡），onMounted／onBeforeUnmount 才會綁到這個元件。
*/
import { onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useClickOutside(target: Readonly<Ref<HTMLElement | null>>, onOutside: () => void) {
  // 【網頁上任何地方被按下時觸發】按到的不在 target 裡面，就呼叫 onOutside
  function handler(event: PointerEvent) {
    if (!target.value?.contains(event.target as Node)) {
      onOutside()
    }
  }
  // 元件出現時開始聽、消失前停止聽（document 是全站共用的，不收回會一直累積）
  // 掛上和拿掉要傳同一個 handler，瀏覽器才認得要拿掉哪一個
  onMounted(() => {
    document.addEventListener('pointerdown', handler)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handler)
  })
}
