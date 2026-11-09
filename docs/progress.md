# 開發進度

> 主軸寫在這裡，對話被洗掉也不會丟。開新的 Claude session 時先說：「先讀 `docs/progress.md`」。
> 做完一步就把 ⬜ 改成 ✅；有新的決定記進「已定案」。規則類的決定最後仍要寫進 `spec/`（見 CLAUDE.md），這裡只記進度。

狀態：⬜ 未做　🔄 進行中　✅ 完成

---

## 目前在做

圖片呈現（燈箱、討論牆貼文、點擊預覽）。下一步（2026/11/9）：A-3、B-4、C-4 一起到瀏覽器測，然後收尾（changelog）。

上次停在（2026/11/8）：`ImageScrollList.vue` 捲軸改用 OverlayScrollbars，程式寫完、type-check 通過，還沒到瀏覽器測；B 段程式寫完、playground 已接，也還沒到瀏覽器測。

---

## 已定案

| 日期 | 決定 | 原因 |
| --- | --- | --- |
| 2026/11/7 | 作品展示燈箱、委託商店燈箱：圖片**垂直捲動**，停下時自動對齊某張圖頂端；不用輪播、圖片不能點 | 設計決定。Embla 不支援滑鼠滾輪，垂直輪播在桌機不直覺；用 CSS scroll-snap，不用 JS |
| 2026/11/7 | 燈箱垂直捲動的**每張圖都等於燈箱高度**，整張完整顯示（`object-fit: contain`），不裁切 | 設計決定：一次看一整張；也因此不會有比外框高的圖 |
| 2026/11/8 | 討論牆貼文的照片：**橫向拖拉**（滑鼠也能拖），放開吸附左緣；點一張開預覽。用 Embla（`align: 'start'`）＋ `embla-carousel-wheel-gestures`（補觸控板） | 設計決定（features.md 4.4，11/8 改過）。原生 `overflow-x` 滑鼠拖不動；Embla 已裝，不另加 Swiper |
| 2026/11/7 | 討論牆貼文照片：高度一律 450px、寬度 auto（照原圖比例），不用 `ImageUploadSlot` | `ImageUploadSlot` 是 120×120 裁成方形，行為不同 |
| 2026/11/7 | 申請委託的參考圖（甲方上傳，橫向列）用 `ImageUploadSlot`，之後要補「點圖開預覽」 | 上傳情境本來就用這個元件；圖片和移除鈕要分成兩個並排的 `<button>`，不能把按鈕包在按鈕裡 |
| 2026/11/7 | 點貼文照片後的**預覽**：燈箱式、一次一張、左右切換，從被點的那張開始；**不顯示張數**（11/9 拿掉） | 用 Embla（`ImageCarousel`）；貼文照片列也用 Embla，但不是一次一張 |
| 2026/11/7 | 輪播套件用 `embla-carousel-vue`（已安裝 8.6.0） | 不附樣式，可以照 Figma 用 token 做；MIT、持續維護 |
| 2026/11/8 | 燈箱捲軸用 OverlayScrollbars 自己畫，不用系統預設（放棄方案 A） | 系統預設捲軸會跟著每個使用者的系統設定變（常駐或浮動），要由我們統一控制 |
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
  - ✅ 捲軸改走方案 B（OverlayScrollbars）：已安裝 `overlayscrollbars` 2.17.0、`overlayscrollbars-vue` 0.5.10；`main.ts` 引入套件 CSS；新增 token `--color-scrollbar-thumb`；`scroll-snap-type` 搬到 `:deep([data-overlayscrollbars-viewport])`；`autoHide: 'scroll'`、粗 10px、hover／拖曳不變色；type-check 通過
  - ⬜ 瀏覽器測：滾輪、觸控板停下會吸頂；每張圖剛好塞滿外框高度、整張看得到不被裁切；捲軸停下約 1.3 秒後消失

### B. 討論牆貼文：橫向照片列（order）

- ✅ B-1 `defineEmits` 加 `preview: [index: number]`、`const emit =`
- ✅ B-2 照片列：`v-for` 跑 `uploadImageUrl`，每張包 `<button>`，點了 `emit('preview', index)`
- ✅ B-3 改用 Embla：`.photos`（viewport，`overflow: hidden`）＞`.tracks`（flex）＞button（`flex: 0 0 auto`）；`align: 'start'`；加 `WheelGesturesPlugin`；圖片高 450px、寬 auto
- 🔄 B-4 playground 已加 DiscussionPostContent 區塊（5 張圖），type-check 通過
  - ✅ 照 Figma 617:582 補發文者列與照片樣式（操作列未做，見待確認）
  - ⬜ 瀏覽器測：發文者列對齊 Figma；滑鼠拖放開吸左緣；最後一張貼右緣不留白；點第 3 張顯示 2、拖曳放開不觸發；觸控板左右滑可捲；照片上滾滾輪整頁仍能上下捲

### C. 點擊預覽：燈箱＋輪播（order）

`ImageCarousel.vue` 目前的狀態：輪播本體（三層 div）✅、上一張／下一張按鈕 ✅；輪播本體的 CSS 還沒寫。

- ✅ C-1 改 `ImageCarousel.vue`
  - ✅ props 刪掉 `direction`，加 `startIndex?: number`（預設 0）
  - ✅ `options` 改成 `{ startIndex: props.startIndex }`（不寫 `axis`，預設就是橫向）
  - ✅ template 刪掉 `:class="direction"`
  - ✅ 刪掉 `watch` 裡的 `console.log`
  - ✅ 不做張數提示（11/9 決定），`selectedIndex` 已刪
  - ✅ 基本 CSS：`.img-carousel` relative、`.view-port` overflow hidden、`.track` flex、`.slide` `flex: 0 0 100%`
  - ✅ 樣式（沒有 Figma，前端自訂）：圖片 `max-height: 80vh` 置中；左右按鈕 48px 白色圓形，浮在圖片左右兩側垂直置中
  - ✅ 按鈕到頭時「變灰」：兩顆都用 `:disabled`＋`.btn-disable`，已拿掉 `v-if`
- ✅ C-2 新建 `src/features/order/components/ImagePreview.vue`：`position: fixed` 蓋滿畫面、`--color-overlay` 底、關閉按鈕 emit `close`，裡面放 `ImageCarousel`。前端自訂：輪播寬 `min(90vw, 1200px)`、`z-index: 100`、關閉鈕 48px 白色圓形；不做點黑底關閉（拖曳放開在黑底上會誤關）
- ✅ C-3 playground 接起來：`previewIndex = ref<number | null>(null)`；貼文 `@preview` 記張數；`ImagePreview` 用 **`v-if`**（不能用 `v-show`，否則 `startIndex` 只讀一次）
- ⬜ C-4 測試：點第 3 張就從第 3 張開始；箭頭和拖曳可切換；關掉再點第 1 張從第 1 張開始；`npm run type-check`

### 收尾

- ⬜ `spec/changelog.md` 記：新增 `embla-carousel-vue`、三種圖片呈現的分工、`ImageCarousel` 放 order 的原因（overlayscrollbars、wheel-gestures 已在 11/8 記過）
- ⬜ 圖片呈現全部完成後：確認「已定案」表裡屬於規則的內容都已寫進 spec，然後清空這份檔案，改成記「拼裝進度」

---

## 待確認

- ✅（11/9）貼文操作列照 Figma 做完，`DiscussionPostContent` 用 `action` 切四種樣子；playground 可切換。
- ⬜ features.md 4.4 的「確認收稿」（一次付清的完稿貼文）和「前往補款」Figma 貼文裡沒有，做頁面時再確認放哪
