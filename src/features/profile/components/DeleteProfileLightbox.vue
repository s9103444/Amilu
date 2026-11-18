<template>
  <Lightbox size="sm" @close="emit('close')">
    <div class="delete-dialog">
      <h2 class="text-h3 title">刪除帳號</h2>
      <hr class="divider" />

      <!-- 第一層：確認刪除（Figma 545:2014） -->
      <div v-if="step === 'confirm'" class="step">
        <p class="text-body">確定要刪除帳號「@{{ userId }}」嗎？</p>
        <WarningBox
          title="刪除後無法復原"
          :items="[
            '將無法再登入此帳號，帳號 ID 也無法再次註冊使用',
            '個人頁、作品與可委託項目將不再公開顯示',
            '已完成或已取消的委託紀錄會保留，對方看到的是「已刪除的使用者」',
            '有進行中的委託或尚未補齊的款項時，無法刪除帳號',
          ]"
        />
        <FormCheckbox v-model="agreed">我了解刪除後無法復原，仍要刪除帳號</FormCheckbox>
        <div class="actions">
          <Button variant="outline" @click="emit('close')">取消</Button>
          <Button :disabled="!agreed" variant="danger" @click="handleConfirm()">確認刪除</Button>
        </div>
      </div>

      <!-- 第二層：無法刪除（Figma 545:2096） -->
      <div v-if="step === 'blocked'" class="step">
        <p class="text-body">目前無法刪除帳號</p>
        <WarningBox title="你還有尚未結束的委託">
          請等委託完成、取消或終止合作，並補齊所有款項後，再刪除帳號。
        </WarningBox>
        <div class="actions">
          <Button variant="outline" @click="emit('close')">關閉</Button>
          <!-- 約稿管理頁（/me/orders）還沒做，等做好再接 -->
          <Button>前往約稿管理</Button>
        </div>
      </div>
    </div>
  </Lightbox>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Lightbox from '@/shared/components/Lightbox.vue'
import WarningBox from '@/shared/components/WarningBox.vue'
import FormCheckbox from '@/shared/components/FormCheckbox.vue'
import Button from '@/shared/components/Button.vue'
import { deleteAccount } from '@/features/profile/api'

/*
元件名稱：刪除帳號燈箱（Figma 545:2014 確認層、545:2096 無法刪除層，features.md 3.1）
範例：
<DeleteProfileLightbox v-if="showDelete" :user-id="user.id" @close="showDelete = false" @deleted="handleDeleted" />
一律先顯示確認層；勾選後按「確認刪除」才問後端，不能刪就換成無法刪除層，能刪就送出 deleted
close：✕、取消、關閉、點黑底、Esc；deleted：已刪除，登出與換頁由頁面處理
每次打開都是重新建立（外面用 v-if），所以 step、agreed 不用自己重設
*/
const props = defineProps<{ userId: string }>()
const step = ref<'confirm' | 'blocked'>('confirm') // 現在顯示哪一層：confirm ＝ 確認層、blocked ＝ 無法刪除層
const agreed = ref(false) // 有沒有勾「我了解…」
const emit = defineEmits<{ close: []; deleted: [] }>()

// 【流程④-2：勾選後按「確認刪除」時觸發】問後端能不能刪，依結果換層或通知頁面
async function handleConfirm() {
  const result = await deleteAccount()
  if (!result.ok) {
    step.value = 'blocked'
  } else {
    emit('deleted')
  }
}
</script>

<style lang="scss" scoped>
// 燈箱內容：每一塊上下間距 24（Figma 545:2067）；框的內距由 Lightbox size="sm" 給
.delete-dialog,
.step {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  color: var(--color-text-primary);
}

.title,
p {
  margin: 0;
}

// 標題列右邊留空給 Lightbox 的 ✕，長標題才不會壓到
.title {
  padding-right: var(--space-4);
}

.divider {
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

// 兩顆按鈕平分寬度，中間 16（Figma 545:2091）
.actions {
  display: flex;
  gap: var(--space-2);

  > * {
    flex: 1;
  }
}
</style>
