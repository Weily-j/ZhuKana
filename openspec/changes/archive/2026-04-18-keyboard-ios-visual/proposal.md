# Proposal: keyboard-ios-visual

## Problem
ZhuKana 的鍵盤區塊採用自訂毛玻璃藍色風格，與 iOS 原生日文鍵盤的視覺語言差距大，造成認知摩擦——使用者無法直覺對應「這是在練習 iOS 日文鍵盤」的心理模型，降低肌肉記憶遷移的效果。

## Core Insight
台灣使用者的 iOS 市占率高，且 flick 九宮格本身源自 iOS 日文鍵盤。鍵盤視覺對齊 iOS 語言可強化「練習後可無縫切換到真實鍵盤」的價值主張。

## Design Targets（iOS 風格）
- 鍵盤底板：`#D1D5DB` 灰色，與上方內容區明確切割
- 一般行鍵：白色 + 底部單側陰影 `0 1px 0 1px #898A8D`（立體感核心）
- 功能鍵（⌫ ↵ 変音 空白 平/片）：中灰 `#ADB5BD` 背景
- 確定鍵：iOS 藍 `#007AFF`（最高視覺權重，對應 Return 鍵）
- 候補欄：白色底板 + 底部 `1px #C5C5C5` 分隔線
- 按下狀態：背景變深，陰影消失（視覺下沉感）

## Solution
1. 在 `style.css` `:root` 新增鍵盤色彩 tokens
2. `.keyboard-panel` 加灰色背景、上方圓角、左右撐滿
3. `.keyboard-key--row` 改白色 + 底部陰影
4. `.keyboard-key--action` 改中灰；`.keyboard-key--action[data-action="confirm"]` 改藍色
5. `.candidate-panel` 改白色底板 + 分隔線
6. 移除現有的四面擴散陰影（毛玻璃效果）

## Out of Scope
- 按鍵排列/功能不做任何改動
- 不支援 Android（Gboard）主題切換

## Success Criteria
- 視覺上能辨認「這是 iOS 風格的日文九宮格鍵盤」
- 行鍵與功能鍵在視覺上能清楚區分
- 不影響任何 JS 測試（純 CSS 修改）
