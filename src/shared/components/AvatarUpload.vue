<template>
  <div class="avatar-upload">
    <!-- 左邊方塊：可點；type="button" 避免放在 form 裡時被當成送出鈕 -->
    <button
      type="button"
      class="avatar-upload__box"
      :class="{ 'avatar-upload__box--filled': imageUrl }"
      @click="emit('select')"
    >
      <img
        :src="imageUrl ?? '/icons/plus-avatar.svg'"
        :class="{ 'avatar-upload__image': imageUrl }"
        :alt="imageUrl ? '目前的大頭照' : ''"
      />
    </button>
    <span class="avatar-upload__text">
      <span class="text-caption avatar-upload__title">{{ title }}</span>
      <span class="text-note avatar-upload__description">{{ description }}</span>
    </span>
    <Button v-if="imageUrl" @click="emit('select')" variant="secondary" width="hug"
      >更換大頭貼</Button
    >
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：大頭照上傳（Google 補填資料頁、個人資料設定用）
範例：
使用前先 import：import AvatarUpload from '@/shared/components/AvatarUpload.vue'
<AvatarUpload @select="開啟選檔" /> ---> 預設文字，左邊顯示「＋」
<AvatarUpload :image-url="avatarUrl" @select="開啟選檔" /> ---> 左邊顯示這張照片
<AvatarUpload title="更換大頭照" description="單張 5MB 以內" /> ---> 自訂文字
image-url 不傳或 null ＝ 還沒有大頭照，顯示「＋」；有值就顯示照片（填滿方塊、裁切置中）
點左邊方塊或右邊「更換大頭貼」都會發出 select，頁面收到後開選檔視窗
只負責外觀，選檔與檢查由外面處理
外層不是 <button>：裡面有兩顆按鈕，按鈕不能包按鈕
*/
import Button from '@/shared/components/Button.vue'
withDefaults(
  defineProps<{
    title?: string
    description?: string
    imageUrl?: string | null
  }>(),
  {
    title: '上傳大頭照（選填）',
    description: '單張 5MB 以內，之後可在個人資料設定修改',
  },
)
// 使用者想選圖時通知頁面（左邊方塊、右邊按鈕共用）
const emit = defineEmits<{ select: [] }>()
</script>

<style lang="scss" scoped>
// 整列：左方塊、中間文字、右邊按鈕排成一行（外層不是按鈕，不用清按鈕預設樣式）
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

// 左邊方塊（可點的按鈕）：固定 62×62，換成照片時版面不跳
// 62 ＝ 原本「＋ 20px＋上下 padding 20px＋框線 1px」撐出來的大小，維持原外觀
.avatar-upload__box {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-bg-subtle);
  cursor: pointer;
  transition: background 0.3s ease;
}

// 有照片時：照片貼齊方塊邊緣、超出圓角的部分切掉；頭像一律用頭像圓角（_tokens.scss --radius-avatar）
.avatar-upload__box--filled {
  overflow: hidden;
  border-radius: var(--radius-avatar);
}

// 照片填滿方塊；不是正方形的圖等比例裁切置中，不變形
.avatar-upload__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 用鍵盤移到方塊時顯示外框，滑鼠點擊不顯示（同 OptionButton）
.avatar-upload__box:focus-visible {
  outline: 2px solid var(--color-bg-inverse);
  outline-offset: 2px;
}

// Figma 沒畫 hover，前端自訂：滑過方塊時底色深一階，同 UserMenuButton（有照片時被照片蓋住，看不到）
@media (hover: hover) {
  .avatar-upload__box:hover {
    background: var(--color-bg-subtle-hover);
  }
}

// 文字區吃掉剩下的寬度，右邊按鈕就被推到最右
.avatar-upload__text {
  display: flex;
  flex: 1;
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
