# 開發進度

> 主軸寫在這裡，對話被洗掉也不會丟。開新的 Claude session 時先說：「先讀 `docs/progress.md`」。
> 做完一步就把 ⬜ 改成 ✅。規則類的決定寫進 `spec/`（見 CLAUDE.md），這裡只記進度。
> 元件階段與圖片呈現的進度已結束（2026/11/10），舊內容用 `git log -- docs/progress.md` 查。

狀態：⬜ 未做　🔄 進行中　✅ 完成

---

## 目前在做

拼裝頁面：登入／註冊頁畫面完成（2026/11/14），送出邏輯還沒做。
下一步：作品展示燈箱、委託商店燈箱（見下方「預定」）；首頁作品牆還欠**瀏覽器確認**篩選與混排、Amilu 燈過濾。

- 分支：在 `timmi` 上開發，最新 commit 見 `git log`。
- 分工：Opus（主對話）討論結構、寫交辦單；Sonnet 子代理 `implementer`（`~/.claude/agents/implementer.md`，2026/11/13 建立）照交辦單實作，回報後由主對話看 diff、跑 type-check。
  - implementer 規則：先讀 CLAUDE.md、structure.md；只用 semantic token；改完跑 type-check；不 commit、不 push；回報改了哪些檔、type-check 結果、自己做的決定。
  - 已載入可用（重開 Claude Code 後才會出現在子代理清單）。我要自己寫的部分仍走引導模式，只有明說「幫我做」才交給 implementer。

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

- ✅ 篩選列：`ContentTypeSelect`（作品分類，新元件）＋兩顆 `CategorySelect`（作品類型／用途）
- ✅ 自訂標籤列：`mocks/tag.ts`（14 個，寫死）＋ Embla 拖曳；共用 class `.grab-area`
- ✅ 欄位表核對（2026/11/11）：CREATOR_PROFILE 改用 `user_id` 當主鍵等，FigJam 待同步（data-model.md 第 6 節 #14）
- 🔄 瀑布流
  - ✅ 作品圖 16 張轉 webp：`src/assets/work/work-01～16.webp`（舊專案 Amilu.js 的 works 順序）
  - ✅ `explore/types.ts` 加 `Work`、`WorkImage`（欄位：work_id、user_id、title、content、category_id、purpose_id、created_at；封面取 WORK_IMAGE seq_no 1）
  - ✅ `mocks/work.ts`（16 筆＋16 張封面）
  - ✅ 定下 `explore/api.ts` 回傳假資料的寫法（之後每個功能照抄）
  - ✅ `explore/composables/useGalleryColumns.ts`：讀 `--gallery-columns` 欄數＋第 i 張放第 i % N 欄（2026/11/11 選定自己分欄，不用 CSS columns／Masonry 外掛：載入更多時舊卡片不跳）
  - ✅ `HomePage` 兩層 `v-for` 排 `WorkCard`＋樣式（2026/11/12）；⬜ 瀏覽器看三種寬度；⬜ 桌機欄數 Figma 484:98 畫 4 欄、design-spec 寫 5 欄，待定
  - ⬜ 之後升級：放最矮的那欄（需要圖片高度，WORK_IMAGE 沒有寬高欄位，要另想辦法）
- 🔄 「已選擇」列（Figma 490:490）：✅ `explore/constants.ts` 放作品分類清單；✅ `selectedTags`＋addTag／removeTag；✅ 名稱、selectedTagList、hasSelection 等 computed；✅ 模板；✅ 樣式（2026/11/12）；⬜ 瀏覽器確認
- 🔄 篩選接上作品牆（2026/11/13）
  - ✅ 規則定案寫進 features.md 2.4＋changelog：多標籤全部符合（AND）；類型、用途、標籤三者之間也全部符合；選了類型／用途時，該欄位空的作品不顯示
  - ✅ `explore/types.ts` 加 `WorkTag`（work_id、tag_id，對應 WORK_TAG）
  - ✅ `mocks/work.ts` 加 `MOCK_WORK_TAGS`：每件至少 3 個標籤；只選 #厚塗 → 01、02、05、09，加 #水彩風 → 01、05
  - ✅ `explore/api.ts`：`fetchWorks(filter: WorkFilter)`（category、purpose、tag_ids） 在假資料上篩；參數名稱 api.md 沒寫（`GET /works` 只寫「支援分類／用途／標籤篩選」），註明要跟後端確認，不自己定成正式規格
  - ✅ `HomePage`：`loadWorks()`＋`watch(..., { deep: true })`；三個篩選值＋`selectedTags` 一變就重抓（`selectedTags` 用 push 改，watch 要能偵測陣列內容變化）；圖片只抓一次
  - ✅ 作品分類選「開放委託」時改由下面的可委託卡片處理
  - ⬜ 瀏覽器確認：上面三組結果＋類型「角色立繪」＋用途「個人收藏」→ 01、16
