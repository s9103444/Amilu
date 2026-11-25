<template>
  <div class="profile-page">
    <p class="text-small breadcrumb">首頁／個人專頁</p>

    <!-- 三選一，順序不能換：先看是不是還在等，等完了才判斷找到沒（profile 是 null 有兩種意思） -->
    <!-- ① 還在等資料 -->
    <div v-if="isLoading" class="text-small loading"><span>載入中...</span></div>

    <!-- ② 等完了但找不到這個人 -->
    <EmptyState
      v-else-if="profile === null"
      icon="icons/user.svg"
      title="目前查無此用戶"
      description="再找找其他夥伴"
    >
      <template #action><Button @click="router.push('/')">回到首頁</Button></template>
    </EmptyState>

    <!-- ③ 找到了：上方個人資訊區（Figma 569:3324）＝ 大頭照｜介紹｜追蹤數 -->
    <section v-else class="profile-header">
      <div class="intro-with-pic">
        <img class="avatar" :src="profile.avatar_url ?? DEFAULT_AVATAR_URL" alt="" />
        <div class="intro">
          <div class="info-head-content">
            <div class="name-row">
              <h1 class="text-h3 name">{{ profile.nickname }}</h1>
              <!-- 沒開通商店的人不是創作者，不顯示接案狀態（同燈箱 LightboxLayout） -->
              <OpenStatusTag v-if="profile.store_approved" :open="profile.is_open" />
            </div>
            <p class="text-small user-id">@{{ profile.id }}</p>
            <!-- 合作評分（features.md 2.7）：空星墊底，滿星疊上去；半顆用 clip-path 切掉滿星的右半 -->
            <div class="rating">
              <span class="text-note rating-label">合作評分</span>
              <span class="stars">
                <span v-for="(star, index) in stars" :key="index" class="star">
                  <img :src="base + 'icons/rating-star-empty.svg'" alt="" />
                  <img
                    v-if="star !== 'empty'"
                    class="star-fill"
                    :class="{ 'star-fill--half': star === 'half' }"
                    :src="base + 'icons/rating-star.svg'"
                    alt=""
                  />
                </span>
              </span>
              <span class="text-note rating-value">{{ ratingText }}</span>
            </div>
          </div>
        </div>
        <!-- 追蹤數：之後點了要開追蹤清單燈箱（features.md 2.8），燈箱還沒做，先只顯示數字 -->
        <div class="follow-counts">
          <div class="count">
            <span class="text-note count-label">followers</span>
            <span class="text-h3 count-value">{{ profile.follower_num }}</span>
          </div>
          <div class="count">
            <span class="text-note count-label">following</span>
            <span class="text-h3 count-value">{{ profile.following_num }}</span>
          </div>
        </div>
      </div>
      <!-- 簡介沒填（null）就整段不顯示 -->
      <p v-if="profile.bio" class="text-small bio">{{ profile.bio }}</p>
    </section>
    <!-- 下方頁籤＋卡片：和上方個人資訊區一樣，等完了而且找到人才顯示 -->
    <!-- 不擋的話：找不到人時頁籤會出現在 EmptyState 下面；從 A 換到 B 的等待期間會殘留 A 的作品 -->
    <template v-if="!isLoading && profile !== null">
      <section class="bar-section">
        <Button
          v-if="isMeUser"
          class="btn-upload"
          width="hug"
          variant="secondary"
          size="sm"
          @click="isUploadOpen = true"
          >{{ tab === 'works' ? '上傳作品 +' : '上傳委託 +' }}</Button
        >
        <TabBar
          v-model="tab"
          :items="[
            { value: 'works', label: '作品牆' },
            { value: 'commissions', label: '可委託項目' },
          ]"
        />
      </section>
      <!-- 作品牆二選一：有作品顯示卡片，0 件顯示空狀態（works 是 [] 不是 null，見 fetchProfileWorks） -->
      <section v-if="tab === 'works' && works.length > 0" class="card-layout">
        <!-- 【「⋯」點刪除時】記住是哪張（deletingCard 有值＝確認燈箱打開） -->
        <!-- 【流程①：「⋯」點編輯時】記住是哪件（editingId）＋打開上傳燈箱，燈箱拿到 work-id 就是編輯模式 -->
        <ProfileWorkCard
          v-for="work in works"
          :key="work.id"
          :image-url="work.cover_url"
          :title="work.title"
          :category="work.category_label"
          @select="openCard(work)"
          :show-more-menu="isMeUser"
          @delete="deletingCard = work"
          @edit="((editingId = work.id), (isUploadOpen = true))"
        />
      </section>
      <section v-else-if="tab === 'works'">
        <EmptyState icon="icons/store.svg" title="暫無更新內容" description="用戶尚未更新其他作品">
        </EmptyState>
      </section>
      <!-- 可委託項目二選一：同作品牆；卡片第二行多了價錢（見 fetchProfileCommissionItems） -->
      <section v-else-if="tab === 'commissions' && commissionItems.length > 0" class="card-layout">
        <!-- 【「⋯」點刪除時】記住是哪張（deletingCard 有值＝確認燈箱打開） -->
        <!-- 【流程①：「⋯」點編輯時】同作品牆：記住是哪個項目＋打開上傳燈箱 -->
        <ProfileWorkCard
          v-for="item in commissionItems"
          :key="item.id"
          :image-url="item.cover_url"
          :title="item.title"
          :category="item.category_label"
          @select="openCard(item)"
          :show-more-menu="isMeUser"
          @delete="deletingCard = item"
          @edit="((editingId = item.id), (isUploadOpen = true))"
        />
      </section>
      <section v-else-if="tab === 'commissions'">
        <EmptyState
          icon="icons/store.svg"
          title="暫無可委託項目"
          description="用戶尚未上架可委託項目"
        >
        </EmptyState>
      </section>
      <!-- 燈箱沒有網址，用狀態打開（structure.md）：值有東西＝開著，清空＝關掉 -->
      <WorkLightbox
        v-if="openedWorkId"
        :work-id="openedWorkId"
        @close="openedWorkId = null"
        @open-shop="openShopFromWork"
      />
      <CommissionShopLightbox
        v-if="shopCreatorId"
        :creator-id="shopCreatorId"
        :item-id="shopItemId"
        @close="shopCreatorId = null"
      />
      <!-- 【「⋯」點刪除後】deletingCard 有值就打開；一個就夠，作品和可委託項目共用 -->
      <!-- TODO 確認刪除：作品的刪除 API 還沒定（progress.md「做到再處理」），先只關燈箱 -->
      <DeleteConfirmLightbox
        v-if="deletingCard"
        :title="deletingCard.title"
        @close="deletingCard = null"
        @confirm="deletingCard = null"
      />
      <!-- 【按「上傳作品 +」後】依目前頁籤開不同燈箱：作品牆 → 一般作品、可委託項目 → 委託項目 -->
      <!-- 燈箱開著時蓋住整頁、切不了頁籤，所以打開後 tab 不會變；profile 的燈箱可以在這裡用（structure.md 例外二） -->
      <!-- 【上傳燈箱存好、送出 submit 時】onUploaded 關燈箱＋重抓卡片，新作品才會出現在牆上 -->
      <UploadWorkLightbox
        v-if="isUploadOpen && tab === 'works'"
        :work-id="editingId ?? undefined"
        @close="closeUpload"
        @submit="onUploaded"
      />
      <CommissionItemLightbox
        v-else-if="isUploadOpen && tab === 'commissions'"
        :item-id="editingId ?? undefined"
        @close="closeUpload"
        @submit="onUploaded"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ProfileAuthor } from '@/features/explore/types'
