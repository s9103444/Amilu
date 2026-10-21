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
        :type="type"
        v-model="input"
        class="input text-caption"
        :class="{ 'input--error': error, 'input--readonly': readonly }"
        :placeholder="defaultPlaceholders[type]"
        :readonly="readonly"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
      />
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
<FormInput v-model="account" readonly /> ---> 唯讀：灰底、無外框、右側鎖頭，標籤旁顯示「唯讀，不可修改」，
用原生 readonly（不是 disabled），所以仍可選取複製、表單送出時也會帶上。有 error 時以錯誤訊息優先。
*/
import { useId } from 'vue'

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

withDefaults(
  defineProps<{
    type?: 'text' | 'email' | 'password'
    error?: string
    readonly?: boolean
  }>(),
  {
    type: 'text',
  },
)

const input = defineModel<string>()

// 每個實例各自一組唯一 id：label 的 for 對上 input 的 id，錯誤訊息用 aria-describedby 連到 input
const inputId = useId()
const errorId = `${inputId}-error`
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
