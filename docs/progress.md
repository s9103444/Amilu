# 開發進度

> 主軸寫在這裡，對話被洗掉也不會丟。開新的 Claude session 時先說：「先讀 `docs/progress.md`」。
> 做完一步就把 ⬜ 改成 ✅。規則類的決定寫進 `spec/`（見 CLAUDE.md），這裡只記進度。
> 元件階段與圖片呈現的進度已結束（2026/11/10），舊內容用 `git log -- docs/progress.md` 查。

狀態：⬜ 未做　🔄 進行中　✅ 完成

---

## 目前在做

拼裝頁面：開始前的外框、網址、登入狀態都完成（2026/11/10）。下一步：首頁作品牆。

---

## 開始前

- ✅ 頁尾 `AppFooter`（2026/11/10）
- ✅ 圖片呈現收尾：瀏覽器測試完成，規則已寫進 features.md 2.5、2.6，changelog 已記
- 🔄 頁面外框
  - ✅ `DefaultLayout`（header＋頁面內容＋footer）＋巢狀路由；`explore/routes.ts`、`HomePage.vue`（目前只有標題）
  - ✅ `AppHeader`（Figma 484:98 登入前、569:3299 登入後），`DefaultLayout` 已換上；登入狀態先寫死 false
  - ⬜ 瀏覽器確認三種寬度；375px 手機會不會擠爆（Figma 手機版只畫 767 寬）
- ✅ 頁面與網址清單：寫進 structure.md 3.5（2026/11/10）
- ✅ 假的登入狀態：`features/account/store.ts`（`useAuthStore`）讀 `mocks/user.ts`；playground「登入身份（假）」切換；`DefaultLayout` 讀 store；已刪 `stores/counter.ts`
  - ✅ 瀏覽器確認：登入切換後 header 跟著換（2026/11/10）

## 第一頁：首頁作品牆

- ⬜ 定下 `api.ts` 回傳假資料的寫法（之後每個功能照抄）
- ⬜ （細項做到再拆）

---

## 做到再處理

- 帳號頁外框（只有左上 Logo，不套 header／footer）：做登入頁時建在 `layouts/`
- 個人中心外框（左側選單＋右邊內容）：做第一個個人中心頁時建
- 共用燈箱外框（黑底、關閉鈕、Esc 關閉、背景不捲動）：做第一個燈箱時建在 `shared/components/`
- 申請委託的參考圖（`ImageUploadSlot`）要補「點圖開預覽」
- 頁尾與 header 的連結（Logo、瞭解網站、登入、上傳、頁尾導覽、社群）：目前都沒接，等頁面路由
- header 上傳圖示要不要打開「上傳作品選單」（Figma 573:3489）
- 搜尋列和 Figma 的小差異：提示字（程式「輸入搜尋關鍵字」／Figma「輸入關鍵字搜尋」）、放大鏡和字的間距（程式 4／Figma 14）
- features.md 4.4 的「確認收稿」「前往補款」Figma 貼文裡沒有，做討論牆時確認放哪
