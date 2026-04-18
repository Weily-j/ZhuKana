## Why

目前 ZhuKana 的鍵盤視覺與 iOS 原生日文鍵盤落差大（藍色過多、按鍵過圓、主副字級比例偏平、動作區佔版面過大），使用者直覺感受「像 Web demo」而非輸入法。本次對齊 Apple HIG 與 iOS 系統色，走「擬真為主 + 注音副標保留」的混合路線（路線 C），維持教學價值但拉高質感。

## What Changes

- 重構 `style.css` 的色彩 tokens：假名鍵白底黑字、功能鍵灰底黑字、確定鍵 `#007AFF` systemBlue，移除雙色複製/分享、紫色、多餘藍色文字；僅保留 `#F08C2B` 橘色例外框（し/ち/つ/ふ 教學差異化）
- 按鍵圓角 `20px` → `5px`（對齊 iOS 鍵盤）
- 主副字級比拉到 3:1（主字假名 ~22pt weight 500、副字注音 ~10pt weight 400 opacity 0.55）
- 動作區（複製/分享/清除）從三顆大 pill 按鈕改為 icon bar；清除 icon 移至 text-display 右上角（長按邏輯不變）
- text-display 高度縮減，「組字中」badge 視覺瘦身
- 標題 `h1`、`meta-label`、`composition-badge` 的藍字改為系統黑灰
- **BREAKING（視覺層）**：複製/分享/清除按鈕不再以紅/藍/紫三色區分，改以位置與 icon 語意區分

**不在本次 scope**：
- 鍵位結構變動（維持 4 欄，不升 5 欄）
- 功能鍵重排（→ ⟲ ABC 表情 不加入）
- flick 手勢、core.js 邏輯、鍵位資料
- 確定/換行合併跨列

## Capabilities

### New Capabilities
無。

### Modified Capabilities
- `text-output`：複製/分享/清除的「視覺區隔」requirement 改為以位置＋icon 區分，非以紅/藍/紫底色區分

（`keyboard-layout` 的行為 requirement 不動；視覺 token 調整屬實作細節，不牽動 spec-level behavior。）

## Impact

- **Code**：`style.css`（:root tokens、`.keyboard-*`、`.output-button--*`、`.panel-heading`、`.text-display` 相關樣式）、`index.html`（`.output-actions` 結構調整為 icon bar，清除 icon 移入 text-display 容器）
- **不變**：`app.js` 的 `buildKeyboard()`、`lib/core.js`、`data/*`、測試檔
- **Service Worker**：`sw.js` 的 `CACHE_NAME` 需遞增版本號以觸發更新
- **依賴**：無新增第三方依賴；可能引入 SF Pro font-family fallback chain
- **風險**：使用者習慣舊三色按鈕可能短暫不適應 → icon 需配合明確 tooltip 與 aria-label
