<template>
  <div class="playground">
    <section>
      <h2>Button</h2>
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
    <br />
    <section>
      <h2>UserMenuButton</h2>
      <p>點一下切換開關（目前：{{ isMenuOpen ? '打開' : '關閉' }}）</p>
      <UserMenuButton :open="isMenuOpen" @click="isMenuOpen = !isMenuOpen" />
    </section>
    <br />
    <section>
      <h2>個人選單：開通創作者</h2>
      <ActivateCreatorButton />
    </section>
    <br />
    <section>
      <h2>Follow Button</h2>
      <p>點一下切換追蹤（目前：{{ isFollowed ? '已追蹤' : '未追蹤' }}）</p>
      <FollowButton :followed="isFollowed" @click="isFollowed = !isFollowed" />
    </section>
    <br />
    <section>
      <h2>GoogleAuthButton</h2>
      <GoogleAuthButton />
    </section>
    <br />
    <section>
      <h2>OrderFloatingButton</h2>
      <p>chat</p>
      <OrderFloatingButton status="chat" />
      <p>info</p>
      <OrderFloatingButton status="info" />
    </section>
    <br />
    <section>
      <h2>FormInput</h2>
      <FormInput v-model="input" type="text">使用者ID</FormInput>
      <p>測試同步文字：{{ input }}</p>
      <p>email + 錯誤訊息（輸入 error 會出現錯誤）</p>
      <FormInput
        v-model="email"
        type="email"
        :error="email === 'error' ? '此 email 已被註冊' : ''"
      />
      <p>password</p>
      <FormInput v-model="password" type="password" />
      <p>readonly</p>
      <FormInput v-model="readonlyAccount" readonly>帳號</FormInput>
    </section>
  </div>
</template>

<script setup lang="ts">
import Button from '@/shared/components/Button.vue'
import UserMenuButton from '@/layouts/components/header/UserMenuButton.vue'
import ActivateCreatorButton from '@/layouts/components/header/ActivateCreatorButton.vue'
import FollowButton from '@/shared/components/FollowButton.vue'
import FormInput from '@/shared/components/FormInput.vue'
import GoogleAuthButton from '@/features/account/components/GoogleAuthButton.vue'
import OrderFloatingButton from '@/features/order/components/OrderFloatingButton.vue'
import { ref } from 'vue'

const isMenuOpen = ref(false)
const isFollowed = ref(false)
const input = ref('')
const email = ref('')
const password = ref('')
const readonlyAccount = ref('amilu_user')
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
</style>
