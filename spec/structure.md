# Amilu 專案結構規範

> 這份回答「東西該放哪」：程式碼資料夾怎麼分、資料怎麼存與流動、文件與資產怎麼歸類。
> 每條規則都附「為什麼」，之後遇到沒寫到的情況，用第 1 節的三個問題自己推。
> 功能切分對應 [features.md](features.md) 五大模組，型別對應 [data-model.md](data-model.md)。

---

## 1. 先問三個問題

任何檔案或資料，放之前先問：

| 問題 | 答案 → 位置 |
| --- | --- |
| **誰擁有它？** | 只有一個功能用 → 放該功能的資料夾。兩個以上功能用 → 才升到 `shared/`。 |
| **它活多久？** | 一個元件內 → `ref`。跨頁面、跨元件 → Pinia。重新整理後還要在 → 後端或 localStorage。 |
| **它是程式、資料，還是文件／資產？** | 程式 → `src/`。經 Vite 處理的圖 → `src/assets/`。固定網址的檔案 → `public/`。規則與圖連結 → `spec/`。 |

**延後共用**：先放在第一個用到它的功能裡，第二個功能也要用時才搬到 `shared/`。
為什麼：太早抽共用，常抽出一個只有一處在用、介面還沒穩定的東西，反而更難改。

---

## 2. 程式碼結構（`src/`）：按功能分，不按檔案類型分

不要所有元件丟一包、所有 store 丟一包。檔案一多，改一個功能要同時跑五個資料夾，這就是「亂」的來源。
改成每個功能自己帶齊所需的東西，只有共用的才抽出去。

```
src/
├─ main.ts, App.vue
├─ styles/                  全域樣式、design token（SCSS，數值唯一來源；規則見 design-spec.md）
├─ router/index.ts          只組裝：匯入各功能的 routes.ts
├─ layouts/                 整站共用的外框（header 等），元件放 layouts/components/
├─ features/                一個資料夾 ＝ 一個業務模組
│  ├─ account/              模組一：註冊登入、手機驗證、身份
│  ├─ explore/              模組二：作品牆、篩選、燈箱、創作者頁、追蹤
│  ├─ profile/              模組三：個人資料、上傳作品／可委託項目、接案設定
│  ├─ order/                模組四：申請、報價、付款、討論牆、結案、終止
│  └─ notification/         模組五：通知、評價
├─ shared/                  兩個以上功能都用到才放這裡
│  ├─ components/           純 UI（Button、Modal、Lightbox），不認識任何業務
│  ├─ composables/          useDebounce、usePolling …
│  ├─ api/client.ts         唯一的 fetch 包裝：base URL、token、錯誤格式
│  ├─ types/                跨功能型別（分頁、錯誤格式）
│  ├─ utils/                純函式（金額格式化、日期、storage 包裝）
│  └─ constants.ts          全站固定值（預設頭像路徑等），不含業務
├─ assets/                  需經 Vite 處理的圖、字型
├─ dev/                     只在開發模式出現的頁面（如元件測試頁），正式版不登記路由
└─ mocks/                   後端未完成前的假資料
```

### 2.1 每個功能內部長一樣

```
features/order/
├─ pages/          路由頁面（*.vue），只負責組裝
├─ components/     只有這個功能用的元件
├─ composables/    use*.ts，放畫面邏輯
├─ api.ts          這個功能的後端呼叫，只做 request
├─ store.ts        Pinia，需要跨頁共享才建
├─ types.ts        型別，對應 data-model.md 的表
├─ constants.ts    這個功能共用的固定選項（例：作品分類清單），元件和頁面都要用時放這裡
├─ routes.ts       這個功能的路由
└─ index.ts        （選用）對外公開的東西
```

用不到的檔案就不要建。只有兩頁的功能，不需要 `composables/` 空資料夾。

### 2.2 規則與原因

| 規則 | 為什麼 |
| --- | --- |
| **依賴方向單向**：`features → shared`（`router/`、`main.ts` 這類啟動檔可以引用 `features`）。`features` 之間不互相 import。 | 避免 A 依賴 B、B 又依賴 A 的纏繞。真要共用就升到 `shared/`。 |
| **開發用頁面放 `dev/`**：檔名照頁面規則（`ComponentPlaygroundPage.vue`），路由寫在 `router/index.ts`，只在 `import.meta.env.DEV` 時登記，網址以 `/dev/` 開頭。`dev/` 可以 import `shared/`、`layouts/`、`features/`，任何正式程式都不能 import `dev/`。 | 元件測試頁不屬於任何功能；只在開發模式登記，正式網站就不會多出這些頁面。要展示 `features/` 內的元件（如 `OrderStatusTag`）所以允許引用；`dev/` 沒人引用，依賴方向不變。 |
| **頁面薄、邏輯下沉**：`pages/*.vue` 只組裝，邏輯進 `composables/`。 | 頁面一長就難讀；邏輯在 `.ts` 裡才好測試。 |
| **訂單狀態判斷寫成純函式**，放 `features/order/`。 | 狀態機規則多（見 [order-lifecycle.md](order-lifecycle.md)），純函式可以單獨測，不需要開瀏覽器。 |
| **元件不直接 fetch**，一律經 `api.ts`。 | 之後換後端路徑、補驗證、加 mock，只改一處。 |
| **一律用別名** `@/features/order/…`（vite.config.ts 已設定），不寫 `../../..`。 | 搬檔案時 import 不會斷。 |
| **共用 UI 不認識業務**：`shared/components/` 裡不出現 order、creator 這類詞。 | 一旦認識業務，就該回到某個功能裡。 |
| **`:src` 綁定的圖片路徑要接 `import.meta.env.BASE_URL`**，路徑開頭不加 `/`（例：`base + 'icons/x.svg'`）。模板寫死的 `src="/icons/…"` 和 CSS `url()` 不用。 | Vite 只會替寫死的路徑自動補部署子路徑，不會改 JS 字串；不接的話部署到子路徑會 404（2026/10/26 用 `--base` 打包驗證過）。 |

