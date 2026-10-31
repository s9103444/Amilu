<template>
  <div class="layout">
    <div class="content-layout">
      <!-- 左邊圓圈：完成是黑底白勾，還沒完成是灰框數字 -->
      <div class="text-caption circle" :class="{ 'circle--done': done }">
        <img v-if="done" :src="base + 'icons/check-white-sm.svg'" alt="" />
        <span v-else>{{ number }}</span>
      </div>
      <div class="step-title-content">
        <div class="step-title text-title">
          <!-- Step 和編號中間沒有空白，編號和標題中間是全形空白，照 Figma -->
          <span>Step{{ number }}　{{ title }}</span>
          <StepStatusTag :done="done" />
        </div>
        <span v-if="note" class="text-small note">{{ note }}</span>
      </div>
    </div>
    <!-- 只往外通知「被點了」，要去哪裡由頁面依 step key 決定 -->
    <Button
      size="sm"
      width="hug"
      :variant="done ? 'outline' : 'primary'"
      class="action"
      @click="emit('action')"
    >
      {{ done ? '修改' : '前往填寫' }}
    </Button>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：開通清單的一步（features.md 3.4），由清單卡用 ACTIVATION_STEPS 跑 v-for 組出三列
done 決定三件事：左邊數字或打勾、狀態標籤、按鈕文字與樣式
範例：
使用前先 import：import ActivationStepsItem from '@/features/profile/components/ActivationStepsItem.vue'
<ActivationStepsItem :number="2" title="接案設定" note="填寫收款帳戶…" :done="false" @action="..." />
*/
import StepStatusTag from '@/features/profile/components/StepStatusTag.vue'
import Button from '@/shared/components/Button.vue'

defineProps<{
  number: number // 第幾步
  title: string // 例如「手機驗證」，前面的「Step1」由元件拼
  note?: string // 標題下方的說明，沒有就整行不顯示
  done: boolean // 這一步完成了沒
}>()
const emit = defineEmits<{
  action: [] // 按鈕被點了
}>()

const base = import.meta.env.BASE_URL
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  justify-content: space-between;
  align-items: center; // 不寫的話預設是 stretch，按鈕會被拉成跟左邊一樣高，padding 看起來就像沒作用
  gap: 16px; // 前端自訂：說明文字很長時，不會貼到按鈕
  width: 100%;
}

.content-layout {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
  min-width: 0; // 讓說明文字可以換行，不把按鈕擠出去
}

// 圓圈共用的大小與置中；兩種狀態只差在框和底色
.circle {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border: 1.5px solid var(--color-checkbox-border);
  border-radius: 50%;
  color: var(--color-text-secondary);
}

.circle--done {
  border: none;
  background-color: var(--color-bg-inverse);
}

.step-title-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 4px;
  min-width: 0;
}

.step-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px; // 換行後上下 4px，同一行左右 8px
}

.note {
  color: var(--color-text-secondary);
}

// 按鈕維持自己的寬度，不被左邊的長文字壓扁（只調排版，不改按鈕外觀）
.action {
  flex-shrink: 0;
}
</style>
