## 1. manifest.json 補欄位

- [x] 1.1 在 `manifest.json` 新增 `"id": "/ZhuKana/"` 欄位
- [x] 1.2 在 `manifest.json` 新增 `"scope": "./"` 欄位
- [x] 1.3 在 `manifest.json` 的 icons 陣列，為 192×192 和 512×512 PNG 各補一個 `"purpose": "maskable"` 的 entry（src 相同，purpose 不同）

## 2. index.html 補 meta

- [x] 2.1 將 `apple-mobile-web-app-status-bar-style` 的 content 從 `"default"` 改為 `"black-translucent"`
- [x] 2.2 新增 `<link rel="apple-touch-startup-image" href="./icons/app-icon-512.png" />`

## 3. SW 版本確認

- [x] 3.1 檢查 `manifest.json` 是否已在 `sw.js` 的 `STATIC_ASSETS` 清單中（確認 → 需要遞增 CACHE_NAME）
- [x] 3.2 若需要，遞增 `sw.js` 中的 `CACHE_NAME` 版本號

## 4. 驗收

- [x] 4.1 執行 `node --test` 確認全部通過
- [x] 4.2 執行 `npm run build:pages` 確認建置無誤
- [ ] 4.3（實機）在 iOS Safari 執行「加入主畫面」→ 從桌面開啟確認 standalone 模式