import {
  fetchAuthorProfile,
  fetchProfileWorks,
  fetchProfileCommissionItems,
  type ProfileCard,
} from '@/features/explore/api'
import EmptyState from '@/shared/components/EmptyState.vue'
import Button from '@/shared/components/Button.vue'
import OpenStatusTag from '@/features/explore/components/OpenStatusTag.vue'
import { DEFAULT_AVATAR_URL } from '@/shared/constants'
import TabBar from '@/shared/components/TabBar.vue'
import ProfileWorkCard from '@/features/explore/components/ProfileWorkCard.vue'
import WorkLightbox from '@/features/explore/components/WorkLightbox.vue'
import CommissionShopLightbox from '@/features/explore/components/CommissionShopLightbox.vue'
import { useAuthStore } from '@/features/account/store'
import DeleteConfirmLightbox from '@/features/explore/components/DeleteConfirmLightbox.vue'
import UploadWorkLightbox from '@/features/profile/components/UploadWorkLightbox.vue'
import CommissionItemLightbox from '@/features/profile/components/CommissionItemLightbox.vue'
/*
頁面：創作者個人頁（/users/:userId，Figma 569:3298，features.md 2.7）
誰的專頁都用這一頁；看的是誰，由網址的 :userId 決定
*/
const route = useRoute() // 讀現在的網址
const router = useRouter() // 換頁（找不到人時的「回到首頁」）
// 網址上的 :userId；params 的型別是 string | string[]，這個路由只會是一段，用 String() 轉成字串
const userId = computed(() => String(route.params.userId))
const profile = ref<ProfileAuthor | null>(null) // 上方個人資訊區的資料；null ＝ 還沒拿到，或找不到這個人
const isLoading = ref(true) // 正在等資料；用來分辨 profile 是 null 時，是「還在等」還是「找不到」
const works = ref<ProfileCard[]>([]) // 「作品牆」分頁的卡片資料
const commissionItems = ref<ProfileCard[]>([]) // 「可委託項目」分頁的卡片資料

