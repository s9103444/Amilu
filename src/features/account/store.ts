/*
登入狀態（Pinia）：記住「現在是誰登入」，整個網站共用同一份
和 composable 的差別：useDropdown() 每次呼叫各拿一份新的；useAuthStore() 不管誰呼叫，拿到的都是同一份
使用：
import { useAuthStore } from '@/features/account/store'
const auth = useAuthStore()
auth.isLoggedIn            // 有沒有登入（不用 .value）
auth.currentUser?.nickname // 登入者資料，未登入是 null
auth.loginAs('im_temp_id') / auth.logOut()
目前讀 mocks/user.ts 的假使用者（demo 切換身份用）；後端好了，loginAs 改成呼叫登入 API
委託人或創作者不存在這裡：同一個帳號可以兩種都是，在案件頁比對 currentUser.id 和 order.creator_id
*/
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MOCK_USERS } from '@/mocks/user'
import type { MockUser } from '@/mocks/user'

export const useAuthStore = defineStore('auth', () => {
  // 登入中的使用者；null ＝ 未登入（網站剛打開、或重新整理後都是 null）
  const currentUser = ref<MockUser | null>(null)
  const isLoggedIn = computed(() => currentUser.value !== null)

  // 【切換身份／登入時觸發】找出這個帳號 ID 的假使用者；找不到就當作未登入
  function loginAs(userId: string) {
    currentUser.value = MOCK_USERS.find((user) => user.id === userId) ?? null
  }

  // 【按登出時觸發】
  function logOut() {
    currentUser.value = null
  }

  return { currentUser, isLoggedIn, loginAs, logOut }
})
