# Amilu 修改紀錄

> 規則改過什麼、什麼時候改的。新的在上面。
> 2026/11/9 把舊紀錄濃縮成摘要，完整原文用 `git show 4109e43:spec/changelog.md` 查。2026/10/7 以前的紀錄來自 --Amilu repo 的 `討論紀錄/amilu_討論總結.md`。

## 2026/11/10

- 新增 `layouts/components/AppFooter.vue`（頁尾，Figma 641:302，桌機／平板／手機三版由斷點切換）和 `--color-footer-bg`、`--color-footer-text`。Logo 與社群圖示從 Figma 切出，放 `public/`。
- 待確認：頁尾導覽與社群連結的網址（目前都是 `#`）。

## 2026/11/9

- 文件瘦身：`open-questions.md` 每題縮到 3 行內；`acceptance.md` 第 5 節的已定案表刪除（都已寫回各 spec）；本檔濃縮成摘要。
- `:src` 要接 `BASE_URL` 的規則，從 `open-questions.md` 第 4 題搬到 `structure.md` 2.2。
- features.md 4.4：貼文照片的預覽燈箱拿掉張數提示。
- open-questions.md 第 9～13 題決議：
  - 「待補款」「已補款待確認」由 `ORDER`＋`PAYMENT` 算出、不存；`OrderStatusTag` 刪掉「未完成」。
  - 內文字重維持 400，大頭照上傳維持圓角方塊，三點進度條節點平均分布，`TAG.name` 不含 #。
  - 頭像全部改成圓角方形：新增 `--radius-avatar`（25%），9 個元件套用，design-spec.md 第 4 節補規則。
  - `UserInfoBar` 的 `nickname` 改名 `name`；「申請終止合作」製作中永遠可以按，`OrderSidePanel` 拿掉 `canTerminate`。
- features.md 4.4：貼文操作列改照 Figma 617:582，拿掉「喜歡」，改成「提出意見申請」（打開聊天室，不存資料）＋「確認該階段審核」；已確認時兩顆灰色按鈕。`DiscussionPostContent` 新增 `action`（`confirm`／`confirmed`／`awaiting-payment`／`none`），取代 `isClosed`；acceptance.md ORD-09、NEG-04 同步。
- Figma 待同步項目記在 data-model.md 第 6 節 #13。
- 整理重複程式：新增 `shared/utils/formatAmount.ts`、`features/order/formatDate.ts`、`shared/composables/useDropdown.ts`（4 個下拉選單共用）；structure.md 新增 `shared/constants.ts`（全站固定值，如預設頭像路徑）。

## 2026/11/8

- features.md 4.4：貼文照片改為橫向拖拉（滑鼠也能拖）、放開吸附左緣、點圖開預覽。
- `DiscussionPostContent`：照片列改用 Embla＋`embla-carousel-wheel-gestures`（補觸控板）；照 Figma 617:582 補發文者列與照片樣式，新增 `--radius-post-image`。底部操作列未做，待確認。
- `ImageScrollList` 的捲軸改用 OverlayScrollbars 自己畫，新增 `--color-scrollbar-thumb`。

## 2026/11/6

- 新增 `RatingCard`（評分卡）、`DiscussionTitleBar`（討論牆標題列，含 RWD）、`DiscussionEmptyState`（討論牆空狀態）。星星圖示從 Figma 切成單顆另存。
- 階段一律顯示 `STAGE_LABEL`（草稿…），不寫 Figma 的「第一階段」：三點分段的 `stage_no` 是 1／4／5。

## 2026/11/5

- `SideMenuItem` 的 `status` 改成 `danger`／`disabled`，新增 `--color-danger`。
- 新增 `OrderSidePanel`（討論牆左欄）、`PaymentSummaryCard`（款項卡）、`SettlementPreview`（結算試算）、`UploadStageInfo`（本次上傳階段）；`order/types.ts` 新增 `Order`、`OrderStage`，`mocks/order.ts` 新增三筆訂單。
- `AmountRow`：左邊名稱可以換行，金額不換行。

## 2026/11/3

- 新增 `ActivationSteps`（開通清單卡）、`CommissionItemSelect`（委託項目選擇）、`ScheduleCard`（委託排程卡，訂金由報價即時算、只供顯示）。
- `StageDeadlineRow` 新增 `muted`；新增 `--color-border-expanded`、`--color-bg-list-selected`、`--color-border-strong`。
- 待確認：訂金設「無需先支付」時，排程卡的訂金列怎麼顯示。

## 2026/10/31

- `Button` 新增 `size="sm"`、`variant="outline"` 和對應 token。
- 開通清單：新增 `activationSteps.ts`、`StepStatusTag`、`ActivationStepsItem`（profile 模組）。

## 2026/10/30

- 新增 `CommissionItemOption`、`StageDeadlineRow`、`AmountRow`、`ApplyStepItem`；新增 `explore/types.ts` 的 `CommissionItem`、`mocks/commissionItem.ts`、`--color-step-todo`。
- 待確認：「不可商用」標籤要不要顯示（features.md 2.6 和 Figma 不一致，目前不顯示）。

## 2026/10/29

- `WorkCard` 新增可委託項目小標（`type="commission-item"`）。
- 新增 `ChatMessage`、`ChatRoom` 和聊天室 token；features.md 4.7：聊天室圖片限單張 5MB（JPG／PNG／WebP）。
- RWD：元件排版與桌機相同，只有字級與寬度跟著斷點變。

