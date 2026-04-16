# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
node --test                       # 執行全部測試
node --test tests/core.test.js    # 執行單一測試檔
npm run build:pages               # 建置到 dist/（GitHub Pages artifact）
npm run generate:candidates       # 重新產生 data/candidates.json
node scripts/generate-icon.mjs    # 重新產生 icons/app-icon-{192,512}.png
```

## Architecture

### Two-layer separation

`lib/core.js` — 純函式層，零 DOM 操作、零副作用。所有鍵盤邏輯、假名轉換、狀態轉換都在這裡。測試只需 import 這個檔案，不需要瀏覽器環境。

`app.js` — DOM 層，負責 touch event、render、Service Worker 註冊。從 `lib/core.js` import 所有業務邏輯，自己只負責 UI 銜接。

**規則**：`lib/core.js` = 純函式；`app.js` = DOM only，邏輯委派給 core.js。

### Data files

- `data/phonetic-map.json` — 注音↔假名對應表，含 `exception: true`（し/ち/つ/ふ）與 `merge: true`（じ=ぢ、ず=づ）標記。
- `data/candidates.json` — 旅遊詞彙候補，由 `scripts/generate-candidates.mjs` 產生。

### State model

`app.js` 維護單一 `appState` 物件（由 `createInitialState()` 建立），每次輸入事件以 spread 產生新 state（`appState = { ...appState, key: value }`），再呼叫 `render()` 更新 DOM。state 包含：`confirmed`（已確認文字）、`buffer`（組字中假名陣列）、`variantOrigins`（循環變音的 origin 追蹤）、`mode`（hiragana/katakana）、`candidatePage`。

### Service Worker

`sw.js` 採 cache-first 策略。新增或修改靜態資源時，必須同步更新 `STATIC_ASSETS` 陣列並遞增 `CACHE_NAME` 版本號（定義在 `sw.js` 頂端），否則離線版本不會更新。

### Tests

使用 Node.js 內建 `node:test` / `assert/strict`，無需安裝任何測試框架。4 個測試檔分別涵蓋：core 邏輯、data 格式驗證、PWA 資源完整性、Pages 部署產物。

## Deployment

- GitHub repo: `Weily-j/ZhuKana`
- 線上網址: `https://weily-j.github.io/ZhuKana/`
- **只用 SSH alias**：`git@github-weily-j:Weily-j/ZhuKana.git`（HTTPS 因本機憑證綁到錯誤帳號 `weily-jp` 而被拒）
  - `~/.ssh/config` 中 `Host github-weily-j` 對應 `Weily-j` 帳號私鑰

## Pending (需實機驗證)

詳見 `openspec/changes/archive/2026-04-16-zhuyin-jp-keyboard-pwa/tasks.md` 的 10.1–10.3：

- iOS Safari：flick 輸入、複製、Safe Area
- Android Chrome：震動回饋、分享功能
- Add to Home Screen / 安裝提示流程
