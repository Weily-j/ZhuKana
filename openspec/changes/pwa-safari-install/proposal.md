# Proposal: pwa-safari-install

## Problem
iOS Safari 使用者完成「加入主畫面」流程後，從桌面開啟 ZhuKana 時看到 URL bar（Safari 模式），而非預期的 standalone App 模式。導致使用者認為「安裝失敗」，降低 PWA 的留存率。

## Root Cause
`manifest.json` 缺少 iOS Safari PWA 正確運作所需的欄位，主要問題：
1. 缺少 `scope`：Safari 無法確定 standalone 邊界，退回瀏覽器模式
2. 缺少 `id`：iOS 17+ 以此作為 PWA 唯一識別，缺少時安裝行為不穩定
3. PNG icons 缺少 `maskable` purpose：桌面 icon 邊緣破版
4. 缺少 `apple-touch-startup-image`：從桌面開啟時白屏閃爍
5. `apple-mobile-web-app-status-bar-style` 需搭配 standalone 確認

## Solution
1. manifest.json 補充 `scope`、`id` 欄位
2. 補充 maskable PNG 版本（192×192、512×512）或確認 SVG maskable 在 iOS 的支援
3. index.html 補充主要 iOS 螢幕尺寸的 `apple-touch-startup-image` meta
4. 確認 `apple-mobile-web-app-status-bar-style` 設定值正確

## Out of Scope
- Android Chrome 的安裝 banner（`beforeinstallprompt`）
- screenshots meta（後續 Sprint 再補）

## Success Criteria
- 在 iPhone Safari 執行「加入主畫面」後，從桌面開啟呈現 standalone 模式（無 URL bar）
- 桌面 icon 顯示正確、不破版
- 開啟時無白屏閃爍
