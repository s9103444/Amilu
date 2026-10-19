# Amilu

專為台灣 CG 市場打造的雙向委託平台（委託人 ↔ 創作者）。專題 demo，金流為純模擬。

前端：Vue 3 + Vite + Pinia + Vue Router + TypeScript。後端另開（Python / FastAPI）。

## 開始開發

```sh
npm install
npm run dev
```

其他指令：

- `npm run build`：type-check 後打包
- `npm run type-check`：只做型別檢查
- `npm run format`：Prettier 格式化 `src/`

需要 Node 22.18 以上（或 24.12 以上）。

## 文件

- 規格（產品、功能、資料表、API、驗收）：[spec/README.md](spec/README.md)
- 資料夾怎麼分、檔案放哪：[spec/structure.md](spec/structure.md)
- 尚未決定、待討論的事：[spec/open-questions.md](spec/open-questions.md)
- 給 Claude Code 的專案說明：[CLAUDE.md](CLAUDE.md)

流程圖與討論紀錄不在 repo 內，見 spec/README.md 的說明。

## 編輯器

建議 VS Code + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（停用 Vetur），以及 Prettier 外掛。
