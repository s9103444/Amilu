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
登入的帳號 ID 存在 localStorage，重新整理會還原；後端好了改存 token
委託人或創作者不存在這裡：同一個帳號可以兩種都是，在案件頁比對 currentUser.id 和 order.creator_id
*/
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MOCK_USERS } from '@/mocks/user'
import type { MockUser } from '@/mocks/user'

export const useAuthStore = defineStore('auth', () => {
  // 登入中的使用者；null ＝ 未登入（重新整理後由下面的 restore 從 localStorage 還原）
  const currentUser = ref<MockUser | null>(null)
  const isLoggedIn = computed(() => currentUser.value !== null)
  // localStorage 的 key：只存帳號 ID，不存密碼；後端好了改存 token
  const STORAGE_KEY = 'amilu-user-id'

  // 【切換身份／登入時觸發】找出這個帳號 ID 的假使用者；找不到就當作未登入
  function loginAs(userId: string) {
    currentUser.value = MOCK_USERS.find((user) => user.id === userId) ?? null
    // 記住這次登入的人，重新整理後才能還原；找不到這個人就把舊的紀錄刪掉
    try {
      if (currentUser.value) {
        localStorage.setItem(STORAGE_KEY, userId)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // 無痕模式等讀寫失敗：就是不記住，不影響登入
    }
  }

  // 【按登出時觸發】
  function logOut() {
    currentUser.value = null
    // 刪掉紀錄，重新整理後才不會又登入回來
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // 無痕模式等讀寫失敗：不影響登出
    }
  }

  // 【流程①：網站啟動時（第一次呼叫 useAuthStore）跑一次】讀回上次登入的帳號 ID，還原登入狀態
  function restore() {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY)
      if (savedId) {
        loginAs(savedId)
      }
    } catch {
      // 讀不到就維持未登入
    }
  }
  restore()

  return { currentUser, isLoggedIn, loginAs, logOut }
})
