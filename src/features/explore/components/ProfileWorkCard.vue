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

    <CardMoreMenu
      v-if="showMoreMenu"
      class="card-more"
      @edit="emit('edit')"
      @delete="emit('delete')"
    />
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：個人頁作品卡（Figma 568:217），個人專頁「作品」／「可委託項目」分頁的卡片
範例：
使用前先 import：import ProfileWorkCard from '@/features/explore/components/ProfileWorkCard.vue'
<ProfileWorkCard :image-url="work.image" title="作品標題" category="作品類型・用途" @select="開啟燈箱" @edit="開上傳燈箱" @delete="開確認燈箱" />
<ProfileWorkCard ... :show-more-menu="false" />  ---> 看別人的專頁時，關掉右下的「⋯」
寬度跟著外層；圖片高度固定 188px。
image-url 要傳完整網址：src/assets/ 的圖用 import 拿（Vite 會給含 base 的網址）。
事件：
  select  點圖片或文字（開啟作品燈箱或委託商店燈箱）
  edit    「⋯」選單點「編輯」（選單是 CardMoreMenu，這裡只轉傳）
  delete  「⋯」選單點「刪除」
*/
import CardMoreMenu from '@/features/explore/components/CardMoreMenu.vue'
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
  edit: []
  delete: []
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

// 「⋯」選單：貼在卡片右下、文字列旁邊（Figma）；class 會落到 CardMoreMenu 的根元素上
// 取名 card-more 不叫 more-menu：CardMoreMenu 自己的根元素已經用了 .more-menu（position: relative），同名會互相蓋
// absolute 一樣能當選單面板的定位基準，面板照樣浮在「⋯」正下方
.card-more {
  position: absolute;
  right: 0;
  bottom: 0;
}

// Figma 沒畫 hover，前端自訂：同 CategoryCard 只放大圖片
@media (hover: hover) {
  .main:hover .image {
    transform: scale(1.1);
  }
}
</style>
