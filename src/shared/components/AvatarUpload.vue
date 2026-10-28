<template>
  <button type="button" class="avatar-upload">
    <span class="avatar-upload__box">
      <img src="/icons/plus-avatar.svg" alt="" />
    </span>
    <span class="avatar-upload__text">
      <span class="text-body avatar-upload__title">{{ title }}</span>
      <span class="text-caption avatar-upload__description">{{ description }}</span>
    </span>
  </button>
</template>

<script setup lang="ts">
/*
元件名稱：大頭照上傳（Google 補填資料頁、個人資料設定用）
範例：
使用前先 import：import AvatarUpload from '@/shared/components/AvatarUpload.vue'
<AvatarUpload @click="開啟選檔" /> ---> 預設文字
<AvatarUpload title="更換大頭照" description="單張 5MB 以內" /> ---> 自訂文字
只負責外觀，選檔與檢查由外面處理
*/
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: '上傳大頭照（選填）',
    description: '單張 5MB 以內，之後可在個人資料設定修改',
  },
)
</script>

<style lang="scss" scoped>
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
}

.avatar-upload__box {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 15px;
  background: var(--color-bg-subtle);
  transition: background 0.3s ease;
}

// 用鍵盤移到這裡時顯示外框，滑鼠點擊不顯示（同 OptionButton）
.avatar-upload:focus-visible {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

// Figma 沒畫 hover，前端自訂：滑過整列時，左邊方塊底色深一階，同 UserMenuButton
@media (hover: hover) {
  .avatar-upload:hover .avatar-upload__box {
    background: var(--color-bg-subtle-hover);
  }
}

.avatar-upload__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.avatar-upload__title {
  color: var(--color-text-primary);
}

.avatar-upload__description {
  color: var(--color-text-secondary);
}
</style>
