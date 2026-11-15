/*
登入／註冊表單的前端檢查（只擋明顯填錯的，最終以後端檢查為準）
每個函式回傳錯誤文字；通過回傳空字串 → 可以直接塞進 FormInput 的 :error
使用：
import { requiredError, emailError } from '@/features/account/validation'
errors.email = emailError(email.value)
errors.password = requiredError(password.value, '密碼')
*/

// 必填：只打空白也算沒填
export function requiredError(value: string, label: string): string {
  const trimmedValue = value.trim()
  if (trimmedValue === '') {
    return `請輸入${label}`
  } else {
    return ''
  }
}

// Email：先檢查必填，再檢查基本格式「某某@某某.某某」（信箱是否真的存在要靠後端寄驗證信）
export function emailError(value: string): string {
  const required = requiredError(value, 'Email')
  if (required) {
    return required
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value.trim())) {
    return 'Email 格式不正確'
  } else {
    return ''
  }
}
