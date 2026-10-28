<template>
  <button type="button" class="card">
    <span class="image-frame">
      <img class="image" :src="imageUrl" alt="" />
    </span>
    <UserInfoBar :avatar-url="authorAvatarUrl" :nickname="title" :user-id="authorId" />
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：瀑布流卡片（Figma 494:115），首頁／個人頁作品牆的一張作品
範例：
使用前先 import：import WorkCard from '@/features/explore/components/WorkCard.vue'
<WorkCard :image-url="work.image" title="作品名稱" author-id="im_temp_id" :author-avatar-url="author.avatar_url" @click="開啟作品燈箱" />
寬度跟著外層（作品牆的欄寬），圖片高度依作品本身的比例（瀑布流高低不一）。
image-url 要傳完整網址：src/assets/ 的圖用 import 拿（Vite 會給含 base 的網址），卡片本身不接 BASE_URL。
下方是組員的個人資訊條 UserInfoBar：粗體字放作品標題（Figma 寫「作品名稱」）、@ID 與頭像是作者。
authorId 傳帳號 ID 本身（不含 @）；沒有大頭照時傳 null 或不傳，會顯示預設圖。
點擊事件由使用的地方加 @click。
*/
import UserInfoBar from '@/features/explore/components/UserInfoBar.vue'

defineProps<{
  imageUrl: string // 作品圖網址
  title: string // 作品標題
  authorId: string // 作者帳號 ID（USER.id）
  authorAvatarUrl?: string | null // 作者大頭照
}>()
</script>

<style lang="scss" scoped>
// 先蓋掉 button 的瀏覽器預設樣式（灰底、框線、置中）
.card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 20px; // 圖片與資訊條之間（Figma）
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  text-align: left;
}

// 圓角沿用 --radius-button（15px，Figma 為 14px），因為整張卡片也是按鈕（同 CategoryCard）
// overflow: hidden 讓 hover 放大的圖不會超出圓角
.image-frame {
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-button);
  // 圖片還沒載入時先顯示底色
  background-color: var(--color-bg-main);
}

// 寬度撐滿、高度依圖片比例（Figma：圖片高度依作品比例調整）
.image {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.2s ease;
}

// Figma 沒畫 hover，前端自訂：同 CategoryCard 只放大圖片，卡片外框與文字不動
@media (hover: hover) {
  .card:hover .image {
    transform: scale(1.1);
  }
}
</style>
