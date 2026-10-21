<template>
  <div class="playground">
    <h2>Button</h2>

    <section>
      <p>primary / full</p>
      <Button>登入</Button>
      <p>primary / hug</p>
      <Button width="hug">登入</Button>
    </section>

    <section>
      <p>secondary / full</p>
      <Button variant="secondary">登入</Button>
      <p>secondary / hug</p>
      <Button variant="secondary" width="hug">登入</Button>
    </section>

    <section>
      <p>primary / disabled</p>
      <Button disabled>登入</Button>
      <p>secondary / disabled</p>
      <Button variant="secondary" disabled>登入</Button>
      <p>primary / hug / disabled</p>
      <Button width="hug" disabled>登入</Button>
    </section>

    <h2>UserMenuButton</h2>

    <section>
      <p>點一下切換開關（目前：{{ isMenuOpen ? '打開' : '關閉' }}）</p>
      <UserMenuButton :open="isMenuOpen" @click="isMenuOpen = !isMenuOpen" />
    </section>

    <h2>ImageUploadSlot</h2>

    <section class="row">
      <div>
        <p>uploaded-cover</p>
        <ImageUploadSlot status="uploaded-cover" />
      </div>
      <div>
        <p>uploaded</p>
        <ImageUploadSlot status="uploaded" />
      </div>
      <div>
        <p>add</p>
        <ImageUploadSlot status="add" />
      </div>
    </section>

    <section>
      <p>uploaded-cover / 標記改序號</p>
      <ImageUploadSlot status="uploaded-cover" badge="1" />
      <p>uploaded-cover / 不顯示標記</p>
      <ImageUploadSlot status="uploaded-cover" :show-badge="false" />
    </section>

    <h2>AvatarUpload</h2>

    <section>
      <AvatarUpload />
    </section>

    <h2>DropZone</h2>

    <section>
      <DropZone />
    </section>

    <h2>FilterChip</h2>

    <section class="row">
      <div>
        <p>filled</p>
        <FilterChip>一般貼文</FilterChip>
      </div>
      <div>
        <p>outline</p>
        <FilterChip variant="outline">半厚塗</FilterChip>
      </div>
    </section>

    <h2>HashtagLabel</h2>

    <section class="row">
      <div>
        <p>button</p>
        <HashtagLabel>#厚塗</HashtagLabel>
      </div>
      <div>
        <p>post</p>
        <HashtagLabel variant="post">#厚塗</HashtagLabel>
      </div>
    </section>

    <h2>CommercialTag</h2>

    <section>
      <CommercialTag />
    </section>

    <h2>StepNumber</h2>

    <section>
      <StepNumber :number="5" />
    </section>

    <h2>OpenStatusTag</h2>

    <section class="row">
      <div>
        <p>open</p>
        <OpenStatusTag :open="true" />
      </div>
      <div>
        <p>closed</p>
        <OpenStatusTag :open="false" />
      </div>
    </section>

    <h2>InfoBox</h2>

    <section>
      <InfoBox>請於 2026/10/03 23:59 前使用 ATM 轉帳至收款帳號付款。</InfoBox>
    </section>

    <h2>WarningBox</h2>

    <section>
      <p>paragraph</p>
      <WarningBox title="你還有尚未結束的委託">
        請等委託完成、取消或終止合作，並補齊所有款項後，再刪除帳號。
      </WarningBox>
      <p>list</p>
      <WarningBox
        title="刪除後無法復原"
        :items="[
          '將無法再登入此帳號，帳號 ID 也無法再次註冊使用',
          '個人頁、作品與可委託項目將不再公開顯示',
          '已完成或已取消的委託紀錄會保留，對方看到的是「已刪除的使用者」',
          '有進行中的委託或尚未補齊的款項時，無法刪除帳號',
        ]"
      />
    </section>

    <h2>SavedToast</h2>

    <section>
      <SavedToast />
    </section>

    <h2>DividerWithText</h2>

    <section>
      <DividerWithText />
    </section>

    <h2>MenuDivider</h2>

    <section>
      <MenuDivider />
    </section>

    <h2>OrderStatusTag</h2>

    <section class="row">
      <div>
        <p>awaiting-quote</p>
        <OrderStatusTag status="awaiting-quote" />
      </div>
      <div>
        <p>awaiting-payment</p>
        <OrderStatusTag status="awaiting-payment" />
      </div>
      <div>
        <p>in-progress</p>
        <OrderStatusTag status="in-progress" />
      </div>
      <div>
        <p>completed</p>
        <OrderStatusTag status="completed" />
      </div>
      <div>
        <p>cancelled</p>
        <OrderStatusTag status="cancelled" />
      </div>
      <div>
        <p>incomplete</p>
        <OrderStatusTag status="incomplete" />
      </div>
      <div>
        <p>awaiting-top-up</p>
        <OrderStatusTag status="awaiting-top-up" />
      </div>
      <div>
        <p>top-up-pending-confirm</p>
        <OrderStatusTag status="top-up-pending-confirm" />
      </div>
      <div>
        <p>terminated</p>
        <OrderStatusTag status="terminated" />
      </div>
    </section>

    <h2>StageTag</h2>

    <section class="row">
      <div>
        <p>未確認 / 1</p>
        <StageTag :stage_no="1" />
      </div>
      <div>
        <p>已確認 / 1</p>
        <StageTag :stage_no="1" confirmed />
      </div>
      <div>
        <p>已確認 / 4</p>
        <StageTag :stage_no="4" confirmed />
      </div>
      <div>
        <p>未確認 / 5</p>
        <StageTag :stage_no="5" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Button from '@/shared/components/Button.vue'
import UserMenuButton from '@/layouts/components/UserMenuButton.vue'
import OrderStatusTag from '@/features/order/components/OrderStatusTag.vue'
import StageTag from '@/features/order/components/StageTag.vue'
import ImageUploadSlot from '@/shared/components/ImageUploadSlot.vue'
import AvatarUpload from '@/shared/components/AvatarUpload.vue'
import DropZone from '@/shared/components/DropZone.vue'
import FilterChip from '@/shared/components/FilterChip.vue'
import HashtagLabel from '@/shared/components/HashtagLabel.vue'
import CommercialTag from '@/shared/components/CommercialTag.vue'
import StepNumber from '@/shared/components/StepNumber.vue'
import OpenStatusTag from '@/shared/components/OpenStatusTag.vue'
import InfoBox from '@/shared/components/InfoBox.vue'
import WarningBox from '@/shared/components/WarningBox.vue'
import SavedToast from '@/shared/components/SavedToast.vue'
import DividerWithText from '@/shared/components/DividerWithText.vue'
import MenuDivider from '@/shared/components/MenuDivider.vue'
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script>

<style lang="scss" scoped>
.playground {
  max-width: 500px;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

section {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

// 小元件並排顯示
.row {
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--space-3);
}
</style>
