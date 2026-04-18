## Context

ZhuKana 目前的視覺樣式是早期為了快速上線而採用的通用 PWA 風格：高飽和藍色主題、按鍵圓角 20px、雙層標籤字級平坦（主字 1.15rem / 副字 0.76rem）、複製/分享/清除以三顆彩色 pill 按鈕並列。使用者實機回饋「看起來跟真的日文鍵盤還是有差距」，直觀感受偏向 Web demo 而非輸入法。

HIG 對鍵盤按鍵沒有像 Button 那樣的硬規範（WWDC21/10259 只談鍵盤配置邏輯），但可對齊的通用規範有：
- 觸控目標 ≥ 44pt × 44pt
- 系統色：systemBlue `#007AFF` / label `#000` / systemGray6 `#F2F2F7`
- iOS 鍵盤按鍵圓角實測 ~5pt
- Body 17pt、Caption 12pt、字族 SF Pro（JP fallback Hiragino Sans）

## Goals / Non-Goals

**Goals:**
- 單一視覺改版就讓使用者直覺判斷為「輸入法風格」，不再像 Web demo
- 保留 ZhuKana 的教學差異化：注音副標、し/ち/つ/ふ 橘色例外框
- 建立一套可複用的 design tokens，未來若推出深色模式或多主題可擴充
- 不破壞現有 9-key 肌肉記憶、不改動行為 spec

**Non-Goals:**
- 不做 4→5 欄重排（見延後決策 memory；scope 過大）
- 不做確定鍵/換行合併跨列長鍵
- 不做深色模式（先專注淺色 iOS 對齊）
- 不更換字族 / 不引入自訂 web font（僅用 system font stack）
- 不改 flick 手勢、core.js 邏輯、鍵位資料

## Decisions

### 1. 路線選擇：混合（路線 C）而非純擬真（A）或純學習（B）

預設擬真外觀（像 iOS），但保留注音副標為「主從字級」（主 3 : 副 1），讓遠看像 iOS、近看仍是教學工具。理由：
- 使用者反饋核心訴求是「質感」，不是「去教學化」
- 做 toggle（練習模式才顯示注音）會增加認知負擔且複雜化狀態
- 副標以 `opacity: 0.55` 壓低視覺權重，即可同時滿足兩種場景

**替代方案**：純擬真並把注音移到 tooltip／長按顯示——放棄，因為破壞零成本學習的價值。

### 2. 色彩策略：semantic tokens + 大幅去藍

導入 CSS 變數分層：
- 表面層：`--kbd-surface`（鍵盤底板）、`--kbd-key-bg` / `--kbd-fn-bg`（兩類按鍵底）
- 文字層：`--key-ink`（主字黑）、`--key-ink-muted`（副字灰）
- 強調層：`--key-accent-bg` 僅用於「確定」鍵（iOS systemBlue `#007AFF`）
- 保留層：`--key-exception` 橘色 `#F08C2B`（し/ち/つ/ふ 行鍵邊框）

標題 `h1`、`meta-label`、`composition-badge` 改為 `var(--key-ink)`，只有 CTA 類保留藍。

**替代方案**：用 `@media (prefers-color-scheme: dark)` 同步做深色模式——放棄，放下個 change。

### 3. 按鍵圓角 20px → 5px

20px 偏 Material / Android 風，5px 對齊 iOS 鍵盤按鍵實測。
陰影從柔陰影改為 1px 硬底邊（`box-shadow: 0 1px 0 var(--key-shadow)`），貼近 iOS 系統鍵盤質感。

### 4. 字級比例：主副 3:1

主字（假名）22pt weight 500；副字（注音）10pt weight 400 opacity 0.55。
比例 3:1 以上，遠看視覺主導為假名，近看仍清楚看到注音。

**替代方案**：主副同行並列（あ ㄚ）——放棄，佔寬過大、對齊困難。

### 5. 動作區（複製/分享/清除）：icon bar + 清除分離

- 複製：保留為主要 CTA（icon + 文字「複製」），pill 縮為 icon button 尺寸
- 分享：降為 icon-only 幽靈按鈕（透明底 + 1px border）
- 清除：移至 text-display 右上角，紅色小 icon（🗑 或 ×）；長按 500ms 邏輯不變

理由：原版三顆大按鈕佔 ~80px 高，壓縮後 ~48px，可把空間還給 text-display 與鍵盤。

**替代方案**：把分享納入複製成功後的 toast 行動按鈕——可行但需大改互動，放下個 change。

### 6. `sw.js` 快取版本

本次改動 `style.css`、`index.html`，必須遞增 `CACHE_NAME` 讓離線快取失效。

## Risks / Trade-offs

- [使用者習慣舊三色按鈕可能短暫不適應] → 清除 icon 加 `aria-label="清除（長按）"` 與 title tooltip；保留長按語義
- [清除 icon 移至 text-display 角落可能被誤認為裝飾] → 使用紅色系 + 明顯 icon；首次出現時附浮動 hint 「長按才清除」
- [去除藍色後 `composition-badge` 可讀性下降] → 改用藍底膠囊但字小（`#007AFF` bg / `#fff` text，12pt），維持識別又不搶戲
- [SF Pro 在非 Apple 裝置不存在] → font stack：`-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif`
- [5px 圓角在低 DPI Android 可能看起來銳利] → 可用 `border-radius: 6px` 平衡；先定 5px，實機測試後微調

## Migration Plan

1. 新增／修改 CSS tokens 與樣式（純 CSS 變更，不動 JS）
2. 調整 `index.html` 結構：動作區改為 icon bar；清除 icon 移入 text-display header
3. 遞增 `sw.js` 的 `CACHE_NAME`
4. 本機測試 + 實機（iOS Safari 與 Android Chrome）確認
5. 部署後一週收集使用者回饋，評估是否排入 5 欄重排（下一個 change）

**Rollback**：純 CSS + 結構調整，若發現問題直接 `git revert` 即可；Service Worker 因 `CACHE_NAME` 已變動，使用者下次開啟會自動拉新版或回滾版。

## Open Questions

1. 清除 icon 用 🗑（明確）還是 ×（簡潔）？建議 ×，與 iOS 搜尋欄 clear 按鈕一致。
2. 分享按鈕的幽靈樣式會不會讓使用者看不到？可能需要一個「使用者 testing：找 3-5 人試用」驗證。
3. `composition-badge`「組字中」是否乾脆拿掉，改用 text-display 內的藍色底線就夠？——傾向保留 badge，移除會讓 PWA 使用者不易察覺 buffer 狀態。