// ── 燈箱 ──
// 開著哪件作品的燈箱（work_id）；null＝沒開
const openedWorkId = ref<string | null>(null)
// 開著哪位創作者的委託商店（帳號 ID）；null＝沒開。shopItemId：要預先展開的項目，沒有就 undefined
const shopCreatorId = ref<string | null>(null)
const shopItemId = ref<string | undefined>(undefined)
// 圖示用 :src 綁定，Vite 不會自動補 base，要自己接（BASE_URL 結尾已經有 /）
const base = import.meta.env.BASE_URL
const auth = useAuthStore() // 登入者（唯讀，structure.md 例外）；不要先取出 currentUser，見 isMeUser
const deletingCard = ref<ProfileCard | null>(null)
// 「⋯ → 編輯」的是哪件作品或哪個項目（看 tab）；null ＝ 從「上傳作品 +」打開（新增）
const editingId = ref<string | null>(null)

// 【流程①：頁面打開（immediate）、網址的 userId 改變時觸發】拿這個人的資料
// 不用 onMounted：從 /users/A 換到 /users/B 時 Vue Router 沿用同一個元件，onMounted 不會再跑
watch(
  userId,
  async () => {
    isLoading.value = true // 開始等
    profile.value = await fetchAuthorProfile(userId.value) // 停在這裡，資料回來才往下
    works.value = await fetchProfileWorks(userId.value) // 下方作品牆的卡片，同一個時機拿，換人時才不會留著上一個人的作品
    commissionItems.value = await fetchProfileCommissionItems(userId.value) // 可委託項目的卡片，理由同上
    isLoading.value = false // 等完了：profile 有值＝找到，null＝找不到
  },
  { immediate: true },
)

