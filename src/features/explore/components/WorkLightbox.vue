<template>
  <Lightbox @close="emit('close')">
    <LightboxLayout :images="images" :author="author">
      <template v-if="work">
        <div class="work-content">
          <WorkInfo :title="work.title" :description="work.content" :tags="tags" />
        </div>
        <template v-if="author?.bio">
          <hr class="divider" />
          <CommissionRules title="作者簡介">{{ author.bio }}</CommissionRules>
        </template>
      </template>
      <!-- 作者已開通創作者商店才有入口（features.md 2.5）；Figma 按鈕文字是「查看可委託項目」 -->
      <template v-if="author?.store_approved" #action>
        <!-- 【點按鈕時觸發】交給首頁：關掉作品燈箱、改開這位作者的委託商店燈箱 -->
        <!-- 暫不接案時停用：is_open 由 fetchAuthor 算好（light_status＋至少 1 筆項目＋已開通） -->
        <Button :disabled="!author.is_open" @click="emit('open-shop', author.id)">
          查看可委託項目
        </Button>
      </template>
    </LightboxLayout>
  </Lightbox>
</template>

<script setup lang="ts">
/*
元件名稱：作品展示燈箱（Figma 521:999，features.md 2.5）
範例：
使用前先 import：import WorkLightbox from '@/features/explore/components/WorkLightbox.vue'
<WorkLightbox v-if="openedWorkId" :work-id="openedWorkId" @close="openedWorkId = null" @open-shop="openShop" />
傳 work_id 就好，作品、圖片、標籤、作者由燈箱自己抓。
close：點 ✕、黑底、Esc 時送出；open-shop：點「查看可委託項目」時送出，帶作者帳號 ID。
還沒做：「我要委託」、點頭像看完整專頁（個人頁還沒有）。
*/
import { ref, watch } from 'vue'
import Lightbox from '@/shared/components/Lightbox.vue'
import Button from '@/shared/components/Button.vue'
import LightboxLayout from '@/features/explore/components/LightboxLayout.vue'
import WorkInfo from '@/features/explore/components/WorkInfo.vue'
import CommissionRules from '@/features/explore/components/CommissionRules.vue'
import { fetchAuthor, fetchWorkDetail } from '@/features/explore/api'
import type { LightboxAuthor, Work } from '@/features/explore/types'

const props = defineProps<{
  workId: string
}>()
const emit = defineEmits<{
  close: []
  'open-shop': [creatorId: string]
}>()

const work = ref<Work | null>(null)
const images = ref<string[]>([])
const tags = ref<string[]>([])
const author = ref<LightboxAuthor | null>(null)

// 【燈箱打開時、workId 換掉時】抓作品，再用作品的 user_id 抓作者
// immediate：一掛上就先跑一次，不用等 workId 改變
watch(
  () => props.workId,
  async (workId) => {
    const detail = await fetchWorkDetail(workId)
    work.value = detail?.work ?? null
    images.value = detail?.images ?? []
    tags.value = detail?.tags ?? []
    author.value = detail ? await fetchAuthor(detail.work.user_id) : null
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
// Figma 作品內容上方多留 18
// 不能叫 .work-info：WorkInfo 的根元素也叫這個名字，會被套兩次（上方變 36）
.work-content {
  padding-top: 18px;
}

.divider {
  flex-shrink: 0;
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}
</style>
