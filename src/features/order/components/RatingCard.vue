<template>
  <div class="rating-card">
    <span class="text-body rate-title">為{{ target }}評分</span>
    <div class="rate-row">
      <!-- 星星和按鈕之間距 24、星星之間距 8，所以星星另外包一層 -->
      <div class="stars">
        <button
          v-for="star in 5"
          :key="star"
          type="button"
          class="star"
          :aria-label="`${star} 星`"
          @click="starOnClick(star)"
        >
          <img
            class="star-icon"
            :src="base + (star <= starCount ? 'icons/star-filled.svg' : 'icons/star-empty.svg')"
            alt=""
          />
        </button>
      </div>
      <Button width="hug" :disabled="starCount === 0" @click="sendStarRate()">送出評價</Button>
    </div>
    <span class="text-small note"
      >只評分數、不留文字；每個案件各評一次。沒評分視為「無評論」，不計入平均。</span
    >
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：評分卡（Figma 617:612），放在結案畫面結算卡下方（features.md 4.5、5.1）
雙向評分：委託人評創作者、創作者評委託人，標題由 rateFor 組出來，頁面不用傳文字
點第 n 顆星＝選 n 星（1～5，沒有 0 星）。選幾星由卡片自己記，按「送出評價」才 emit submit 把分數交給頁面，
頁面再送後端，存進 ORDER.rating_for_creator 或 rating_for_commissioner。還沒選星時按鈕不能按
（不評分＝「無評論」，不送出就好）
範例：
使用前先 import：import RatingCard from '@/features/order/components/RatingCard.vue'
<RatingCard rate-for="creator" @submit="onRate" />   ---> 委託人看到「為創作者評分」
<RatingCard rate-for="commissioner" @submit="onRate" />   ---> 創作者看到「為委託人評分」
還沒做：送出後的樣子（每個案件各評一次），Figma 沒畫
*/
import { computed, ref } from 'vue'
import Button from '@/shared/components/Button.vue'
const base = import.meta.env.BASE_URL
const starCount = ref(0)
const emit = defineEmits<{
  submit: [score: number]
}>()

const props = defineProps<{
  rateFor: 'creator' | 'commissioner'
}>()

const target = computed(() => {
  if (props.rateFor === 'creator') {
    return '創作者'
  }
  return '委託人'
})

function starOnClick(star: number) {
  starCount.value = star
}

function sendStarRate() {
  if (starCount.value <= 0) {
    return
  }
  emit('submit', starCount.value)
}
</script>

<style lang="scss" scoped>
// 卡片：淺灰底、內距 24、圓角 16，各塊間距 12（Figma 617:612）。寬度由外面決定
.rating-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  background: var(--color-bg-subtle);
}

// .text-body 是 regular，Figma 的標題是 medium
.rate-title {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

// 星星＋送出按鈕，間距 24；太窄時按鈕換到下一行
.rate-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}

// 五顆星，間距 8（Figma 每顆 28px、相鄰中心差 36px）
.stars {
  display: flex;
  gap: 8px;
}

// 拿掉按鈕原生的框、底色、內距，只剩星星圖
.star {
  display: flex;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

// 用鍵盤移到星星時顯示外框（同 PaymentPlanCard）
.star:focus-visible {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

.star-icon {
  width: 28px;
  height: 28px;
}

.note {
  color: var(--color-text-secondary);
}
</style>
