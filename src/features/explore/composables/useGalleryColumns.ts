/*
作品牆分欄：讀出現在該排幾欄，把卡片依「第 i 張放第 i % N 欄」分好，交給頁面用兩層 v-for 畫出來。
欄數不在 JS 寫死，讀 _tokens.scss 的 --gallery-columns（手機 2／平板 3／桌機 5），規則只有一份。
不用 CSS columns：那種排法是直的往下排，載入更多時舊卡片會跳；這裡新卡片只會接在後面，舊卡片不動。
範例：
使用前先 import：import { useGalleryColumns } from '@/features/explore/composables/useGalleryColumns'
const cards = ref<GalleryCard[]>([])
const { columns } = useGalleryColumns(cards)   // 傳 ref 本身，不是 cards.value，fetch 回來才會自動重算
模板：v-for="column in columns" 畫每一欄，裡面 v-for="card in column" 畫卡片
要在 <script setup> 最上層呼叫（不能放在函式或 if 裡），onMounted／onBeforeUnmount 才會綁到這個元件。
*/
import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'

// <T>：這裡只管排位置、不讀卡片欄位，所以不限型別；傳 GalleryCard[] 進來，T 就是 GalleryCard
export function useGalleryColumns<T>(items: Ref<T[]>) {
  // 讀 _tokens.scss 的 --gallery-columns（手機 2／平板 3／桌機 5）
  // 讀不到時 Number('') 是 0，用 || 改成 2，避免 i % 0 變 NaN 讓整面牆消失（?? 攔不到 0）
  function readColumnCount() {
    return (
      Number(getComputedStyle(document.documentElement).getPropertyValue('--gallery-columns')) || 2
    )
  }
  // 建立時就讀一次，第一次畫面就是正確欄數
  // 用 ref 不用 computed：getComputedStyle 不是 ref，Vue 不知道視窗變了，要靠 resize 事件寫進來
  const columnCount = ref(readColumnCount())

  // 【視窗縮放時觸發】重讀欄數；值沒變時 Vue 不會重算
  function handleResize() {
    columnCount.value = readColumnCount()
  }

  // 【頁面掛上後】開始聽；【離開頁面前】停止聽
  // resize 是 window（瀏覽器視窗）發出的，document 收不到；掛上和拿掉要傳同一個 handleResize
  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })

  // 【items 或欄數一變就自動重算】第 i 張放第 i % N 欄
  // 例：3 欄、7 張 A～G → [[A, D, G], [B, E], [C, F]]；之後第 8 張進第 1 欄，A～G 不動
  const columns = computed(() => {
    const n = columnCount.value
    // n 個「各自獨立」的空陣列（不能用 fill([])，那會是同一個陣列放 n 次）
    const result: T[][] = Array.from({ length: n }, () => [])
    items.value.forEach((item, i) => {
      // ?.：專案開了 noUncheckedIndexedAccess，取 result[某數] 可能是 undefined
      result[i % n]?.push(item)
    })
    return result
  })

  // 交給頁面：columns 給模板的兩層 v-for
  return { columns }
}
