# Design: fix-text-display-layout

## 修改檔案
- `style.css`

## CSS 修改細節

### 1. `.app-shell` grid-template-rows
```css
/* 舊 */
grid-template-rows: 27% 44px 1fr;

/* 新 */
grid-template-rows: minmax(200px, auto) 44px 1fr;
```
`minmax(200px, auto)` 確保 output-panel 至少 200px，有足夠文字時自然撐高。

### 2. `.text-display` min-height
```css
.text-display {
  min-height: 80px;   /* 新增：保證至少顯示 2 行文字的空間 */
}
```

### 3. 小螢幕 media query（`max-height: 680px`，對應 iPhone SE）
```css
@media (max-height: 680px) {
  .app-shell {
    gap: 6px;          /* 從 12px 縮小 */
  }
  .panel-heading {
    margin-bottom: 4px;
  }
  .text-display {
    min-height: 56px;
    font-size: 1rem;   /* 從 clamp(1.1rem,...) 縮小 */
  }
}
```

## 不需要修改
- `app.js`：renderText() 邏輯正確，問題純為 layout
- `index.html`：HTML 結構不變
- 測試：純 CSS 變更，不影響 node:test
