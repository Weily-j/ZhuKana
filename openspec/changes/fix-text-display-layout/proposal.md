# Proposal: fix-text-display-layout

## Problem
在小螢幕裝置（尤其 iPhone SE，可用高度 ~586px）上，輸入假名後文字輸入區無法顯示任何內容。根因為 `.app-shell` 使用百分比高度 `grid-template-rows: 27% 44px 1fr`，導致 `output-panel` 在小螢幕上被壓縮後，`text-display` 的 `minmax(0, 1fr)` 收縮至 0，`overflow: auto` 不顯示任何內容。

## Root Cause
```
iPhone SE 667px 可用高度：
  output-panel = 27% = 180px
  減去 panel-heading 62px → text-card = 118px
  .text-card grid: auto(toolbar) + minmax(0,1fr)(display) + auto(actions)
  → text-display 高度壓縮至接近 0
  → overflow: auto → 內容不可見
```

## Solution
1. 將 `.app-shell` 的 `grid-template-rows` 改為 `minmax(200px, auto) 44px 1fr`，輸入區有最小保護高度
2. 為 `.text-display` 加上 `min-height: 80px`，確保至少能顯示 2 行文字
3. 補充小螢幕 media query（`max-height: 680px`）：縮小 gap、字型、heading margin

## Out of Scope
- 不涉及文字輸入區的視覺/功能重設計（見 copy-workflow-ux change）
- 不修改 JS 邏輯

## Success Criteria
- iPhone SE（375×667）上輸入假名後文字正確顯示
- iPhone 13（390×844）上版面比例正常，不過度拉伸
- 16/16 tests 仍通過
