<template>
  <div>
    <div>
      <div><img :src="userImgUrl" alt="" /></div>
      <div>
        <span class="text-caption">{{ userName }}</span>
        <span class="text-small">{{ userId }}</span>
      </div>
    </div>
    <div class="text-small">
      <span>{{ uploadTimeStamp }}</span>
      <span>{{ currentStage }}階段</span>
    </div>
  </div>
  <div></div>
</template>

<script setup lang="ts">
import { STAGE_LABEL } from '@/features/order/stageLabel'
import type { StageNo } from '@/features/order/types'
defineProps<{
  userImgUrl: string
  userName: string
  userId: string
  uploadTimeStamp: string
  currentStage: StageNo
  uploadImageUrl: string[]
  isClosed: boolean
}>()
defineEmits<{
  modRequest: []
  stageComfirm: []
}>()
</script>

<style lang="scss" scoped></style>
