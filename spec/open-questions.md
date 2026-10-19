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
| 5   | `npm run format` 可能大幅改寫部分樣式檔 | 負責樣式的組員       | ⬜   |
| 6   | 組員用的 AI 工具是否需要對應設定檔      | 全組                 | ⬜   |
| 7   | favicon 還是 Vite 預設圖                | 設計                 | ⬜   |
| 8   | 何時加 ESLint 與測試                    | 全組                 | ⬜   |

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
**問題**：跑 format 可能一次改動大量行，造成難讀的 diff。這點**尚未驗證**（整理這份時的環境沒有安裝套件）。
**要做**：有裝好套件的人跑 `npx prettier --check src/`，看哪些檔案會被改。
**建議**：若 `_fonts.scss` 被改，加 `.prettierignore` 排除它。
**決議**：（待填）

## 6. 組員用的 AI 工具是否需要對應設定檔

**現況**：根目錄有 `CLAUDE.md`，Claude Code 會自動讀。
**問題**：若有組員用 Cursor、Copilot 或其他工具，那些工具不會讀 `CLAUDE.md`，就不會遵守同樣的結構與樣式規則。
**選項**：A 只用 Claude Code，不處理；B 各工具另放一份設定，內容都指向 `spec/`；C 統一規範，請組員都讀 `spec/structure.md`。
**建議**：先問每位組員用什麼工具，再決定。
**決議**：（待填）

## 7. favicon 還是 Vite 預設圖

**現況**：`public/favicon.ico` 是範本預設。
**建議**：等有 Logo 再換，不急。
**決議**：（待填）

## 8. 何時加 ESLint 與測試

**現況**：沒有 lint，也沒有測試。`spec/structure.md` 第 6 節提到可以用 ESLint 強制 `features → shared` 的依賴方向。`acceptance.md` 預計用 Playwright 做 E2E。
**建議**：第一個功能做完、資料夾穩定後，再加 ESLint 依賴方向規則；Playwright 在訂單主流程能跑通後再建。
**決議**：（待填）
