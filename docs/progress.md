# 開發進度

> 主軸寫在這裡，對話被洗掉也不會丟。開新的 Claude session 時先說：「先讀 `docs/progress.md`」。
> 做完一步就把 ⬜ 改成 ✅。規則類的決定寫進 `spec/`（見 CLAUDE.md），這裡只記進度。
> 元件階段與圖片呈現的進度已結束（2026/11/10），舊內容用 `git log -- docs/progress.md` 查。

狀態：⬜ 未做　🔄 進行中　✅ 完成

---

## 目前在做

拼裝頁面：個人資料設定頁完成儲存、大頭照、刪除帳號（2026/11/18）；登入已接假資料，註冊送出還沒做。
個人專頁上傳燈箱：新增、編輯、刪除都能存（2026/11/26，假資料），見下方「個人專頁」；剩**瀏覽器確認**第 1～4 件，和 header 送出後重抓。
下一步：路由守衛（沒登入進 `/me/*` 導回登入頁）；作品展示燈箱、委託商店燈箱（見下方「預定」）；首頁作品牆還欠**瀏覽器確認**篩選與混排、Amilu 燈過濾。

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
  - ✅ 捲到底多顯示（2026/11/16，fddc605）：`allCards` 全部＋`visibleCount` 切片，IntersectionObserver 盯哨兵、每次加 8 張；`WorkCard` 圖片 `loading="lazy"`＋`aspect-ratio: auto 1 / 1` 佔位（沒佔位時圖片高度 0，哨兵一直在畫面裡會連續載到全部）
  - ⬜ 分頁 API、圖片寬高、未登入限制：open-questions.md 第 14 題
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
- ✅ 前端欄位檢查：必填、兩次密碼一致、勾同意條款（2dd7f7a）
- ✅ 登入送出（2026/11/16）：`account/api.ts` 的 `login()` 比對 `mocks/user.ts`（email＋密碼，假資料密碼放明碼），成功 `auth.loginAs` 回首頁、失敗顯示「Email 或密碼錯誤」；測試帳號密碼都是 `demo1234`
- ⬜ 註冊送出：呼叫註冊 API，帳號 ID 重複由後端回錯（acceptance ACC-01）
- ℹ️ 重新整理會變回未登入：登入狀態只存在 Pinia，等後端給 token 再處理
- ⬜ `/register/google` Google 補填資料頁（features.md 1.1、ACC-03、ACC-04）

## 個人資料設定頁（2026/11/16 開始）

- ✅ 第 1 輪：`/me/profile`（`features/profile/routes.ts`、`ProfileSettingsPage.vue`，Figma 547:3017）；個人選單「個人資料設定」用 `to` 換頁並關選單；帳號 ID、email 唯讀，暱稱、簡介複製成草稿
- ✅ 照 Figma 先不放左側選單；features 可唯讀 import `useAuthStore`（structure.md 2.2、3.5）
- ✅ `FormInput` 新增 `requirement`（必填／選填小字）；表單提示小字改 `text-note`、與標籤對齊基線
- ✅ 登入記憶：`useAuthStore` 把帳號 ID 存 localStorage，重新整理會還原（後端好了改存 token）
- ✅ 第 2 輪 儲存變更（2026/11/17，瀏覽器確認完成）：暱稱必填檢查 → `profile/api.ts` 的 `updateProfile`（假 `PATCH /me/profile`）→ `auth.updateCurrentUser` 寫回登入者＋草稿換成存好的值 → `SavedToast` 2 秒（absolute 疊在頁面上方置中）
  - 結構例外補充：其他功能可以呼叫 `updateCurrentUser()` 寫回登入者（structure.md 2.2）
  - ℹ️ 重新整理會變回 `mocks/user.ts` 原值（假資料只在記憶體），等後端；先不用 localStorage 假裝存檔
- 🔄 第 3 輪 大頭照（2026/11/17，瀏覽器確認完成）
  - ✅ `AvatarUpload`：`image-url` 顯示照片、`select` 事件、右側「更換大頭貼」（有圖才出現）；外層改 div（按鈕不能包按鈕）
  - ✅ 選檔＋格式／5MB 檢查＋預覽（`createObjectURL`）；按「儲存變更」才和暱稱、簡介一起送（`ProfileChanges.avatar` 送檔案、`ProfileResult.avatar_url` 回網址）
  - ✅ header 頭像讀登入者：`UserMenu` 傳 `avatar-url` 給 `UserMenuButton`，存好後跟著換
  - ⬜ 正方形檢查：spec 已定（features.md 3.1），程式先不做；做法是 `createImageBitmap` 量長寬
  - ℹ️ 預覽網址沒有 `revokeObjectURL`，換圖多次會多佔記憶體，demo 先不處理