- 🔄 可委託項目卡片混進牆上（2026/11/13）
  - ✅ 對照欄位表：COMMISSION_ITEM、COMMISSION_ITEM_IMAGE 與現有型別一致；缺 COMMISSION_ITEM_TAG、CREATOR_PROFILE（light_status）
  - ✅ 混排順序定案：兩種卡片依 `created_at` 從新到舊，寫進 features.md 2.1＋changelog
  - ✅ `explore/types.ts` 加 `CommissionItemTag`、`GalleryCard`（前端用的統一卡片形狀：id、type、image_url、title、author_id、created_at）
  - ✅ `mocks/commissionItem.ts` 加 `MOCK_COMMISSION_ITEM_TAGS`（每個 3 個；ci_001、ci_003 有 #厚塗）
  - ✅ `explore/api.ts` 加 `fetchCommissionItems(filter)`（篩選規則同作品）、`fetchCommissionImages()`；對應 `GET /commission-items`，參數待跟後端確認
  - ✅ `useGalleryColumns` 改泛型 `<T>`（只排位置不讀欄位）
  - ✅ `HomePage.loadWorks`：依作品分類決定抓哪幾種 → 轉成 `GalleryCard`（封面在這裡找好）→ 合併排序；模板傳 `type` 給 `WorkCard`
  - ⬜ 瀏覽器確認：「開放委託」→ ci_003、ci_002、ci_001 且有「可委託」標示；「一般貼文」→ 16 張作品無標示；只選 #厚塗 → w_001、002、005、009＋ci_001、ci_003
  - ⬜ Amilu 燈：`CREATOR_PROFILE` 假資料（user_id、light_status），燈「暫停」的創作者項目不回傳（features.md 2.1、api.md「依 Amilu 燈自動過濾」）；假資料要多幾位創作者，至少一位暫停
  - ⬜ 卡片點擊行為（作品開燈箱／可委託項目開委託商店燈箱）


## 登入／註冊頁（2026/11/14）

- ✅ 帳號頁外框 `layouts/AuthLayout.vue`（只有左上 Logo，點了回首頁）＋ `account/routes.ts`（`/login`、`/register`）
- ✅ `LoginPage`（Figma 977:14307）：左表單、右裝飾圖 `assets/account/login-cover.webp`，手機隱藏圖；「註冊」鈕 push `/register`
- ✅ `RegisterPage`（Figma 502:672）：Email、ID＋暱稱並排、密碼、確認密碼、同意條款、Google
- ✅ header「登入」鈕 push `/login`（不用 RouterLink 包 Button：`<a>` 裡放 `<button>` 不合法）
- ✅ `FormInput`：新增 `placeholder` prop；密碼欄自動有眼睛切換顯示；input `line-height: normal`（行高 1.5 會切掉 g、y 下緣）
- ℹ️ 字級、間距、`min-width: 375px` 是彥廷刻意調整，和 Figma 不同屬正常，之後統一做視覺微調
- ⬜ 送出邏輯：必填檢查、兩次密碼一致、勾同意條款、帳號 ID 重複提示（acceptance ACC-01）；登入成功後 `auth.loginAs` 再回首頁
- ⬜ `/register/google` Google 補填資料頁（features.md 1.1、ACC-03、ACC-04）

## 預定

- ⬜ 作品展示燈箱（features.md 2.5）：點牆上的一般作品卡片開啟；先建共用燈箱外框（見「做到再處理」）
- ⬜ 委託商店燈箱：點牆上的可委託卡片開啟；`mocks/commissionItem.ts` 原本就是給燈箱的 `CommissionItemOption` 用

---

## 做到再處理

- 「忘記密碼？」：spec 沒有這個流程、也沒有網址，目前是純文字，要跟後端確認做不做
- 「服務條款與隱私權政策」連結：條款頁還沒有，註冊頁目前只有底線
- 個人中心外框（左側選單＋右邊內容）：做第一個個人中心頁時建
- 共用燈箱外框（黑底、關閉鈕、Esc 關閉、背景不捲動）：做第一個燈箱時建在 `shared/components/`
- 申請委託的參考圖（`ImageUploadSlot`）要補「點圖開預覽」
- 頁尾與 header 的連結（Logo、瞭解網站、上傳、頁尾導覽、社群）：目前都沒接，等頁面路由
- header 上傳圖示要不要打開「上傳作品選單」（Figma 573:3489）
- 搜尋列和 Figma 的小差異：提示字（程式「輸入搜尋關鍵字」／Figma「輸入關鍵字搜尋」）、放大鏡和字的間距（程式 4／Figma 14）
- 欄位表試算表還有 3 處 `CREATOR_PROFILE.creator_id` 沒改成 `user_id`（COMMISSION_ITEM、ORDER 的外來鍵欄，ORDER.creator_id 那列）
- 首頁自訂標籤列要顯示哪些標籤（熱門前 N 個／固定清單／跟著牆上作品）：spec 2.4 沒寫、api.md 沒有對應 API，目前寫死在 `mocks/tag.ts`，要跟後端討論
- features.md 4.4 的「確認收稿」「前往補款」Figma 貼文裡沒有，做討論牆時確認放哪