// 【流程②：profile 拿到後自動算】5 顆星各是什麼（規則見 features.md 2.7）
// 例：4.3 → 4 全＋1 半；4.8 → 5 全；4.2 → 4 全；沒有評分（null）→ 5 顆空星
type Star = 'full' | 'half' | 'empty'
const stars = computed<Star[]>(() => {
  const average = profile.value?.average_score ?? 0
  const whole = Math.floor(average) // 整數部分
  // 小數第一位（0～9）；用 Math.round 是因為 4.3 - 4 實際是 0.2999…，直接 ×10 取整會變 2
  const tenth = Math.round((average - whole) * 10)
  const fullCount = tenth >= 8 ? whole + 1 : whole // ≥ 0.8 直接算一整顆
  const hasHalf = tenth >= 3 && tenth < 8 // 0.3～0.7 加半顆
  return Array.from({ length: 5 }, (_, index) => {
    if (index < fullCount) return 'full'
    if (index === fullCount && hasHalf) return 'half'
    return 'empty'
  })
})

// 星星右邊的字：有評分顯示一位小數（4 → 4.0），沒有就顯示「無」
const ratingText = computed(() => {
  const average = profile.value?.average_score
  return average == null ? '(0)' : average.toFixed(1)
})

// 下方頁籤：值從網址 ?tab= 讀，改的時候也改網址（同 OrderManagementPage）
// ⚠️ 2026/11/20 討論過改成 const tab = ref('works') 的簡單版（重新整理會回到作品牆），還沒決定
// ⚠️ spec/structure.md 3.5 寫的是 ?tab=items，這裡用 commissions，兩邊要統一
const tab = computed({
  // 【流程①：頁面打開、網址改變時觸發】網址寫 commissions 才是可委託項目，其他（沒寫、亂寫）都當作品牆
  get: () => (route.query.tab === 'commissions' ? 'commissions' : 'works'),
  // 【流程③：流程②之後觸發】用 replace 不用 push：切頁籤不多一筆瀏覽紀錄，按上一頁直接離開本頁
  // 改完網址會再觸發流程①，TabBar 就換亮新的那顆
  set: (value) => router.replace({ query: { tab: value } }),
})

// 【流程④：點作品牆或可委託項目的卡片時，模板呼叫】
// 看現在在哪個分頁就知道點的是什麼：作品開作品燈箱；項目開這位創作者（＝這一頁的人）的委託商店，並預先展開被點的那筆
// shopCreatorId 最後設：它一有值燈箱的 v-if 就成立，shopItemId 要先準備好
function openCard(card: ProfileCard) {
  if (tab.value === 'works') {
    openedWorkId.value = card.id
  } else {
    shopItemId.value = card.id
    shopCreatorId.value = userId.value
  }
}
// 【流程⑤：作品燈箱點「查看可委託項目」時】關掉作品燈箱，改開這位作者的委託商店（不預選項目）
function openShopFromWork(creatorId: string) {
  openedWorkId.value = null
  shopItemId.value = undefined
  shopCreatorId.value = creatorId
}

// 【流程①之後自動算】看的是不是自己的頁：自己的頁卡片才有「⋯」（features.md 2.7）
// 在 computed 裡才讀 auth.currentUser：在外面先取出來只會拿到當下那一份，之後切換登入身份或登出不會跟著變
const isMeUser = computed(() => auth.currentUser?.id === userId.value)
// 上傳燈箱開著沒（燈箱沒有網址，用狀態打開）；開哪一個看 tab
const isUploadOpen = ref(false)

// 【上傳燈箱關閉、送出時觸發】兩個一起重設：editingId 沒清掉的話，下次按「上傳作品 +」會開成上一次編輯的那件
function closeUpload() {
  isUploadOpen.value = false
  editingId.value = null
}
// 【上傳燈箱存好、送出 submit 時觸發】先關燈箱，再重抓兩面牆（作品、可委託項目都抓，兩個燈箱共用這支）
async function onUploaded() {
  closeUpload()
  works.value = await fetchProfileWorks(userId.value)
  commissionItems.value = await fetchProfileCommissionItems(userId.value)
}
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

