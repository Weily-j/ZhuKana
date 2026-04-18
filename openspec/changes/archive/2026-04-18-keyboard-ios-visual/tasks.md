## 1. 新增鍵盤 CSS tokens

- [x] 1.1 在 `style.css` 的 `:root` 新增 `--kbd-bg`、`--kbd-key-bg`、`--kbd-key-bg-pressed`、`--kbd-fn-bg`、`--kbd-fn-bg-pressed`、`--kbd-key-shadow`、`--kbd-fn-shadow`、`--cand-bg`、`--cand-border` 9 個 token

## 2. 鍵盤底板背景

- [x] 2.1 在 `style.css` 的 `.keyboard-panel` 加上 `background: var(--kbd-bg)`、`border-radius: var(--radius-lg) var(--radius-lg) 0 0`

## 3. 確認 data-action-id attribute

- [x] 3.1 檢查 `app.js` 的 `buildKeyboard()` 是否將 `actionId` 寫入按鈕的 `data-action-id` attribute（若無，補上）

## 4. 行鍵樣式修改

- [x] 4.1 修改 `style.css` 的 `.keyboard-key--row`：background 改 `var(--kbd-key-bg)`，border-radius 改 `10px`，box-shadow 改 `var(--kbd-key-shadow)`，移除現有毛玻璃漸層
- [x] 4.2 修改 `.keyboard-key--row:active` / `.is-pressed`：background 改 `var(--kbd-key-bg-pressed)`，box-shadow 改 `none`

## 5. 功能鍵樣式修改

- [x] 5.1 修改 `style.css` 的 `.keyboard-key--action`：background 改 `var(--kbd-fn-bg)`，border-radius 改 `10px`，box-shadow 改 `var(--kbd-fn-shadow)`
- [x] 5.2 修改 `.keyboard-key--action:active` / `.is-pressed`：background 改 `var(--kbd-fn-bg-pressed)`，box-shadow 改 `none`

## 6. 確定鍵特別樣式

- [x] 6.1 新增 `.keyboard-key--action[data-action-id="confirm"]`：background `#007AFF`，color `#fff`，box-shadow `0 1px 0 1px #0055CC`
- [x] 6.2 新增 disabled 狀態回退為灰色

## 7. 候補欄白底

- [x] 7.1 修改 `style.css` 的 `.candidate-panel`：加上 `background: var(--cand-bg)` 與 `border-bottom: 1px solid var(--cand-border)`

## 8. 驗收

- [x] 8.1 執行 `node --test` 確認全部通過（純 CSS，應全過）
- [x] 8.2 執行 `npm run build:pages` 確認建置無誤
- [x] 8.3 視覺確認：行鍵白色有立體陰影、功能鍵中灰、確定鍵藍色、鍵盤底板灰色（由後續 ios-style-refresh 完整替換）