### 2.3 命名

| 對象 | 規則 | 例 |
| --- | --- | --- |
| 元件檔 | `PascalCase.vue` | `OrderStageCard.vue` |
| 頁面檔 | `PascalCase` + `Page` | `OrderDetailPage.vue` |
| 其他 ts 檔 | `camelCase.ts` | `api.ts`、`useOrderStatus.ts` |
| 資料夾 | 小寫英文，多字用連字號 | `features/order/` |
| composable | `use` 開頭 | `usePolling` |
| Pinia store | `useXxxStore` | `useAuthStore` |
| 型別 | `PascalCase`，欄位沿用後端 snake_case | `Order`、`order_id` |

---

## 3. 資料怎麼存、怎麼流

### 3.1 存哪裡

| 資料種類 | 放哪 | 例 |
| --- | --- | --- |
| 後端回傳的資料形狀 | `features/*/types.ts`，欄位原樣用 snake_case，與 data-model.md 一致 | `Order`、`OrderStage` |
| 畫面用的衍生值 | `computed` 或 composable，**不存** | 補款金額、每階段金額 |
| 單頁暫存 | 元件內 `ref` | 表單輸入中 |
| 跨頁共享 | Pinia store | 登入中的使用者、通知未讀數 |
| 重新整理後要保留的偏好 | localStorage，經 `shared/utils/storage.ts`，key 加 `amilu:` 前綴 | 已看過的提示 |
| 後端未完成時的假資料 | `src/mocks/`，一個功能一檔，用 `types.ts` 約束形狀 | `mocks/order.ts` |

為什麼欄位不另取別名：前後端用同一個名字，查 data-model.md 就找得到，不用多維護一份對照表。

為什麼衍生值不存：和 data-model.md 5.1「哪些值刻意不存」同一個道理。存起來就多一份可能與來源對不上的資料。

### 3.2 流向

```
page ─▶ composable／store ─▶ api.ts ─▶ shared/api/client.ts ─▶ 後端
```

- 同一份後端資料只在一個地方持有，其他地方讀它，不複製一份改。
- 列表、詳情的快取先不做。有實際效能問題再加，不要預先為每張表建 store。
- 後端還沒好時，在 `api.ts` 內改回傳 `mocks/` 的資料，頁面和 store 不用動。

---

## 3.5 頁面與網址

> 2026/11/10 定案。每個 feature 的 `routes.ts` 照這張表登記；新增頁面先改這張表。功能內容見 [features.md](features.md)。

| 規則 | 為什麼 |
| --- | --- |
| **燈箱沒有網址**（作品燈箱、委託商店燈箱、追蹤清單、上傳燈箱等），由所在頁面用狀態打開。 | MVP 不需要分享燈箱連結；有網址就要處理「直接打開網址時背後顯示哪一頁」。 |
| **同一筆訂單共用一個網址** `/orders/:orderId`，頁面依 `ORDER.status` 切換（待報價、報價、討論牆、結案）。離開案件畫面的頁面（付款、取消通知、契約）才另開網址。 | 狀態是同一筆資料在不同時間的樣子，拆網址反而要處理「網址和狀態對不上」。 |
| **個人中心每項各有網址**，共用左側選單外框，只換右邊內容（巢狀路由）。 | 看起來和「不換頁」一樣，但重新整理、上一頁都會停在原本那項。 |
| **篩選、頁籤放網址參數**（`?q=`、`?tab=`），不另開網址。 | 同一頁的不同顯示方式；放參數才能重新整理後保留。 |
| **外框分兩種**：一般頁面套 `DefaultLayout`（header＋footer）；帳號頁（登入、註冊、補填資料、手機驗證）只有左上角 Logo，不套 header、footer。 | 帳號流程要專心填完，不放其他入口。 |

🔒＝要登入。

