## 1. 建立 Design Tokens

- [ ] 1.1 在 `style.css` 的 `:root` 新增色彩 token：`--kbd-surface` (#D1D5DB)、`--key-kana-bg` (#FFFFFF)、`--key-kana-ink` (#000000)、`--key-fn-bg` (#ACB4BE)、`--key-fn-ink` (#000000)、`--key-accent-bg` (#007AFF)、`--key-accent-ink` (#FFFFFF)、`--key-exception` (#F08C2B)、`--key-shadow` (#A5ABB3)
- [ ] 1.2 在 `:root` 新增字級 token：`--key-main-size` (22pt)、`--key-sub-size` (10pt)、`--key-main-weight` (500)、`--key-sub-weight` (400)、`--key-sub-opacity` (0.55)
- [ ] 1.3 在 `:root` 新增圓角 token：`--radius-key` (5px)（保留現有 `--radius-md`/`--radius-lg` 不改）
- [ ] 1.4 確認 font stack：`-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif`

## 2. 鍵盤視覺對齊

- [ ] 2.1 修改 `.keyboard-panel`：`background: var(--kbd-surface)`，移除現有漸層
- [ ] 2.2 修改 `.keyboard-key--row`：`background: var(--key-kana-bg)`、`color: var(--key-kana-ink)`、`border-radius: var(--radius-key)`、`box-shadow: 0 1px 0 var(--key-shadow)`；主字套 `--key-main-size`/`--key-main-weight`；副字套 `--key-sub-size`/`--key-sub-weight`/`opacity: var(--key-sub-opacity)`
- [ ] 2.3 修改 `.keyboard-key--action`（功能鍵）：`background: var(--key-fn-bg)`、`color: var(--key-fn-ink)`（**移除藍字**）、`border-radius: var(--radius-key)`
- [ ] 2.4 修改 `.keyboard-key--action[data-action-id="confirm"]`（確定鍵）：`background: var(--key-accent-bg)`、`color: var(--key-accent-ink)`；disabled 狀態回退為 `--key-fn-bg` + 降透明
- [ ] 2.5 修改 `:active` / `.is-pressed` 狀態：背景降 brightness 10%、`box-shadow: none`；保留長按／flick 相關 class 行為
- [ ] 2.6 保留例外行（し/ち/つ/ふ 所在之 さ行/た行/は行）的 `border: 1.5px solid var(--key-exception)`

## 3. Header 與標題去藍

- [ ] 3.1 `.panel-heading h1`、`.meta-label`：color 改為 `var(--key-kana-ink)`（黑灰），移除藍
- [ ] 3.2 `.composition-badge`「組字中」：改為小膠囊（`background: var(--key-accent-bg)`、`color: #FFF`、`font-size: 12pt`、padding 收緊）
- [ ] 3.3 平假名／片假名 toggle (`.mode-toggle`)：去除藍底，改為灰底黑字，active 狀態加黑色 1px outline

## 4. 動作區改 icon bar

- [ ] 4.1 `index.html` 調整 `.output-actions` 結構：將 清除按鈕從動作區移除，改放入 `.text-display` 的右上角（新增 `.text-display__clear` 容器或類似）
- [ ] 4.2 `.text-display__clear`：紅色 × icon、`aria-label="清除（長按 500ms）"`、`title` tooltip；保留 app.js 現有長按 500ms 邏輯（pointer events 綁定節點改掉，行為不變）
- [ ] 4.3 動作區僅保留 複製 + 分享：`.output-actions` 改為 flex 橫排 icon bar，高度約 48px
- [ ] 4.4 `.output-button--copy`：icon + 「複製」文字，實心藍 pill（`--key-accent-bg` / `--key-accent-ink`），維持為主 CTA
- [ ] 4.5 `.output-button--share`：icon + 「分享」文字，幽靈樣式（透明底 + 1px `--key-kana-ink` border、`color: var(--key-kana-ink)`）
- [ ] 4.6 兩顆按鈕在 disabled 狀態（文字區為空）統一降透明、cursor: not-allowed

## 5. text-display 瘦身

- [ ] 5.1 縮減 `.text-display` 的 padding 與最小高度，讓鍵盤與動作區得到更多空間（實測調整至剛好放下主要 buffer + 長按提示）
- [ ] 5.2 「長按才清除」hint 移至清除 icon 附近的 `title`／首次浮動提示（3 秒後淡出），主版面不再常駐該字樣
- [ ] 5.3 確認「從鍵盤開始輸入」placeholder 字級降一級、色調轉淡

## 6. Service Worker 與快取

- [ ] 6.1 遞增 `sw.js` 的 `CACHE_NAME` 版本號
- [ ] 6.2 若有新增靜態資源，確認已加入 `STATIC_ASSETS`（本次多半無新資源，但仍需檢查）

## 7. 測試與驗收

- [ ] 7.1 執行 `node --test` 確認全部測試通過（純視覺改動，core.js 測試應不受影響）
- [ ] 7.2 執行 `npm run build:pages` 確認建置無誤，dist/ 產物正確包含新版 CSS
- [ ] 7.3 本機瀏覽器（Chrome）肉眼檢查：色彩對齊 iOS、圓角不再過圓、字級主從比清晰、icon bar 瘦身有效
- [ ] 7.4 驗證 `aria-label`／鍵盤可及性：清除 icon 有語義、複製／分享保有可聚焦性
- [ ] 7.5（實機）iOS Safari：確認 PWA 視覺與預期一致、長按清除仍可運作、複製按鈕觸發 Clipboard API
- [ ] 7.6（實機）Android Chrome：確認無 Android Material 陰影滲入、圓角顯示合理
- [ ] 7.7 文件：更新 `CLAUDE.md` 的 Pending 段落（移除「iOS Safari 視覺確認」，加入「5 欄改版評估」連結到 memory）
