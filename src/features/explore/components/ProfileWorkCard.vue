<template>
  <div class="card">
    <!-- 圖片＋文字是一個可點區塊；「⋯」按鈕放在它旁邊，因為 button 裡不能再放 button -->
    <button type="button" class="main" @click="emit('select')">
      <span class="image-frame">
        <img class="image" :src="imageUrl" alt="" />
      </span>
      <span class="text">
        <span class="title text-caption">{{ title }}</span>
        <span class="category text-small">{{ category }}</span>
      </span>
    </button>
    <button v-if="showMoreMenu" type="button" class="more" aria-label="更多" @click="emit('more')">
      <img :src="base + 'icons/more.svg'" alt="" />
    </button>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：個人頁作品卡（Figma 568:217），個人專頁「作品」／「可委託項目」分頁的卡片
範例：
使用前先 import：import ProfileWorkCard from '@/features/explore/components/ProfileWorkCard.vue'
<ProfileWorkCard :image-url="work.image" title="作品標題" category="作品類型・用途" @select="開啟燈箱" @more="開啟編輯／刪除選單" />
<ProfileWorkCard ... :show-more-menu="false" />  ---> 看別人的專頁時，關掉右下的「⋯」
寬度跟著外層；圖片高度固定 188px。
image-url 要傳完整網址：src/assets/ 的圖用 import 拿（Vite 會給含 base 的網址）。
事件：
  select  點圖片或文字（開啟作品燈箱或委託商店燈箱）
  more    點右下的「⋯」（之後接編輯／刪除選單，選單面板不在這個元件裡）
*/
withDefaults(
  defineProps<{
    imageUrl: string // 作品圖網址
    title: string // 作品標題
    category: string // 作品類型・用途
    showMoreMenu?: boolean // 自己的專頁才顯示「⋯」
  }>(),
  { showMoreMenu: true },
)

const emit = defineEmits<{
  select: []
  more: []
}>()

// 圖示用 :src 綁定，Vite 不會自動補 base，要自己接（BASE_URL 結尾已經有 /）
const base = import.meta.env.BASE_URL
</script>

<style lang="scss" scoped>
.card {
  position: relative; // 「⋯」按鈕以卡片為定位基準
  width: 100%;
}

// 可點區塊：先蓋掉 button 的瀏覽器預設樣式
.main {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px; // 圖片與文字之間（Figma）
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  text-align: left;
}

// 圓角沿用 --radius-button（15px，Figma 為 16px），因為整張卡片也是按鈕（同 CategoryCard）
.image-frame {
  display: block;
  width: 100%;
  height: 188px;
  overflow: hidden; // hover 放大的圖超出圓角時切掉
  border-radius: var(--radius-button);
  // 圖片還沒載入時先顯示底色
  background-color: var(--color-bg-main);
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

// 右邊留 52px 給「⋯」（點擊範圍 44＋間距 8），文字太長時截斷
.text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding-right: 52px;
}
.title,
.category {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.title {
  color: var(--color-text-primary);
}
.category {
  color: var(--color-text-secondary);
}

// 「⋯」：點擊範圍 44px，圖示 18px；放在文字列的右上（Figma）
.more {
  cursor: pointer;
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: transparent;
}

// Figma 沒畫 hover，前端自訂：同 CategoryCard 只放大圖片
@media (hover: hover) {
  .main:hover .image {
    transform: scale(1.1);
  }
}
</style>
