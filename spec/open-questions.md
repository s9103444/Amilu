# Amilu 待討論事項

> 這份列出「還沒決定、需要組員一起拍板」的事。每題都有現況、為什麼是問題、選項與建議。
> 討論完把結果填進「決議」欄，並把相關規則寫回對應的 spec，再到 [changelog.md](changelog.md) 記一筆。
> 整理日期：2026/10/19。

| #   | 題目                                    | 誰決定               | 狀態 |
| --- | --------------------------------------- | -------------------- | ---- |
| 1   | repo 外的討論紀錄與流程圖怎麼共享       | 彥廷、使用者         | ✅   |
| 2   | 字體檔 33MB 已進 git，要不要瘦身        | 全組                 | ✅   |
| 3   | design-spec.md 與 `_tokens.scss` 重複   | 負責樣式的組員       | ✅   |
| 4   | 字體路徑用絕對路徑，部署到子路徑會壞    | 全組（先定部署方式） | ✅   |
| 5   | `npm run format` 可能大幅改寫部分樣式檔 | 負責樣式的組員       | ✅   |
| 6   | 組員用的 AI 工具是否需要對應設定檔      | 全組                 | ✅   |
| 7   | favicon 還是 Vite 預設圖                | 設計                 | ✅   |
| 8   | 何時加 ESLint 與測試                    | 全組                 | ✅   |
| 9   | Figma 案件狀態標籤多出 3 個狀態         | 全組、設計           | ⏳   |
| 10  | 基礎元件下半部 Figma 與程式的小差異     | 負責樣式的組員、設計 | ⏳   |
| 11  | 組合元件（案件卡、進度條等）Figma 沒畫的部分 | 設計                 | ⏳   |

---

## 1. repo 外的討論紀錄與流程圖怎麼共享

**現況**：`spec/README.md`、`features.md`、`order-lifecycle.md`、`changelog.md` 指向 `../討論紀錄/Excalidraw/…` 與 `討論紀錄/延伸檔案/…`。這個資料夾在使用者本機的 Obsidian，不在 repo。
**問題**：其他組員（Mac、Windows 都一樣）點不開這些連結，也看不到流程圖。
**要先確認**：彥廷現在是怎麼拿到這些檔案的？（本機複製、雲端硬碟、還是沒有拿到？）

| 選項 | 做法                                                   | 優點                               | 缺點                                    |
| ---- | ------------------------------------------------------ | ---------------------------------- | --------------------------------------- |
| A    | 維持在本機，只在 spec 註明「不在 repo」                | 不用動                             | 組員看不到圖，spec 的流程圖連結形同失效 |
| B    | 匯出成 SVG／PNG，放 `docs/flow/`，連結改指 repo 內路徑 | 版本控制、人人可看                 | 要手動匯出，圖更新要記得重匯            |
| C    | 圖放 Figma／FigJam，spec 只放網址                      | 圖一直是最新版，符合 spec 現有做法 | 要把 Excalidraw 內容搬過去              |

