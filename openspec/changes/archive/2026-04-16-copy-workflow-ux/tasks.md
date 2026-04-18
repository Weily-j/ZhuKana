## 1. Header 副標文字

- [x] 1.1 在 `index.html` 的 `<h1>` 後新增 `<p class="app-tagline">輸入完成後複製到其他 App</p>`
- [x] 1.2 在 `style.css` 新增 `.app-tagline` 樣式（font-size: 0.75rem, color: var(--muted), margin: 0）

## 2. 複製按鈕升級為主要 CTA

- [x] 2.1 在 `style.css` 修改 `.output-button--copy`：加上 `flex: 2`、`font-weight: 700`、`background: var(--primary)`、`color: #fff`
- [x] 2.2 確認分享按鈕保持 `flex: 1`（視覺次要）

## 3. 複製成功狀態回饋

- [x] 3.1 在 `app.js` 的複製成功 callback 中，加上按鈕文字暫時變為「已複製 ✓」並在 1500ms 後恢復

## 4. Toast 引導文字

- [x] 4.1 將複製成功的 `showToast()` 呼叫改為多行文字：「已複製到剪貼簿\n切換到目標 App，長按輸入框選「貼上」」
- [x] 4.2 在 `style.css` 的 `.toast` 加上 `white-space: pre-line` 支援換行

## 5. text-display 可選取

- [x] 5.1 在 `style.css` 的 `.text-display` 加上 `-webkit-user-select: text` 與 `user-select: text`

## 6. 驗收

- [x] 6.1 執行 `node --test` 確認全部通過
- [x] 6.2 執行 `npm run build:pages` 確認建置無誤
