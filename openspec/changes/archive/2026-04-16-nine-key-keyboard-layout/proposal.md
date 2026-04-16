## Why

目前的鍵盤是 5 欄 × 4 列佈局，與日文手機標準九宮格（3 欄 × 4 列）不符，導致使用者在 ZhuKana 練習後，肌肉記憶無法遷移到真實的 iOS / Android 日文鍵盤。調整佈局至標準九宮格，讓練習即是實戰準備。

## What Changes

- **BREAKING** 鍵盤 grid 從 5×4 重排為 4×4（3 欄假名 + 1 欄功能鍵）
- 假名主鍵（あ/か/さ/た/な/は/ま/や/ら/わ）的行列位置對齊 iOS 九宮格標準
- 右側功能欄改為：⌫（R1）、確定（R2）、↵（R3）
- 底部橫列改為：平/片（R4C1）、わ行（R4C2）、変音（R4C3）、空白（R4C4）
- 平/片 鍵需視覺顯示目前模式（非純切換觸發器）
- 移除：ABC、🌐（globe）、更多 ›（候補翻頁）、ん 獨立鍵、。、? 標點鍵
- 空白鍵（全形空白）新增至 R4C4

## Capabilities

### New Capabilities

（無新 capability，屬於既有 keyboard-layout capability 的 requirement 變更）

### Modified Capabilities

- `keyboard-layout`：按鍵位置規格從 5×4 改為 4×4，定義每格的 rowId / actionId 對應

## Impact

- `app.js`：`KEY_LAYOUT` 陣列重寫，`buildKeyboard()` 的 grid 邏輯對應更新
- `style.css`：`.keyboard-grid` 的 `grid-template-columns` / `grid-template-rows` 修改
- `data/phonetic-map.json`：不變（假名資料本身不動）
- 移除的按鍵功能（ABC、globe、更多 ›、ん、punct）需確認 `handleAction()` 相應清除
