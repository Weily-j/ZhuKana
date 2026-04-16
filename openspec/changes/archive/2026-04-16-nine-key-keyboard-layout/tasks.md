## 1. 資料層：phonetic-map 補上 ん

- [x] 1.1 在 `data/phonetic-map.json` 的 `wa` 行，將 `right` 方向從 disabled 改為 `{ "hiragana": "ん", "katakana": "ン", "phonetic": "ㄣ" }`
- [x] 1.2 執行 `node --test` 確認 data 格式測試通過

## 2. CSS：重排 keyboard-grid 為 4×4

- [x] 2.1 修改 `style.css` 的 `.keyboard-grid`：`grid-template-columns: repeat(4, var(--key-size))`、`grid-template-rows: repeat(4, minmax(0, 1fr))`

## 3. app.js：重寫 KEY_LAYOUT

- [x] 3.1 將 `KEY_LAYOUT` 陣列改為 16 個按鍵，順序如下（對應 4×4 grid 由左到右、由上到下）：
  - R1: row(a), row(ka), row(sa), action(backspace)
  - R2: row(ta), row(na), row(ha), action(confirm)
  - R3: row(ma), row(ya), row(ra), action(newline)
  - R4: action(mode), row(wa), action(voicing), action(space)
- [x] 3.2 在 `handleAction` 新增 `space` case：送出緩衝區並插入空格（`appendConfirmedText(commitBuffer(state), " ")`）
- [x] 3.3 移除 `handleAction` 中的 `latin`、`globe`、`more`、`n`、`punct` case

## 4. app.js：平/片鍵顯示當前模式

- [x] 4.1 修改 `renderButtons()`：讓 `mode` 按鍵的 `.key-main` 文字在平假名時顯示「平」、片假名時顯示「片」
- [x] 4.2 確認 `keyboard-key--mode-active` 樣式在片假名模式下正確套用到 mode 鍵（現有邏輯已有，確認 label 邏輯正確即可）

## 5. 測試更新

- [x] 5.1 更新 `tests/core.test.js` 或 `tests/data.test.js`：驗證 `wa` 行的 `right` 方向能正確輸入 ん/ン
- [x] 5.2 執行 `node --test` 確認全部測試通過
- [x] 5.3 執行 `npm run build:pages` 確認建置無誤