// 整頁：麵包屑和下面的區塊之間 40（Figma 569:3322）；左右留白由 DefaultLayout 的 container 給
.profile-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-bottom: var(--space-3);
}

.breadcrumb {
  margin: 0;
  color: var(--color-text-secondary);
}

// 載入中：給固定高度，資料回來換成正常畫面時頁尾不會跳太多
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: var(--color-text-secondary);
}

// ── 上方個人資訊區 ──
// 字級全部比 Figma 小一階，對齊首頁和其他頁的比例（同 OrderCard、燈箱的做法）：
//   暱稱 h2→h3、@id caption→small、簡介 body→caption、評分 small→note、追蹤數 small→note／h2→h3
// 上下兩塊：大頭照＋介紹＋追蹤數一列，簡介在下面；不分尺寸都直排，之間 32
.profile-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: 24px;
}

.intro-with-pic {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-3);
}

// 大頭照 100（Figma 140，彥廷調整），圓角方形（全站頭像統一 --radius-avatar，Figma 為 24px）
.avatar {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: var(--radius-avatar);
  object-fit: cover;
  background-color: var(--color-bg-main); // 圖還沒載入時的底色
  margin-block: auto;
}

// 介紹：吃掉中間剩下的寬度（Figma 569:3326）
.intro {
  flex: 1;
}

// 名稱列：暱稱和接案狀態標籤之間 16
.name-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1);
}

.name,
.user-id,
.bio {
  margin: 0;
}
.name {
  color: var(--color-text-primary);
  overflow-wrap: anywhere; // 沒有空格的長暱稱也能換行
}
.user-id {
  color: var(--color-text-secondary);
}
// 簡介最寬 600（Figma 569:3332 是 720，彥廷調整）
.bio {
  max-width: 600px;
  color: var(--color-text-primary);
  font-weight: var(--font-weight-regular); // text-small 預設 medium，簡介是大段內文，改一般粗細
  white-space: pre-line; // 保留使用者自己打的換行
}

// 合作評分：標籤、星星、分數之間 8；星星之間 2（Figma 569:3334）
.rating {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-top: 6px;
}
.rating-label {
  color: var(--color-text-secondary);
}
.rating-value {
  color: var(--color-text-primary);
}
.stars {
  display: flex;
  gap: 2px;
}

// 每顆星 16×16（Figma 20，字縮成 note 後跟著縮）；空星在下面撐出大小，滿星用 absolute 疊在同一個位置
.star {
  position: relative; // 滿星以這顆星為定位基準
  width: 16px;
  height: 16px;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.star-fill {
  position: absolute;
  inset: 0;
}
// 半顆：切掉滿星的右半邊，露出底下空星的右半
.star-fill--half {
  clip-path: inset(0 50% 0 0);
}

// 追蹤數：兩組之間 24，每組數字在上、標籤在下、靠左對齊（Figma 569:3348）
.follow-counts {
  display: flex;
  flex-shrink: 0;
  gap: var(--space-3);
}
.count {
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
}
.count-label {
  color: var(--color-text-secondary);
}
.count-value {
  color: var(--color-text-primary);
}
// 欄寬用 minmax(0, 1fr) 不用 1fr：1fr 的最小值是「內容不換行的寬度」，
// 標題 nowrap 太長時會把那一欄撐寬，卡片寬度不一、標題也不會變成「…」
.card-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)); // 手機一排 2 張
  gap: 20px;

  @include bp.tablet-up {
    grid-template-columns: repeat(3, minmax(0, 1fr)); // 平板以上一排幾張，看 Figma
  }
  @include bp.desktop-up {
    grid-template-columns: repeat(4, minmax(0, 1fr)); // 桌機一排 4 張
  }
}
.bar-section {
  margin-top: -30px;
}
.btn-upload {
  position: relative;
  top: 28px;
  margin-left: auto;
}
</style>
