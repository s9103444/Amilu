<template>
  <div class="layout">
    <!-- 左（手機在上）：圖片垂直捲動 -->
    <div class="media">
      <ImageScrollList
        :images="images"
        :start-index="startIndex"
        @index-change="(index) => emit('index-change', index)"
      />
    </div>
    <!-- 右（手機在下）：作者列固定在上、中間內容可捲、按鈕固定在下 -->
    <div class="detail">
      <div v-if="author" class="author-row">
        <div class="author">
          <UserInfoBar
            :avatar-url="author.avatar_url"
            :name="author.nickname"
            :user-id="author.id"
          />
          <!-- 不是創作者就沒有 Amilu 燈可看，不顯示 -->
          <OpenStatusTag v-if="author.store_approved" :open="author.is_open" />
        </div>
        <!-- 追蹤先只記在畫面上（FOLLOW 還沒有 mock／API，features.md 2.8 做到再接） -->
        <!-- xs：Figma 燈箱的 Follow（522:1211）是 4px 20px、圓角 12、字級 small，同追蹤使用者列 -->
        <FollowButton
          class="follow"
          size="xs"
          :followed="isFollowed"
          @click="isFollowed = !isFollowed"
        />
      </div>
      <div class="content">
        <slot></slot>
      </div>
      <div v-if="$slots.action" class="action">
        <slot name="action"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：燈箱內容的左右版型（作品燈箱、委託商店燈箱共用，features.md 2.5、2.6）
放在 shared 的 Lightbox 外框裡面用；這裡負責左圖右文、作者列、追蹤按鈕
範例：
<Lightbox @close="...">
  <LightboxLayout :images="images" :author="author">
    中間內容（可捲動）
    <template #action><Button>我要委託</Button></template>  ---> 固定在右欄最下面
  </LightboxLayout>
</Lightbox>
author 還沒載入時傳 null，作者列先不顯示
start-index：左側圖片停在第幾張（從 0 算，換值會捲過去），原樣轉給 ImageScrollList；委託商店燈箱用，作品燈箱不傳＝從第一張開始（features.md 2.6）
index-change：ImageScrollList 換張時送出（帶第幾張），這裡只負責轉傳；委託商店燈箱用來換右側選取，作品燈箱不聽
*/
import { ref } from 'vue'
import ImageScrollList from '@/features/explore/components/ImageScrollList.vue'
import UserInfoBar from '@/features/explore/components/UserInfoBar.vue'
import OpenStatusTag from '@/features/explore/components/OpenStatusTag.vue'
import FollowButton from '@/shared/components/FollowButton.vue'
import type { LightboxAuthor } from '@/features/explore/types'

defineProps<{
  images: string[]
  author: LightboxAuthor | null
  startIndex?: number
}>()
const emit = defineEmits<{ 'index-change': [index: number] }>()

const isFollowed = ref(false)
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

// 手機：上圖下文；平板以上：左圖右文（Figma 521:1065）。高度吃滿外框，捲動在各區裡面
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;

  @include bp.tablet-up {
    flex-direction: row;
  }
}

// 圖片區：手機佔上方 45%（Figma 沒畫手機，前端自訂）；平板以上吃掉剩下的寬度，最寬 800
.media {
  flex: 0 0 45%;
  min-height: 0;
  padding: var(--space-2);
  background: var(--color-bg-lightbox-media);

  @include bp.tablet-up {
    flex: 1;
    min-width: 0;
    max-width: 800px;
    padding: var(--space-3);
  }
}

// 資訊區：手機吃掉下方剩下的高度；平板以上固定寬（桌機 Figma 400）
// 不能叫 .info：UserInfoBar 的根元素也叫 .info，scoped 樣式會套到子元件的根元素上，頭像就被排成直的
// 上方留位置給外框的 ✕（Figma：距上 24＋✕ 12＋下方 12＋間距 10 ＝ 58）
.detail {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  padding: var(--space-2) var(--space-2) var(--space-3);

  @include bp.tablet-up {
    flex: 0 0 340px;
    padding: 58px var(--space-3) var(--space-5);
  }

  @include bp.desktop-up {
    flex-basis: 400px;
    padding-inline: var(--space-4);
  }
}

// 作者列：左邊作者＋接案狀態，右邊追蹤；太窄時追蹤換到下一行
// 手機的 ✕ 疊在圖片右上角，作者列右邊留位置也不會被蓋到
.author-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 10px var(--space-1);
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

// Follow 再縮一點（彥廷調整）：字 12、左右 14
// 前面加 .author-row 提高權重，才蓋得過 FollowButton 自己的 .btn--xs 與 .text-small
.author-row .follow {
  padding-inline: 14px;
  font-size: var(--fs-follow-lightbox);
}

// 中間內容：超出就在這裡捲，作者列和按鈕不動
// 捲動區會裁掉超出的東西：委託項目選取時右上角的勾勾凸出框外 7px，
// 所以四周多留 8px 內距，再用負 margin 抵銷，排版位置不變
.content {
  display: flex;
  margin: -8px;
  padding: 8px;
  flex: 1;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  overflow-y: auto;
}

.action {
  flex-shrink: 0;
}
</style>
