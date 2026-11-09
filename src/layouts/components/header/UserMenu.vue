<template>
  <div ref="menu" class="user-menu">
    <UserMenuButton :open="isOpen" @click="toggle" />
    <ul v-if="isOpen" class="panel">
      <li class="menu-title text-small">個人選單</li>
      <li v-for="item in profile" :key="item.key">
        <UserMenuItem
          :icon="item.icon"
          :main-title="item.mainTitle"
          :sub-title="item.subTitle"
          @click="subOpen(item)"
          :sub-require="!!item.children"
          :is-open="isUploadOpen"
        />
        <ul v-if="isUploadOpen && item.children">
          <li v-for="sub in item.children" :key="sub.key">
            <UserSubMenuItem :icon="sub.icon" :title="sub.title" />
          </li>
        </ul>
      </li>
      <li>
        <MenuDivider />
      </li>
      <li v-for="item in work" :key="item.key">
        <UserMenuItem :icon="item.icon" :main-title="item.mainTitle" :sub-title="item.subTitle" />
      </li>
      <li class="activate">
        <ActivateCreatorButton />
      </li>
      <li>
        <MenuDivider />
      </li>
      <li>
        <UserMenuItem :icon="logout.icon" :main-title="logout.mainTitle" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import type { UserMenuItemData } from '@/layouts/components/header/userMenuItems'
import UserMenuItem from '@/layouts/components/header/UserMenuItem.vue'
import UserSubMenuItem from '@/layouts/components/header/UserSubMenuItem.vue'
import {
  PROFILE_ITEMS as profile,
  WORK_ITEMS as work,
  LOGOUT_ITEM as logout,
} from '@/layouts/components/header/userMenuItems'
import UserMenuButton from '@/layouts/components/header/UserMenuButton.vue'
import MenuDivider from '@/shared/components/MenuDivider.vue'
import ActivateCreatorButton from '@/layouts/components/header/ActivateCreatorButton.vue'
import { useDropdown } from '@/shared/composables/useDropdown'
const menuEl = useTemplateRef<HTMLElement>('menu')
// 外層選單開關＋點外面自動關閉
const { isOpen, toggle } = useDropdown(menuEl)
// 子選單（「上傳」底下）自己的開關，不歸 useDropdown 管
const isUploadOpen = ref(false)

// 【點有子選單的那一列時觸發】展開或收起子選單，外層選單不關
function subOpen(item: UserMenuItemData) {
  if (item.children) {
    isUploadOpen.value = !isUploadOpen.value
  }
}

// 【外層選單關閉時觸發（點外面、或再按一次頭像）】子選單一起收起，下次打開不會還展開著
watch(isOpen, (open) => {
  if (!open) {
    isUploadOpen.value = false
  }
})
</script>

<style lang="scss" scoped>
// 拿掉 <ul> 預設的圓點和左邊空白（子選單的 <ul> 也一起）
// .panel 的 padding 不會被這裡的 0 蓋掉：class 選擇器比標籤選擇器優先，跟先後順序無關
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

// 外框：讓面板以這裡為基準定位
.user-menu {
  position: relative;
  width: fit-content;
}

// 面板：浮在按鈕正下方、對齊右邊（頭像在 header 最右邊，面板往左長才不會超出畫面）（Figma 719:14347）
// 和按鈕的距離 8px 是暫定值，Figma 這個節點沒畫到 header
.panel {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  width: 244px;
  margin: 8px 0 0;
  padding: 12px 0;
  border-radius: 10px;
  background: var(--color-bg-subtle);
  box-shadow: var(--shadow-menu);
}

// 選單最上面的灰色小標「個人選單」（Figma 719:14348）
// 下方 10px ＝ 小標自己的 6px ＋ 小標和項目之間的間距 4px
.menu-title {
  padding: 0 14px 10px;
  color: var(--color-text-secondary);
}

// 開通創作者模式按鈕：置中，上下留 8px（Figma 719:14361）
.activate {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}
</style>