- ✅ 第 4 輪 刪除帳號燈箱（2026/11/18，瀏覽器確認完成）：`DeleteProfileLightbox` 兩層（Figma 545:2014 確認、545:2096 無法刪除）；按「確認刪除」才呼叫 `deleteAccount`（假 `DELETE /me`），有進行中案件或帳號鎖定就換無法刪除層；能刪就登出回首頁
  - 共用元件：`Lightbox` 加 `size="sm"`（寬 560、高度跟內容）；`Button` 加 `variant="danger"`（實心橘）
  - spec：features.md 3.1、acceptance CTR-02 改兩層流程；structure.md 2.2 例外補 `logOut()`（只限刪除帳號後）
  - ⬜ 「前往約稿管理」還沒接（`/me/orders` 已有，下一步接 `router.push('/me/orders')`）；假資料不會真的改 `account_status`
- ⬜ 沒登入進 `/me/*` 導回登入頁（路由守衛）

## 約稿管理（2026/11/18 開始）

- ✅ 共用準備：`OptionButton` 搬到 `shared/` 並改成 generic（v-model 可綁精確字串型別）；新增 `shared/components/TabBar.vue`（token `--color-tab-active`）；`public/icons/store.svg`（第 4 輪未開通空狀態用）
- ✅ 第 1 輪 頁面骨架：`/me/orders`（`order/routes.ts`、`OrderManagementPage.vue`，Figma 559:2525）；個人選單「約稿管理」接上（`UserMenu` 第二組補 `@click`）；主頁籤記在網址 `?tab=commissioned|received`（computed get／set ＋ `router.replace`），子頁籤 `phase` 用 ref
- ✅ 第 2 輪 列表資料：`order/api.ts` 的 `fetchOrders(role, phase)`（假 `GET /orders`）依角色篩、依狀態分進行中／歷史、`created_at` 新到舊；`watch([tab, phase], …, { immediate: true })` 重拿
  - `Order` 補 `created_at`、`quote_amount` 改可 null（待報價沒有金額）；mocks 補到 8 筆（o_001～o_008，im_temp_id 兩種身分都有）
  - spec：features.md 3.7 寫進行中＝待報價／待付款／製作中，歷史＝三種終態
- ✅ 第 3 輪 卡片細節（程式完成，待瀏覽器確認）：對方暱稱／頭像、金額、時間列後半段（`timeInfoOf`）、右側按鈕或灰字（`actionOf`）
  - 新型別 `OrderListItem`（ORDER ＋ 雙方 USER 摘要 ＋ `payment_due_at` ＋ `current_stage`），mock `MOCK_ORDER_LIST`；api.md 寫進列表回應草案，**待和淳確認**
  - features.md 3.7 補案件卡右側規則表（Figma 只畫已委託｜進行中）；按鈕先不接換頁（報價、付款、討論牆頁還沒做）
  - ℹ️ 時間列連接符號用 `|`（彥廷決定，Figma 是 `・`）；子頁籤文字目前「已結案」，spec／Figma 是「歷史」，待彥廷決定
- ✅ 第 4 輪 空狀態（2026/11/19，程式完成，待瀏覽器確認）：列表區三選一 ①已接案＋未開通（隱藏子頁籤）②沒有案件 ③列表
  - 新共用元件 `shared/components/EmptyState.vue`（Figma 559:3152，圖示＋標題＋說明＋`#action`）
  - `order/api.ts` 的 `fetchIsCreator()` 讀 `store_approved`（之後改 `GET /me`），頁面 `onMounted` 問一次
  - ⬜ 「前往開通」等 `/me/activate` 做好再接；沒有案件的空狀態暫用商店圖示（Figma 沒畫）

## 接案設定（2026/11/19）

