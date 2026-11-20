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
        <!-- 簡介沒填（null）就整段不顯示 -->
        <p v-if="profile.bio" class="text-small bio">{{ profile.bio }}</p>
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
    </section>
    <section>
      <TabBar
        v-model="tab"
        :items="[
          { value: 'works', label: '作品牆' },
          { value: 'commissions', label: '可委託項目' },
        ]"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ProfileAuthor } from '@/features/explore/types'
import { fetchAuthorProfile } from '@/features/explore/api'
import EmptyState from '@/shared/components/EmptyState.vue'
import Button from '@/shared/components/Button.vue'
import OpenStatusTag from '@/features/explore/components/OpenStatusTag.vue'
import { DEFAULT_AVATAR_URL } from '@/shared/constants'
import TabBar from '@/shared/components/TabBar.vue'
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

// 圖示用 :src 綁定，Vite 不會自動補 base，要自己接（BASE_URL 結尾已經有 /）
const base = import.meta.env.BASE_URL

// 【流程①：頁面打開（immediate）、網址的 userId 改變時觸發】拿這個人的資料
// 不用 onMounted：從 /users/A 換到 /users/B 時 Vue Router 沿用同一個元件，onMounted 不會再跑
watch(
  userId,
  async () => {
    isLoading.value = true // 開始等
    profile.value = await fetchAuthorProfile(userId.value) // 停在這裡，資料回來才往下
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

// 星星右邊的字：有評分顯示一位小數（4 → 4.0），沒有就顯示「尚無評分」
const ratingText = computed(() => {
  const average = profile.value?.average_score
  return average == null ? '尚無評分' : average.toFixed(1)
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
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

// 整頁：麵包屑和下面的區塊之間 40（Figma 569:3322）；左右留白由 DefaultLayout 的 container 給
.profile-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
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
// 手機：直排（Figma 只畫桌機，前端自訂）；平板以上照 Figma 橫排，三塊之間 32
.profile-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  @include bp.tablet-up {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--space-4);
  }
}

// 大頭照 140，圓角方形（全站頭像統一 --radius-avatar，Figma 為 24px）
.avatar {
  flex-shrink: 0;
  width: 140px;
  height: 140px;
  border-radius: var(--radius-avatar);
  object-fit: cover;
  background-color: var(--color-bg-main); // 圖還沒載入時的底色
}

.info-head-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

// 介紹：吃掉中間剩下的寬度；各列之間 12（Figma 569:3326）
.intro {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-width: 0; // flex 子元素預設不會比內容窄，長暱稱會把右邊追蹤數擠出去
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
// 簡介最寬 720（Figma 569:3332）
.bio {
  max-width: 720px;
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
  display: block;
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

// 追蹤數：兩組之間 40，數字靠右對齊（Figma 569:3348）
.follow-counts {
  display: flex;
  flex-shrink: 0;
  gap: var(--space-5);
}
.count {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @include bp.tablet-up {
    align-items: flex-end;
  }
}
.count-label {
  color: var(--color-text-secondary);
}
.count-value {
  color: var(--color-text-primary);
}
</style>
