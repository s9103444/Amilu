<template>
  <div class="field">
    <div class="title-content">
      <div class="note">
        <label class="text-caption" :for="inputId"><slot>標籤</slot></label>
        <span
          class="text-small label--hint"
          :class="{ 'label--nes': requirement == 'necessary' }"
          v-if="requirement"
          >{{ defaultRequirement[requirement] }}</span
        >
      </div>
      <div>
        <span class="text-small note">{{ description?.length }} / {{ textLimit }}字</span>
      </div>
    </div>
    <textarea
      v-model="description"
      class="text-caption textarea"
      :id="inputId"
      :maxlength="textLimit"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
/*
元件名稱：表單多行輸入框（標籤＋多行輸入框＋字數計數）
範例：
<FormTextarea v-model="description">委託說明</FormTextarea>
<FormTextarea v-model="description" requirement="necessary" :text-limit="300" />
v-model 綁頁面的 ref，輸入的字會同步回去；標籤文字不給就顯示「標籤」，用內容覆蓋；
requirement 在標籤旁顯示小字：necessary ＝「必填」、optional ＝「選填」，不傳就不顯示；
text-limit 是字數上限，預設 150，同時決定右上角「目前字數 / 上限」的上限與輸入框能打的字數；
輸入框只能上下拉大小。
*/
import { useId } from 'vue'

const inputId = useId()
const description = defineModel<string>()
withDefaults(
  defineProps<{
    requirement?: 'necessary' | 'optional'
    textLimit?: number
  }>(),
  {
    textLimit: 150,
  },
)

const defaultRequirement = {
  necessary: '必填',
  optional: '選填',
}
</script>

<style lang="scss" scoped>
.field {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.title-content {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.note {
  display: flex;
  gap: 4px;
  align-items: flex-end;
}
label {
  color: var(--color-text-primary);
}
.label--hint {
  color: var(--color-text-secondary);
}
.label--nes {
  color: var(--color-error);
}

.textarea {
  outline: none;
  width: 100%;
  display: flex;
  min-height: 160px;
  padding: 12px 14px 8px 14px;
  align-items: flex-start;
  gap: 14px;
  align-self: stretch;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-subtle);
  resize: vertical;
}
.textarea:focus {
  border: 1px solid var(--color-text-secondary);
}
.note {
  color: var(--color-text-secondary);
}
</style>
