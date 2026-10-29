# Amilu Design Spec

> 來源：[Figma `design spec` 頁](https://www.figma.com/design/RkN83Jr1KTUExyKkfOjXyn/Amilu---Web-UI?node-id=480-2)（2026/10/1 建立）。**數值（色碼、字級、間距、斷點、Grid）以 Figma 為準，程式裡的唯一一份在 `src/styles/`，這份不重複列數值**，只放規則、用途和例外。
> 要檢查實作對不對：Figma variable 對 `src/styles/_tokens.scss`、`_breakpoints.scss`；用途對這份。

**調性**：灰白黑極簡、零阻力瀏覽、以圖片內容為優先。

| 內容                                     | 在哪裡                                    |
| ---------------------------------------- | ----------------------------------------- |
| 色票、間距、Grid、字級（含三個斷點的值） | `src/styles/_tokens.scss`                 |
| 斷點與內容最大寬                         | `src/styles/_breakpoints.scss`            |
| 字級 class、行高、字重                   | `src/styles/_typography.scss`             |
| 字體檔與 `@font-face`                    | `src/styles/_fonts.scss`、`public/fonts/` |

---

## 1. 色彩

Figma variable collection「Amilu｜色彩」，共 14 色，分灰階、底色、強調色三組；另有 2 個漸層 paint style。專案只用這些顏色，不要另外寫色碼。

**命名對照**：Figma `neutral/900` ＝ 程式 `--neutral-900`（`/` 換成 `-`）。元件只用 semantic token（`--color-*`），不直接用 primitive，見 [CLAUDE.md](../CLAUDE.md)。

- 名稱後的「-數字」是同色的透明度版本，例如 `accent/orange-30` 是 `accent/orange` 透明度 30%。
- Google 登入按鈕的標誌色是 Google 規定的顏色，不屬於專案色票。
- `base/150`（`#f1f0ef`）是前端自訂色，不在 Figma 14 色內：取 `base/100` 與 `base/200` 的中間值，用在淺色區塊的 hover（Figma 原本用 `base/200`，和背景太接近）。

### 1.1 用途

| Token              | 用途                               |
| ------------------ | ---------------------------------- |
| `neutral/900`      | 主要文字、icon、深色底（已選擇標籤實心款，`--color-bg-inverse`） |
| `neutral/900-50`   | 圖片上的移除按鈕、標記、手機版遮罩 |
| `neutral/500`      | 次要文字、說明、次要 icon、停用按鈕的字、勾選框外框 |
| `neutral/300`      | 邊框、分隔線、placeholder、停用按鈕的底、聊天訊息時間 |
| `neutral/white`    | 頁面底、深底上的文字、下拉選單面板底、對方的聊天氣泡 |
| `base/100`         | 淺色區塊底、提示框                 |
| `base/150`         | 淺色區塊 hover 底（前端自訂）      |
| `base/200`         | 主背景、卡片底、頁籤、下拉選項 hover 底、自己的聊天氣泡 |
| `base/500`         | 次要強調、分隔、標籤               |
| `accent/orange`    | 錯誤、警示、必填、未讀紅點、次要按鈕的框與字、選項選取的框、狀態標籤的字（接案中、等待某一方動作）、付款方案卡「已選擇」小標的底（`--color-selected-badge-bg`） |
| `accent/orange-10` | 狀態標籤底、警語框底               |
| `accent/orange-30` | 選項選取底、錯誤輸入框外框、次要按鈕 hover 底 |
| `accent/green`     | 成功提示、可商用                   |
| `accent/green-30`  | 狀態標籤底、已開通                 |
| `accent/blue`      | 狀態標籤、資訊提示                 |

### 1.2 漸層（paint style）

| 名稱               | 用途         |
| ------------------ | ------------ |
| `gradient/rainbow` | 按鈕         |
| `gradient/side-bg` | 首頁兩側背景 |

- `gradient/rainbow` 的黃（`#EBBD00`）與粉（`#F0809F`）只用在這個漸層，不在 14 色票內，程式裡是 `--gradient-yellow`、`--gradient-pink`。
- `gradient/rainbow` 在 Figma 裡的漸層軸比按鈕高很多，所以按鈕上實際只看得到粉到橘那一段。按鈕用的角度與位置已依 Figma「表單按鈕」定案，寫在 `_tokens.scss` 的 `--gradient-button-primary`（一般）與 `--gradient-button-primary-active`（按下）。
- 主按鈕是 `gradient/rainbow` 漸層，不是 `neutral/900`；次要按鈕是白底、`accent/orange` 框與字；停用是 `neutral/300` 底、`neutral/500` 字。以 Figma「表單按鈕」（node 505:480）為準。

---

## 2. 字體

中英文都用 **源泉圓體 GenSenRounded2 TC**，自行託管。字重只載入下表三種（不載入 H 900，Logo 用圖片）：

| 字重             | 用在哪裡   |
| ---------------- | ---------- |
| R（Regular 400） | 內文       |
| M（Medium 500）  | 強調       |
| B（Bold 700）    | 標題與按鈕 |

---

## 3. 字級

- Figma text style 前綴 `Amilu/`，字級綁定「Amilu｜字級」variable，有三個 mode：**Desktop 1440**、**Tablet 768**、**Mobile 375**。
- 程式裡用 `.text-*` class，`Amilu/Body-L` ＝ `.text-body-l`；大小讀 `--fs-*`，隨斷點自動切換。行高用百分比、跟著字級縮放，定義在 `_typography.scss`。

| Style             | 用途                    |
| ----------------- | ----------------------- |
| `Amilu/Display`   | 主視覺大標（首頁 Hero） |
| `Amilu/H1`        | 頁面主標                |
| `Amilu/H2`        | 區塊標題                |
| `Amilu/H3`        | 卡片／燈箱標題          |
| `Amilu/Title`     | 欄位標題、小標          |
| `Amilu/Body-L`    | 強調內文、說明段落      |
| `Amilu/Body`      | 一般內文                |
| `Amilu/Caption`   | 輔助說明、提示文字      |
| `Amilu/Small`     | 標籤、時間戳、極小字    |
| `Amilu/Button-md` | 主要按鈕                |
| `Amilu/Button-sm` | 次要／小按鈕            |
| `note`            | 可商用標籤的極小字（無 `Amilu/` 前綴，10px 固定、不隨斷點，`--fs-note`） |
| 通知數字          | header 通知頁籤的未讀數（8px 固定、不隨斷點，`--fs-badge`） |

---

## 4. Grid 與斷點

- 裝置分三種：桌機（≥ 1024，設計基準寬 1440）、平板（768–1023，基準寬 768）、手機（< 768，基準寬 375）。三種都是 12 欄，gutter 與 margin 的值見 `_tokens.scss`。
- 手機優先（mobile-first），用 `_breakpoints.scss` 的 mixin，不手寫 media query。
- 間距分兩層：
  - **頁面排版**（區塊之間、欄與欄、頁面邊距）用 8 的倍數，讀 `--space-*`。
  - **元件內部**（內距、圖文間距、元件內各部分的間隔）照 Figma 數值，不受 8 的倍數限制。按鈕這類多處共用的值定義成 token（`--radius-button`、`--button-padding-*`、`--button-gap-*`）。
  - 元件數值依實際視覺刻意和 Figma 不同時，在 `changelog.md` 記一筆原因。
- **作品牆**以元件實作，欄數由 `--gallery-columns` 控制（桌機 5／平板 3／手機 2）。
- Figma grid style 前綴 `Amilu/Grid/`。
