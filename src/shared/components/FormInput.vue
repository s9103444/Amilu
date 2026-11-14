<template>
  <div class="field">
    <div class="label-content">
      <label class="text-caption" :for="inputId"
        ><slot>{{ defaultLabels[type] }}</slot></label
      >
      <span v-if="error" :id="errorId" class="text-caption label--error">{{ error }}</span>
      <span v-else-if="readonly" class="text-caption label--hint">唯讀，不可修改</span>
    </div>
    <div class="control">
      <input
        :id="inputId"
        :type="type === 'password' && isVisible ? 'text' : type"
        v-model="input"
        class="input text-small"
        :class="{
          'input--error': error,
          'input--readonly': readonly,
          'input--has-eye': hasEye,
        }"
        :placeholder="placeholder ?? defaultPlaceholders[type]"
        :readonly="readonly"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
      />
      <!-- 【點眼睛時觸發】切換 isVisible → 上面 input 的 :type 跟著在 password／text 之間換 -->
      <!-- type="button"：在 <form> 裡不寫會預設成 submit，點眼睛就送出表單 -->
      <button
        v-if="hasEye"
        type="button"
        class="eye"
        :aria-label="isVisible ? '隱藏密碼' : '顯示密碼'"
        @click="eyeChange"
      >
        <img :src="base + (isVisible ? 'icons/eye-open.svg' : 'icons/eye-closed.svg')" alt="" />
      </button>

      <img v-if="readonly" class="lock" src="/icons/lock.svg" alt="" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：表單輸入框（標籤＋單行輸入框）
範例：
<FormInput v-model="email" type="email" :error="emailError" />
<FormInput v-model="name">使用者ID</FormInput>
v-model 綁頁面的 ref，輸入的字會同步回去；type 預設 text；
error 傳錯誤訊息文字，有字就在標籤旁顯示並把外框變橘，沒傳或空字串就沒錯誤；
標籤文字預設依 type 決定，也可以用內容覆蓋。
<FormInput v-model="userId" placeholder="請輸入英文與數字">使用者ID</FormInput> ---> 提示字預設依 type 決定，傳 placeholder 就覆蓋。
<FormInput v-model="account" readonly /> ---> 唯讀：灰底、無外框、右側鎖頭，標籤旁顯示「唯讀，不可修改」，
用原生 readonly（不是 disabled），所以仍可選取複製、表單送出時也會帶上。有 error 時以錯誤訊息優先。
type="password" 時右側自動出現眼睛按鈕，點了切換顯示／隱藏密碼（唯讀時不出現）。
*/
import { computed, ref, useId } from 'vue'

const base = import.meta.env.BASE_URL
const defaultLabels = {
  text: '標籤',
  email: 'email',
  password: '密碼',
}
const defaultPlaceholders = {
  text: '請輸入於此',
  email: '請輸入信箱帳號',
  password: '請輸入密碼',
}

const props = withDefaults(
  defineProps<{
    type?: 'text' | 'email' | 'password'
    error?: string
    readonly?: boolean
    placeholder?: string
  }>(),
  {
    type: 'text',
  },
)
// 密碼現在是否顯示成明碼；false ＝ 顯示成點點（預設）
const isVisible = ref(false)
// 只有可編輯的密碼欄才有眼睛：唯讀時右側已經放鎖頭
const hasEye = computed(() => props.type === 'password' && !props.readonly)

const input = defineModel<string>()

// 每個實例各自一組唯一 id：label 的 for 對上 input 的 id，錯誤訊息用 aria-describedby 連到 input
const inputId = useId()
const errorId = `${inputId}-error`

function eyeChange() {
  isVisible.value = !isVisible.value
}
</script>

<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
}
label {
  color: var(--color-text-primary);
}
.label-content {
  display: flex;
  gap: 4px;
}
.control {
  position: relative;
}
.lock {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  pointer-events: none;
}
// 眼睛按鈕：位置同鎖頭。兩張圖尺寸不同（20／18），按鈕固定 20×20 置中，切換時才不會跳動
.eye {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}
.input {
  outline: none;
  display: flex;
  height: 48px;
  padding: 8px 14px;
  align-items: center;
  gap: 14px;
  align-self: stretch;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-subtle);
  width: 100%;
  // input 會把文字裁在「行高」範圍內（一般文字不會）；.text-small 的行高 1.5 太緊，g、y 的下緣會被切掉
  // 改回 normal，由字體自己的上下高度決定；垂直置中靠固定的 height: 48px，不受影響
  line-height: normal;
  &::placeholder {
    color: var(--color-placeholder);
  }
}
.input:not(.input--error, .input--readonly):focus {
  border: 1px solid var(--color-text-secondary);
}
.input--error {
  border: 2px solid var(--color-error-border);
}
// 有眼睛時右側留位置（14 邊距＋20 按鈕＋8 間距），長密碼才不會被眼睛蓋住
.input--has-eye {
  padding-right: 42px;
}
// 唯讀：灰底、外框透明（不是移除，才不會讓框大小跳動）、右側留位置給鎖頭
.input--readonly {
  padding-right: 42px;
  border-color: transparent;
  background: var(--color-bg-field-readonly);
  color: var(--color-text-secondary);
}
.label--error {
  color: var(--color-error);
}
.label--hint {
  color: var(--color-text-secondary);
}
</style>
