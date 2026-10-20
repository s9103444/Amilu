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
  </div>
</template>

<script setup lang="ts">
import Button from '@/shared/components/Button.vue'
import UserMenuButton from '@/layouts/components/UserMenuButton.vue'
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
</style>