| 模組 | 網址 | 頁面 | 外框 | spec |
| --- | --- | --- | --- | --- |
| 帳號 | `/login` | 登入 | 只有 Logo | 1.1 |
| 帳號 | `/register` | 註冊 | 只有 Logo | 1.1 |
| 帳號 | `/register/google` | Google 補填資料 | 只有 Logo | 1.1 |
| 帳號 | `/verify-phone` 🔒 | 手機驗證（兩個入口共用，完成後回原頁） | 只有 Logo | 1.2 |
| 探索 | `/` | 首頁作品牆（搜尋、篩選放參數） | Default | 2.1–2.4 |
| 探索 | `/users/:userId` | 創作者個人頁（`?tab=items` 切到可委託項目） | Default | 2.7 |
| 個人中心 | `/me/profile` 🔒 | 個人資料設定 | Default＋左側選單 | 3.1 |
| 個人中心 | `/me/settings` 🔒 | 接案設定 | Default＋左側選單 | 3.5 |
| 個人中心 | `/me/orders` 🔒 | 約稿管理（`?tab=commissioned`／`received`） | Default＋左側選單 | 3.7 |
| 個人中心 | `/me/activate` 🔒 | 開通創作者商店（三步驟清單） | Default＋左側選單 | 3.4 |
| 個人中心 | `/me/activate/done` 🔒 | 開通成功 | Default＋左側選單 | 3.4 |
| 委託 | `/orders/new?item=:itemId` 🔒 | 委託申請頁 | Default | 4.1 |
| 委託 | `/orders/:orderId` 🔒 | 案件頁（依狀態：待報價、報價、討論牆、結案） | Default | 4.2、4.4、4.5 |
| 委託 | `/orders/:orderId/payment` 🔒 | 付款資訊頁 | Default | 4.3 |
| 委託 | `/orders/:orderId/payment/transfer` 🔒 | 請前往完成付款（補款、補付共用） | Default | 4.3、4.4、4.5 |
| 委託 | `/orders/:orderId/cancelled` 🔒 | 已成功取消／付款逾期通知 | Default | 4.3、4.8 |
| 委託 | `/orders/:orderId/contract` 🔒 | 契約紀錄 | Default | 4.6 |
| 其他 | `/about` | 網站說明（header「瞭解網站」、footer「網站說明」） | Default | — |

通知與評價沒有獨立頁面：通知是 header 下拉，評價在結案畫面與約稿管理。`:userId` 是 `USER.id`（帳號 ID）。

---

## 4. 專案層的文件與資產

```
Amilu/
├─ spec/          規則的唯一來源（本資料夾）
├─ docs/          （選用）開發筆記、決策紀錄。有需要時才建
├─ public/        不經處理、網址固定的檔案（favicon）
├─ src/           程式碼
└─ 根目錄只放設定檔：package.json、vite.config.ts、tsconfig*、.prettierrc.json …
```

| 規則 | 為什麼 |
| --- | --- |
| 規則只寫在 `spec/` 一處，其他地方用連結（沿用 [README.md](README.md) 修改規則 3）。 | 同一條規則寫兩處，遲早不一致。 |
| 設計稿、ER 圖、流程圖的連結放 `README.md`，repo 內不放大型二進位圖。 | 圖在 Figma／FigJam 才是最新版。 |
| 檔名一律英文小寫加連字號，中文只出現在內容。 | 避免跨系統與 URL 的編碼問題。 |
| 範例檔（如 `stores/counter.ts`）在建立第一個真功能時刪掉。 | 免得之後分不清哪些是正式的。 |

---

## 5. 套規則練習

| 情境 | 結論 | 依據 |
| --- | --- | --- |
| 作品卡片元件，目前只有首頁作品牆用 | `features/explore/components/` | 只有一個功能用。創作者頁也要用時，再評估升到 `shared/`。 |
| 訂單狀態的中文標籤對照 | `features/order/`（例如 `statusLabel.ts`） | 屬於訂單業務；通知要顯示時，從 order 的公開出口取，不複製一份。 |
| 目前登入的使用者 | `features/account/store.ts` 的 `useAuthStore` | 跨頁共享，且屬於帳號模組。 |
| 補款金額 | composable 算出：`quote_amount` − 已託管入款加總 | 衍生值不存（data-model.md 4.4）。 |
| 金額格式化函式 | `shared/utils/` | 多個功能都用，且不含業務。 |
| 輪詢通知未讀數 | `shared/composables/usePolling.ts` ＋ `features/notification/store.ts` | 輪詢是通用能力，未讀數是通知業務。 |

---

## 6. 還沒決定的事

- features 之間偶爾需要共用業務邏輯（如通知要顯示訂單狀態）。目前做法：從該功能的 `index.ts` 取。若實際痛點變多，再討論是否獨立成 `domain/`。
- 要不要用 ESLint 規則強制依賴方向：等專案跑起來、結構穩定後再決定。
- 不設 `app/` 層（2026/10/19）：樣式放 `src/styles/`、router 放 `src/router/`。樣式是全站共用、不屬於任何功能，`app/` 只剩一個 router 時多一層沒有意義。
