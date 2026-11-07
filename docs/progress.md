# 開發進度

> 主軸寫在這裡，對話被洗掉也不會丟。開新的 Claude session 時先說：「先讀 `docs/progress.md`」。
> 做完一步就把 ⬜ 改成 ✅；有新的決定記進「已定案」。規則類的決定最後仍要寫進 `spec/`（見 CLAUDE.md），這裡只記進度。

狀態：⬜ 未做　🔄 進行中　✅ 完成

---

## 目前在做

圖片呈現（燈箱、討論牆貼文、點擊預覽）。下一步：A-3 的捲軸（照方案 A 刪兩段 CSS），再到瀏覽器測。

上次停在（2026/11/7）：`ImageScrollList.vue` 的「每張圖等於燈箱高度」已寫好（`.item` `height: 100%`、圖片 `object-fit: contain`）；捲軸樣式討論到一半。

---

## 已定案

| 日期 | 決定 | 原因 |
| --- | --- | --- |
| 2026/11/7 | 作品展示燈箱、委託商店燈箱：圖片**垂直捲動**，停下時自動對齊某張圖頂端；不用輪播、圖片不能點 | 設計決定。Embla 不支援滑鼠滾輪，垂直輪播在桌機不直覺；用 CSS scroll-snap，不用 JS |
| 2026/11/7 | 燈箱垂直捲動的**每張圖都等於燈箱高度**，整張完整顯示（`object-fit: contain`），不裁切 | 設計決定：一次看一整張；也因此不會有比外框高的圖 |
| 2026/11/7 | 討論牆貼文的照片：**橫向捲動**，不對齊左邊；點一張開預覽 | 設計決定（features.md 4.4） |
| 2026/11/7 | 討論牆貼文照片：高度一律 450px、寬度 auto（照原圖比例），不用 `ImageUploadSlot` | `ImageUploadSlot` 是 120×120 裁成方形，行為不同 |
| 2026/11/7 | 申請委託的參考圖（甲方上傳，橫向列）用 `ImageUploadSlot`，之後要補「點圖開預覽」 | 上傳情境本來就用這個元件；圖片和移除鈕要分成兩個並排的 `<button>`，不能把按鈕包在按鈕裡 |
| 2026/11/7 | 點貼文照片後的**預覽**：燈箱式、一次一張、左右切換，從被點的那張開始，附張數提示（1 / 5） | 只有這裡用輪播（Embla） |
| 2026/11/7 | 輪播套件用 `embla-carousel-vue`（已安裝 8.6.0） | 不附樣式，可以照 Figma 用 token 做；MIT、持續維護 |
| 2026/11/7 | 進度記在這份檔案，用單一 session；不用 Agent Teams | Agent Teams 的隊員在 `/resume` 後不會回來，不適合跨天的工作 |

---

## 待辦：圖片呈現

### 開始前

- ✅ 把 `src/shared/components/ImageCarousel.vue` 搬到 `src/features/order/components/`（現在只有 order 的預覽用到，structure.md「只有一個功能用就放該功能裡」）

### A. 燈箱：垂直捲動＋自動齊頂（explore）

- ✅ A-1 新建 `src/features/explore/components/ImageScrollList.vue`（props：`images: string[]`）
- ✅ A-2 CSS：外框 `overflow-y: auto` ＋ `scroll-snap-type: y mandatory`；每張圖 `scroll-snap-align: start`
- 🔄 A-3 playground 測試（外層要給高度）：滾輪、觸控板停下會吸頂；每張圖剛好塞滿外框高度、整張看得到不被裁切
  - ✅ playground 已加 ImageScrollList 區塊（外框 500px、4 張 picsum 測試圖）
  - ✅ 刪掉 `width: fit-content`（它讓捲軸黏在圖片右側）
  - ⬜ 捲軸走方案 A：刪掉 `::-webkit-scrollbar` 和 `::-webkit-scrollbar-thumb` 兩段，用系統預設。Mac 會是浮在圖上、捲動才出現的捲軸；Windows 是一般常駐捲軸，CSS 改不了
  - ⬜ （之後視 Figma）方案 B：所有系統都要浮動捲軸 → 自己畫滑條（`scrollbar-width: none` ＋ absolute 的 div ＋ scroll 事件，約 1–2 小時）或用 OverlayScrollbars 套件
  - ⬜ 瀏覽器測：滾輪、觸控板停下會吸頂；每張圖剛好塞滿外框高度、整張看得到不被裁切
  - 注意：如果還保留自訂捲軸，`rgb(0 0 0 / 30%)` 要換成 token（在 `_tokens.scss` 新增 `--color-scrollbar-thumb`）

### B. 討論牆貼文：橫向照片列（order）

- ⬜ B-1 `DiscussionPostContent.vue` 的 `defineEmits` 加 `preview: [index: number]`，前面加 `const emit =`
- ⬜ B-2 第 15 行空 `<div>` 換成照片列：`v-for` 跑 `uploadImageUrl`，每張包 `<button>`，`@click="emit('preview', index)"`
- ⬜ B-3 CSS：`display: flex`、`overflow-x: auto`；圖片 `height: 450px`、`width: auto`、`flex-shrink: 0`
- ⬜ B-4 測試：一般滑鼠滾輪只能上下捲（要 Shift＋滾輪才左右），確認能不能接受

### C. 點擊預覽：燈箱＋輪播（order）

`ImageCarousel.vue` 目前的狀態：輪播本體（三層 div）✅、上一張／下一張按鈕 ✅；張數提示和輪播本體的 CSS 還沒寫。

- ⬜ C-1 改 `ImageCarousel.vue`
  - ⬜ props 刪掉 `direction`，加 `startIndex?: number`（預設 0）
  - ⬜ `options` 改成 `{ startIndex: props.startIndex }`（不寫 `axis`，預設就是橫向）
  - ⬜ template 刪掉 `:class="direction"`
  - ⬜ 刪掉 `watch` 裡的 `console.log`
  - ⬜ 補張數提示：`{{ selectedIndex + 1 }} / {{ images.length }}`
  - ⬜ 補 CSS：`.img-carousel` relative、`.view-port` overflow hidden、`.track` flex、`.slide` `flex: 0 0 100%`；按鈕與張數提示位置照 Figma
  - ⬜ 決定按鈕到頭時要「消失」還是「變灰」（下一張按鈕目前同時有 `v-if` 和 `:disabled`，`v-if` 會讓變灰看不到）
- ⬜ C-2 新建 `src/features/order/components/ImagePreview.vue`：`position: fixed` 蓋滿畫面、`--color-overlay` 底、關閉按鈕 emit `close`，裡面放 `ImageCarousel`
- ⬜ C-3 playground 接起來：`previewIndex = ref<number | null>(null)`；貼文 `@preview` 記張數；`ImagePreview` 用 **`v-if`**（不能用 `v-show`，否則 `startIndex` 只讀一次）
- ⬜ C-4 測試：點第 3 張就從第 3 張開始；箭頭和拖曳可切換；關掉再點第 1 張從第 1 張開始；`npm run type-check`

### 收尾

- ⬜ `spec/changelog.md` 記：新增 `embla-carousel-vue`、三種圖片呈現的分工、`ImageCarousel` 放 order 的原因

---

## 待確認

- （目前沒有）