## 2026/10/28

- 新增 `WorkCard`、`ProfileWorkCard`、`CommissionRules`、`PaymentPlanCard`；卡片圓角沿用 `--radius-button`。
- 基礎元件補 hover 與焦點外框（`DropZone`、`AvatarUpload`、`ImageUploadSlot`、`FilterChip`）。
- `:src` 綁定的圖片改接 `BASE_URL`；新增 `--fs-badge`、`--color-selected-badge-bg`。
- features.md 5.2：通知對話預覽改成單行、超出顯示「…」。

## 2026/10/26

- 新增 `OrderCard`、`StageProgress`（支援三點分段）、`WorkInfo`、`CategoryCard`、`CategorySelect`。
- 新增 `shared/composables/useClickOutside.ts`（`FormSelect`、`CategorySelect` 共用）。
- `mocks/classification.ts` 加上分類圖片（WebP）；用途「VTuber 用途」改名「VTuber」。

## 2026/10/24

- 新增 `FormCheckbox`（shared）、`OptionButton`（profile）和對應 token。
- design-spec.md 間距規則改成兩層：頁面排版用 8 的倍數，元件內部照 Figma。
- 狀態標籤改用 `--color-status-*`，不借錯誤色；`OpenStatusTag` 搬到 explore。

## 2026/10/23

- 新增 `--color-required`、下拉選單 token、`mocks/classification.ts`。

## 2026/10/21

- 實作基礎元件下半部 15 個（13 個放 shared，`OrderStatusTag`、`StageTag` 放 order）；新增 `OrderFloatingButton`。
- 按鈕尺寸寫成 token；新增「已追蹤」、`--color-bg-inverse`、`--fs-note`。
- 階段名稱由 `stageLabel.ts` 對照；`dev/` 可以 import `features/`。

## 2026/10/20

- 按鈕顏色改照 Figma 505:480（主按鈕用漸層）；新增前端自訂色 `base/150`。
- structure.md 新增 `src/dev/`（元件測試頁）和 `src/layouts/`。

## 2026/10/19

- open-questions.md 第 1～8 題決議。
- 新增 `structure.md`、`open-questions.md`；取消 `app/` 層。

## 2026/10/17

- data-model.md 與 FigJam ER 逐表對齊。
- 定案：補款逾期依「完稿視同已確認」結算；已取消案件可評價；鎖帳號只擋送出新委託；項目說明與範例圖加進快照，項目可以真刪。

## 2026/10/15

- 新增 `acceptance.md`、`api.md` 草案。
- grill-me 定案 15 點：完稿窗口 7 天從最近一次上傳起算、+30 與 +7 兩條計時互斥、完稿上傳即視同確認、單段改三點分段（1／4／5）、終態鎖死、結算後有欠款一律鎖帳號、強制結算只看委託人有沒有確認、契約成立前雙方都可取消等。
- api 第一輪：圖片直傳、模擬金流用 `actions`、時間控制用可調天數＋debug actions、後端用 FastAPI、輪詢不做 WebSocket。

## 2026/10/12

- 拿掉 auto-confirm 與惡意棄單，改成最終截稿日 +30 天強制結算。
- 新增 `order-lifecycle.md`；訂金「無需先支付」時隱藏「先付訂金」方案。

## 2026/10/7

- 下拉導覽只剩作品類型／用途＋自訂標籤；作品燈箱改顯示作者自我介紹；年齡分級列入 MVP。
- Design spec：桌機基準 1440、全部 12 欄、只用源泉圓體；色票整併成 14 個 variable。

## 2026/10/1

- 分段方案改成每個委託項目各自設定（`stage_plan_pref` 移到 `COMMISSION_ITEM`）。
- Figma 新增 design spec 頁。

## 2026/9/29

- 上傳規則：階段稿 1～5 張、一般作品 1～20 張、委託項目 1～5 張，單張 5MB；新增 `ORDER_STAGE_IMAGE`。
- 可商用改成每個項目設定；拿掉創作者自訂 ToS；手機驗證＋接案設定＋至少 1 筆項目即開通。
- 付款、補款、結案、聊天室、通知中心畫面定案；追蹤列入 MVP。

## 2026/9/27

- 報價時乙方只能改金額與日期；付款用 ATM 虛擬帳號，期限 3 天。
- 討論牆只放稿件，修改要求走聊天室。

## 2026/9/24

- 訂金＝第一階段費用；契約成立前三段式流程（申請 → 報價 → 付款）。
- 委託申請頁五區 wireframe 定案。

## 2026/9/22

- 拿掉「風格」母類型；標籤全面非必填、全站共用命名；新增帳號 ID 與暱稱；首頁混合顯示作品與可委託項目。

## 2026/9/21

- 拿掉 6% 平台抽成。

## 2026/9/20

- 訂金新增「無需先支付」；新增惡意棄單機制（10/12 已拿掉）。

## 2026/9/16

- 終止合作結算簡化（不再對半分）；新增一次付清／先付訂金；手機驗證是交易前提。

## 2026/9/15

- grill-me 定案：階段金額拆分、授權鎖定、契約只同意一次、契約成立即全額託管、新增終止合作。

## 2026/9/14

- 定案階段數與非即時聊天室。