**建議**：B 或 C。流程圖是 spec 的參考資料，組員必須看得到。圖少且穩定選 B，常改選 C。
**決議**（2026/10/19）：討論紀錄（文字總結、Excalidraw 流程圖、ER 草案）統一在 [--Amilu repo](https://github.com/s9103444/--Amilu) 更新；規格以這個 repo 的 `spec/` 為唯一來源，--Amilu 內舊的 `spec/` 副本移除，兩邊只用文字路徑互相指引。

## 2. 字體檔 33MB 已進 git，要不要瘦身

**現況**：`public/fonts/gensen-rounded2-tc/` 約 150 個 woff2 分片、共 33MB，已進 git 歷史。字重有 R、M、B、H（H 900 只用在 Logo）。
**問題**：每次 clone 都要下載；歷史一旦進去就很難移除，專案越久越難處理。現在專案小，是最容易處理的時機。

| 選項 | 做法                                                | 優點                | 缺點                                       |
| ---- | --------------------------------------------------- | ------------------- | ------------------------------------------ |
| A    | 維持現狀                                            | 不用動，demo 可接受 | clone 較大                                 |
| B    | 只留實際用到的字重（例如拿掉 H，Logo 改用圖片或 B） | 約少四分之一        | 要確認 Logo 做法；仍需重寫歷史才能真正縮小 |
| C    | 改用 Git LFS 或外部託管                             | 長期最乾淨          | 設定較複雜，每位組員都要裝 LFS             |

**注意**：要真正縮小 repo 需要重寫 git 歷史並 force push，必須全組同意、同一時間重新 clone。
**建議**：先確認 H 900 是否真的需要。若 demo 不在意 clone 大小，選 A。
**決議**（2026/10/19）：選 B。Logo 改用圖片，刪除 H 900 字重（約少 8MB）；M 500 保留（`.text-small` 在用）。不重寫 git 歷史、不做外部託管，既有歷史裡的檔案維持原樣，clone 大小不變。

## 3. design-spec.md 與 `_tokens.scss` 重複

**現況**：色碼表、字級表、Grid 表同時存在於 `spec/design-spec.md` 與 `src/styles/_tokens.scss`、`_breakpoints.scss`。`design-spec.md` 檔頭已預告「前端實作後，這份只保留規則與 token 在哪個檔案，色碼表刪掉」。
**問題**：違反 spec/README 修改規則 3（同一條規則只寫一處），日後改一邊忘了另一邊就會不同步。目前兩邊的數值一致（2026/10/19 核對過）。
**選項**：A 現在就刪表，改成指向 `_tokens.scss`；B 先留著，等設計穩定再刪；C 永久保留兩份，但在 `design-spec.md` 註明以 Figma 為準。
**建議**：A。專案還小，現在刪成本最低。
**決議**（2026/10/19）：選 A。`design-spec.md` 刪掉色碼、字級 px、Grid 數值表，數值只留 `src/styles/`；保留 Figma 連結、調性、命名對照、各色與字級的用途、Google 色與 rainbow 漸層的例外。

## 4. 字體路徑用絕對路徑，部署到子路徑會壞

**現況**：`_fonts.scss` 寫 `url("/fonts/…")`。router 有用 `import.meta.env.BASE_URL`，字體沒有。
**問題**：若部署在子路徑（例如 GitHub Pages 的 `/amilu/`），字體會 404。
**要先確認**：demo 要部署在哪裡？根路徑還是子路徑？
**驗證**（2026/10/19）：用 `vite build --base=/amilu/` 打包到暫存資料夾，字體 `url()`、`favicon`、JS 路徑都自動加上 `/amilu/`，所以字體路徑不用改。
**建議**：若確定根路徑，不用改；若有子路徑可能，只需在 `vite.config.ts` 設 `base`。
**決議**（2026/10/19）：字體路徑維持 `/fonts/…`，不改成相對路徑（有 Vue Router 的多層網址，相對路徑會找錯）。部署平台還沒選，現在不設 `base`，以免本機網址變成 `localhost:5173/<repo>/`。部署前選平台：GitHub Pages 這類子路徑就在 `vite.config.ts` 加 `base: '/<repo 名稱>/'`；Netlify、Vercel、Cloudflare Pages 這類根路徑不用改。

## 5. `npm run format` 可能大幅改寫部分樣式檔

**現況**：`_fonts.scss` 是 150 行壓成單行的 `@font-face`，`_typography.scss` 用單行規則。`npm run format` 會處理整個 `src/`。
**問題**：跑 format 可能一次改動大量行，造成難讀的 diff。2026/10/19 已驗證：`_fonts.scss` 會從 113 行展開成 5837 行，`_typography.scss` 從 19 行變 41 行，`_tokens.scss` 只動 3 行。
**建議**：若 `_fonts.scss` 被改，加 `.prettierignore` 排除它。
**決議**（2026/10/19）：新增 `.prettierignore` 排除 `src/styles/_fonts.scss`（由字體工具產生、不手改）；`_typography.scss`、`_tokens.scss` 跑一次 `npm run format` 並 commit，之後再跑不會有排版差異。

## 6. 組員用的 AI 工具是否需要對應設定檔

**現況**：根目錄有 `CLAUDE.md`，Claude Code 會自動讀。
**問題**：若有組員用 Cursor、Copilot 或其他工具，那些工具不會讀 `CLAUDE.md`，就不會遵守同樣的結構與樣式規則。
**選項**：A 只用 Claude Code，不處理；B 各工具另放一份設定，內容都指向 `spec/`；C 統一規範，請組員都讀 `spec/structure.md`。
**建議**：先問每位組員用什麼工具，再決定。
**決議**（2026/10/19）：目前兩位組員都用 Claude Code，不需要其他工具的設定檔，維持只有 `CLAUDE.md`。之後有人改用 Cursor、Copilot 等工具時再重新討論。

## 7. favicon 還是 Vite 預設圖

**現況**：`public/favicon.ico` 是範本預設。
**建議**：等有 Logo 再換，不急。
**決議**（2026/10/19）：Logo 已完成，`public/favicon.svg`（viewBox 32×32）與 `public/favicon.png`（134×134）取代 Vite 預設的 `favicon.ico`；`index.html` 兩個都引用，瀏覽器優先用 SVG，PNG 為備用。

## 8. 何時加 ESLint 與測試

**現況**：沒有 lint，也沒有測試。`spec/structure.md` 第 6 節提到可以用 ESLint 強制 `features → shared` 的依賴方向。`acceptance.md` 預計用 Playwright 做 E2E。
**建議**：第一個功能做完、資料夾穩定後，再加 ESLint 依賴方向規則；Playwright 在訂單主流程能跑通後再建。
**決議**（2026/10/19）：目前都不安裝，改記錄觸發條件：

| 工具 | 何時加 |
| --- | --- |
| ESLint | 第一個功能做完、`src/features/` 出現後，再加 `features` 之間不互相 import 的規則 |
| Playwright | 訂單主流程（`acceptance.md` 的 P0 主線 E2E-01～E2E-09）能手動跑通後。裝之前要先定負責人，並決定後端如何提供時間控制（`acceptance.md` 待確認 #6） |
| Vitest | 不列入，等出現金額計算等純邏輯函式（`data-model.md` 5.1）時再討論 |

## 9. Figma 案件狀態標籤多出 3 個狀態

**現況**：Figma「案件狀態標籤」（node 558:210）有 9 個狀態；`order-lifecycle.md` 的 `ORDER.status` 只有 6 個值（待乙方報價、待甲方付款、製作中、已完成、已取消、已終止）。多出來的是「待補款」「已補款待確認」「未完成」。
**問題**：`features.md` 4.4 補款頁提到「待補款」「已補款待確認」是畫面狀態，但沒說是不是 `ORDER.status` 的值，也可能是由 `PAYMENT` 衍生；「未完成」在 spec 裡找不到定義。
**選項**：A 新增成 `ORDER.status` 的值（要改 `order-lifecycle.md`、`data-model.md`、FigJam）；B 當成由 `ORDER` 與 `PAYMENT` 算出來的畫面狀態，不存（符合「衍生值不存」）；C 這 3 個是 Figma 多畫的，標籤只留 6 個。
**建議**：B 或 C；A 要先確認後端是否真的需要存。
**目前做法**：前端 `OrderStatusTag` 先收全部 9 個狀態值（`src/features/order/types.ts`），不新增 `ORDER.status`；決議後再調整。
**決議**：（待填）

## 10. 基礎元件下半部 Figma 與程式的小差異

2026/10/21 實作 Figma「基礎元件」的上傳、標籤、提示與分隔時，發現下列不一致，目前先以程式既有規則為準，待確認：

| 項目 | Figma | 程式現況 | 要確認 |
| --- | --- | --- | --- |
| `Amilu/Body` 字重 | Medium（500） | `.text-body` 是 Regular（400） | 大頭照上傳標題、警語框標題比 Figma 細一級。哪邊才對？ |
| 大頭照上傳 | 說明寫「點圓形選圖」，設計稿是圓角 15 的方塊 | 照設計稿做方塊 | 要不要改圓形？ |
| 階段標籤範例文字 | 「第一階段」 | 文字由 `stage_no` 對照（草稿、線稿…） | Figma 範例改成階段名稱 |
| 選單分隔線 | 0.3px、`#D1D1D1`（不在色票內） | 1px、`--color-border`、透明度 0.5 | 已決定（2026/10/21）：小於 1px 的線在不同解析度顯示不一致，用降低透明度模擬淡線 |
| 「未完成」狀態標籤 | 左右內距 10px、overflow-clip，其他狀態是 12px | 統一成 12px | 已決定（2026/10/21）：和其他狀態一致；Figma 待同步 |
| 橘色強調 | 接案中等用 `accent/orange` | 已改用狀態專用 token `--color-status-open`、`--color-status-waiting(-bg)`（2026/10/24 組員補上） | 已解決 |

**決議**：（待填）

## 11. 組合元件（案件卡、進度條等）Figma 沒畫的部分

2026/10/26 實作「第3層｜組合元件」第一批（委託進度條、委託案件卡、作品內容）時，發現下列 Figma 沒畫或與規格需要對齊的地方，先照下表做，待確認：

| 項目 | Figma | 程式現況 | 要確認 |
| --- | --- | --- | --- |
| 委託進度條的三點分段 | 只畫五點（「委託排程卡」才有 Stages=Three） | 傳 `stages=[1, 4, 5]` 時只畫 3 個節點，軌道縮短、間距平均 | 三點分段（草稿、精稿、完稿，現行規格）的進度條要長怎樣 |
| 委託案件卡的手機版 | 只有桌機 888 寬 | 照桌機排版（頭像、資訊、金額＋按鈕三欄），沒有手機版 | 手機上要怎麼排（約稿管理頁） |
| 作品內容的標籤文字 | 畫面上是「#厚塗」 | 元件收 `TAG.name`（不含 #），自動加「#」 | `TAG.name` 存的是否不含 #（`data-model.md` 沒寫） |
| 委託案件卡左側頭像 | 白色圓形佔位 | 56px 圓形、沒傳網址時用 `/picture/default-user-pic.png` | 頭像要不要統一成圓角方塊（header 的頭像是圓角方塊） |

**決議**：（待填）
