<template>
  <button type="button" :style="{ '--card-image': 'url(' + imageUrl + ')' }" class="card text-body">
    <span class="option-title">{{ name }}</span>
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：類型圖卡（Figma 496:1472），首頁類型下拉面板裡的前 6 項
範例：
使用前先 import：import CategoryCard from '@/features/explore/components/CategoryCard.vue'
<CategoryCard name="角色立繪" :image-url="characterArtImg" /> ---> 背景圖＋半透明遮罩＋置中白字
寬度跟著外層（100%），由面板的 grid 決定；高度固定 100px。
image-url 要傳完整網址：src/assets/ 的圖用 import 拿（Vite 會給含 base 的網址），卡片本身不接 BASE_URL。
點擊事件由使用的地方加 @click。
*/
defineProps<{
  name: string // 卡片上的文字（類型名稱）
  imageUrl: string // 背景圖網址
}>()
</script>

<style lang="scss" scoped>
// 類型圖卡（Figma 496:1472）：背景圖＋置中白字。
// 圖片網址由 props 傳入，模板把它存成 CSS 變數 --card-image，再由 ::before 讀出來當背景
.card {
  cursor: pointer;
  position: relative; // ::before 以卡片為定位基準
  overflow: hidden; // hover 放大的圖超出圓角時切掉
  display: flex;
  width: 100%;
  height: 100px;
  justify-content: center;
  align-items: center;
  border: none; // 清掉 button 預設框線
  padding: 0;
  border-radius: var(--radius-button);
  color: var(--color-text-on-dark);
  // 圖片還沒載入時先顯示底色
  background-color: var(--color-bg-main);
}
// 圖片圖層：鋪滿整張卡，hover 時只放大這一層，卡片外框不動
// 兩層背景，寫在前面的疊在上面：半透明遮罩（讓白字看得清楚）→ 圖片
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--color-overlay), var(--color-overlay)), var(--card-image);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transition: transform 0.2s ease;
}
// 文字要有 position 才會疊在 ::before 上面（兩者都沒設 z-index 時照順序畫，::before 在前）
.option-title {
  position: relative;
}
@media (hover: hover) {
  .card:hover::before {
    transform: scale(1.1);
  }
}
</style>
