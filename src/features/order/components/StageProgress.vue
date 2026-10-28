<template>
  <ol class="stage-progress">
    <li
      v-for="stage in stages"
      :key="stage"
      class="step"
      :aria-current="stage === current ? 'step' : undefined"
    >
      <img :src="nodeIcon(stage)" alt="" />
      <span class="text-small label" :class="{ 'label--current': stage === current }">
        {{ STAGE_LABEL[stage] }}
      </span>
    </li>
  </ol>
</template>

<script setup lang="ts">
/*
元件名稱：委託進度條（Figma 委託進度條 613:554，目前進行到哪一階段）
範例：
使用前先 import：import StageProgress from '@/features/order/components/StageProgress.vue'
<StageProgress :current="2" /> ---> 五點分段，目前在「線稿」
<StageProgress :stages="[1, 4, 5]" :current="4" /> ---> 三點分段（草稿、精稿、完稿），目前在「精稿」
目前階段是衍生值，由外面從 ORDER_STAGE 算好再傳 current，這裡不存、不判斷。
階段名稱由 stage_no 對照（features/order/stageLabel.ts）。三點分段的 stage_no 是 1／4／5，
Figma 只畫了五點，三點是照同樣畫法只畫 3 個節點（尚待設計確認，見 spec/open-questions.md）。
*/
import { STAGE_LABEL } from '@/features/order/stageLabel'
import type { StageNo } from '@/features/order/types'

const props = withDefaults(
  defineProps<{
    stages?: StageNo[]
    current: StageNo
  }>(),
  {
    stages: () => [1, 2, 3, 4, 5],
  },
)

// 圖示用 :src 綁定，Vite 不會自動補 base，要自己接（BASE_URL 結尾已經有 /）
const base = import.meta.env.BASE_URL

// 目前階段是大實心點，已完成的是小實心點，還沒到的是空心灰圈（不只靠顏色區分）
function nodeIcon(stage: StageNo) {
  if (stage === props.current) return base + 'icons/stage-node-current.svg'
  return stage < props.current
    ? base + 'icons/stage-node-done.svg'
    : base + 'icons/stage-node-todo.svg'
}
</script>

<style lang="scss" scoped>
.stage-progress {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

// 貫穿所有節點的軌道：左右各縮 14px（節點寬 28px 的一半），穿過節點中心
.stage-progress::before {
  content: '';
  position: absolute;
  top: 7px;
  right: 14px;
  left: 14px;
  height: 2px;
  background: var(--color-border);
}

.step {
  position: relative; // 蓋在軌道上面，空心節點的白底才會把軌道遮住
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  & > img {
    display: block;
    width: 28px;
    height: 16px;
  }
}

.label {
  color: var(--color-text-secondary);
  white-space: nowrap;
}

//-----目前階段-----//
.label--current {
  color: var(--color-text-primary);
}
</style>