- ✅ 共用準備：`FormInput` 加 `maxlength`／`inputmode`／`labelHidden`；`SavedToast` 改成自己固定在視口上方中央（`position: fixed`），個人資料頁拿掉自己的定位
- ✅ 型別與假資料：`profile/types.ts`（`CreatorSettings`、`DepositPercent`、`LightStatus`，欄位照 FigJam CREATOR_PROFILE 表）；`mocks/creatorProfile.ts` 補齊 8 欄
- ✅ 第 1 輪 頁面骨架：`/me/settings`（`CreatorSettingsPage.vue`，Figma 1053:14412）；個人選單「接案設定」接上；`fetchCreatorSettings()`（假 `GET /me/creator-settings`），沒開通顯示 `EmptyState`
- ✅ 第 2 輪 表單與草稿：6 個草稿 ref、`resetDrafts()`（拿到設定後、取消變更）、`isDirty` 決定儲存鈕能不能按
- ✅ 第 3 輪 儲存（程式完成，待瀏覽器確認）：4 格檢查＋紅字；`updateCreatorSettings()`（假 `PATCH /me/creator-settings`），燈有改才呼叫 `updateAmiluLight()`（假 `PATCH /me/creator-settings/amilu-light`）；存好寫回、顯示提示 2 秒
  - ✅ 訂金選項畫面改「不收訂金（一次付清）」、說明改照 spec（資料值仍是 `無需先支付`）；Figma 待同步（data-model.md 6 第 15 項）
  - ⬜ `deposit_percent` 資料值要不要一起改名，待和淳確認
  - ⬜ 「前往開通」等 `/me/activate`

## 個人專頁（2026/11/20 開始，`/users/:userId`，Figma 569:3298，features.md 2.7）

- ✅ 第 1 塊 頁面＋路由：`explore/pages/UserProfilePage.vue`、`explore/routes.ts` 加 `users/:userId`；個人選單「個人專頁」接上（`UserMenu`、`userMenuItems`）
- ✅ 第 2 塊 資料：`fetchAuthorProfile(userId)`（假 `GET /users/{id}`）回 `ProfileAuthor`；`mocks/follow.ts`（FOLLOW，followers／following 即時計數）；`mocks/order.ts` 補 `rating_for_creator`、o_009／o_010
- ✅ 第 3 塊 上方個人資訊（待瀏覽器確認）：大頭照、暱稱＋接案狀態、@id、合作評分（半顆星用 clip-path）、簡介、追蹤數；載入中／查無此用戶兩種狀態
  - 合作評分規則寫進 features.md 2.7＋changelog
- 🔄 第 4 塊 頁籤（作品牆／可委託項目）：`TabBar` 已放上、點擊可切換
  - ⬜ 決定 `tab` 用網址版（現在，computed get/set）還是 `ref('works')` 簡單版
  - ⬜ 頁籤值 `commissions` 和 structure.md 3.5 的 `?tab=items` 統一
  - ✅ 下方依 `tab` 顯示作品牆／可委託項目（2026/11/22）
  - ⬜ 「＋ 上傳作品」按鈕：只有看自己的頁才出現（比對登入者 id 和 `userId`）
- 🟡 第 5 塊 卡片牆（2026/11/22，待瀏覽器確認）
  - ✅ `fetchProfileWorks`／`fetchProfileCommissionItems` 回 `ProfileCard`（封面、類型・用途；可委託項目多接「NT$ 1,500 起」）；`ProfileWorkCard` 用 grid 排（`minmax(0, 1fr)` 才會截斷長標題）
  - ✅ 0 件時各自顯示 EmptyState；找不到人／載入中不顯示頁籤與卡片
  - ✅ 作品卡開作品燈箱、可委託卡開委託商店燈箱並展開被點的那筆
  - ✅ 委託商店燈箱左側圖片打開時停在被點項目的第一張（`startIndex` → `LightboxLayout` → `ImageScrollList`，spec 2.6「預設定位」）
  - ✅ 委託商店燈箱左右連動（2026/11/23，spec 2.6）：右側點列 → 左側捲到該項目第一張；左側捲動 → 右側換選取（`scrollTargetId` 和 `selectedItemId` 分開，避免左側被拉回）。已知小漏洞：startIndex 沒變時（例如手動捲走後再點同一個項目）左側不會捲
  - ✅ 卡片右下「⋯」選單（2026/11/23，spec 2.7）：`CardMoreMenu`／`CardMoreMenuItem`（樣式照 UploadMenu）；只在自己的頁顯示；刪除先跳 `DeleteConfirmLightbox`
    - ✅ 「確認刪除」：`onConfirmDelete` 依 tab 刪作品或項目，再重抓兩面牆（第 4 件）
    - ✅ 「編輯」：`editingId`＋`closeUpload`，燈箱收到 `work-id`／`item-id` 就是編輯模式，打開時 `fetchWorkForEdit`／`fetchCommissionItemForEdit` 填回表單
  - 🔄 上傳燈箱（features.md 3.2、3.3；2026/11/25 彥廷兼做後端，API 缺口直接定進 api.md 5.9）
    - ✅ `UploadWorkLightbox`、`CommissionItemLightbox`（含 `ClassificationFields`、`TagInput`）；header 上傳選單、頭像選單、個人頁「上傳作品 +」（看 tab 開哪個）都接上
    - ✅ 第 1 件 一般作品新增能存：`NewWork`＋`createWork`（假 POST /works）；燈箱 `onSubmit`＋`isSubmitting`（try/finally）；頁面 `onUploaded` 關燈箱＋重抓兩面牆；⬜ 瀏覽器確認
    - ✅ 第 2 件 委託項目新增能存：`NewCommissionItem`＋`createCommissionItem`（假 POST /commission-items）；price 用 `Number()`、商用用 `=== 'true'` 轉；⬜ 瀏覽器確認（價格 800 → 卡片「NT$ 800 起」）
    - ✅ 第 3 件 編輯能存（2026/11/26）：`WorkChanges`／`CommissionItemChanges`＋`updateWork`／`updateCommissionItem`（假 PATCH，整份覆蓋）；圖片送 `kept_image_urls`（舊圖，照畫面順序）＋新的 `images`，seq_no 舊圖在前重編；兩個燈箱共用 `base` 物件；⬜ 瀏覽器確認
    - ✅ 第 4 件 刪除（2026/11/26）：`deleteWork`／`deleteCommissionItem` 放 `explore/api.ts`（呼叫的頁面在 explore），假 DELETE 真刪主表＋圖片列＋標籤列；`ORDER.item_id` 設空留 TODO（mock 訂單沒有這欄）；⬜ 瀏覽器確認
    - ⬜ header 送出後要重抓（AppHeader TODO）；未開通者導去開通流程（等開通頁）
