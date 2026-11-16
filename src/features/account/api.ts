// account 功能的「後端呼叫」：頁面一律呼叫這裡，不直接 import mocks（structure.md 3.2）
// 現在比對假資料，後端好了改成呼叫 POST /auth/login（api.md 草案），頁面不用動
// 真正的比對在後端：前端送原始密碼（走 HTTPS），後端用 password_hash 裡存的鹽驗證；假資料的 password_hash 放明碼，所以這裡直接 ===
import { MOCK_USERS } from '@/mocks/user'

// 【流程②：LoginPage 檢查欄位通過後呼叫】email＋密碼對得上就回傳帳號 ID，對不上回傳 null
export async function login(email: string, password: string): Promise<string | null> {
  const user = MOCK_USERS.find((row) => email === row.email && password === row.password_hash)
  return user?.id ?? null
}
