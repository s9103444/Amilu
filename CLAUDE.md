# Amilu

台灣 CG 市場的雙向委託平台（委託人 ↔ 創作者）。專題 demo：金流純模擬，沒有營運後台。

## 技術與分工

- 前端：Vue 3 + Vite + Pinia + Vue Router + TypeScript（彥廷）
- 後端：Python / FastAPI（淳）
- E2E：預計 Playwright（負責人待定）

## 指令

- `npm run dev`：開發伺服器
- `npm run build`：type-check 後打包
- `npm run type-check`：只做型別檢查
- `npm run format`：Prettier 格式化 `src/`
- 目前**沒有** lint 與測試指令

## 樣式與風格

- 樣式用 SCSS + CSS 變數，放 `src/styles/`。數值來源是 [spec/design-spec.md](spec/design-spec.md)（以 Figma 為準）。
- **元件只用 semantic token**（如 `--color-text-primary`），不直接用 primitive、不自己寫色碼。token 定義在 `src/styles/_tokens.scss`。
- 斷點用 `src/styles/_breakpoints.scss` 的 mixin（手機優先），不手寫 media query。
- 字級用 `.text-*` class（`src/styles/_typography.scss`）。
- 字體 GenSenRounded2 TC 自行託管在 `public/fonts/`，不換字體、不引外部字體。
- 格式化以 `.prettierrc.json` 為準，用 `npm run format`。
- import 一律用 `@/` 別名（已設於 vite.config.ts）。

## 放檔案前先看結構規範

新增或搬移檔案前，先讀 [spec/structure.md](spec/structure.md)。位置不符規範時，先提醒我，再動手。
重點：`src/` 按功能分（`features/`），共用才放 `shared/`；`features` 之間不互相 import。

## 規則以 spec 為準

做功能前先讀對應的 spec，不要憑印象。入口：[spec/README.md](spec/README.md)。

- 功能怎麼運作：`spec/features.md`
- 訂單狀態、倒數、金額：`spec/order-lifecycle.md`
- 資料表與欄位：`spec/data-model.md`（欄位清單以 FigJam 為準）
- API：`spec/api.md`（草案，尚未與後端對過）

改規則時：改對應的 spec 檔，並在 `spec/changelog.md` 最上面記一筆（含日期）。同一條規則只寫一處，其他地方用連結。
Figma／FigJam 我無法改動，spec 改了需同步時，記在 `spec/data-model.md` 第 6 節。

## 用詞

甲方＝委託人＝`commissioner`；乙方＝創作者＝`creator`。程式與資料表用英文，欄位沿用 `data-model.md` 的 snake_case，不另取別名。

## 容易做錯的領域規則

- **衍生值不存**：補款金額、每階段金額、Amilu 燈、目前進行到哪階段，都由來源算（`data-model.md` 5.1）。
- **契約快照**：項目標題、說明、圖片、訂金比例、修改次數、分段方案在「送出申請」時複製進訂單，案件畫面一律讀快照，不讀即時的可委託項目。
- **三點分段**的 `stage_no` 是 1／4／5，不遞補。
- **終態案件**（已完成、已取消、已終止）所有操作鎖死，聊天室唯讀。

## 溝通

- 用繁體中文回覆。
- 團隊成員的作業系統不同（Windows、macOS），指令與路徑不要假設特定系統，以當下對話的實際環境為準。