- ⬜ 追蹤清單燈箱（features.md 2.8）、follow 按鈕（看別人的頁才有）

## 預定

- ✅ header 上傳圖示打開上傳選單（`UploadMenu`，2026/11/16）：一般貼文／委託項目，和頭像選單共用 `UPLOAD_ITEMS`；點選項目前只關選單，等上傳頁路由

- 🟡 作品展示燈箱（features.md 2.5，`WorkLightbox`）：已接首頁卡片，待瀏覽器確認；還沒做「我要委託」、點頭像看完整專頁
- 🟡 委託商店燈箱（features.md 2.6，`CommissionShopLightbox`）：已接首頁可委託卡片與作品燈箱的「查看可委託項目」，待瀏覽器確認；「我要委託」等申請頁路由
- 燈箱共用：外框 `shared/components/Lightbox.vue`（黑底、✕、Esc、背景不捲動）、左右版型 `explore/components/LightboxLayout.vue`；手機版上圖下文是前端自訂（Figma 只有桌機）
- 燈箱圖片捲動方向（2026/11/16 彥廷決定）：手機**橫向**左右滑、對齊左緣；平板以上垂直、捲軸放左側。spec 2.5 與 changelog 已同步
- mock 補了 `USER.bio`、`mocks/creatorProfile.ts`（`light_status`、`store_approved`）、w_001／w_003 多張圖

---

## 做到再處理

- 「忘記密碼？」：spec 沒有這個流程、也沒有網址，目前是純文字，要跟後端確認做不做
- 「服務條款與隱私權政策」連結：條款頁還沒有，註冊頁目前只有底線
- 個人中心外框（左側選單＋右邊內容）：Figma 547:3017 沒畫，`/me/profile` 先不放；做第二個個人中心頁（接案設定）時決定
- 申請委託的參考圖（`ImageUploadSlot`）要補「點圖開預覽」
- 頁尾與 header 的連結（瞭解網站、上傳、頁尾導覽、社群）：目前都沒接，等頁面路由。header Logo 已接（2026/11/16）：回首頁；已在首頁時 `DefaultLayout` 改 `RouterView` 的 key 重建首頁（登入狀態保留）
- 搜尋列和 Figma 的小差異：提示字（程式「輸入搜尋關鍵字」／Figma「輸入關鍵字搜尋」）、放大鏡和字的間距（程式 4／Figma 14）
- 欄位表試算表還有 3 處 `CREATOR_PROFILE.creator_id` 沒改成 `user_id`（COMMISSION_ITEM、ORDER 的外來鍵欄，ORDER.creator_id 那列）
- 首頁自訂標籤列要顯示哪些標籤（熱門前 N 個／固定清單／跟著牆上作品）：spec 2.4 沒寫、api.md 沒有對應 API，目前寫死在 `mocks/tag.ts`，要跟後端討論
- features.md 4.4 的「確認收稿」「前往補款」Figma 貼文裡沒有，做討論牆時確認放哪
