## 1. 修正 .app-shell 高度分配

- [x] 1.1 將 `style.css` 的 `.app-shell` `grid-template-rows` 從 `27% 44px 1fr` 改為 `minmax(200px, auto) 44px 1fr`

## 2. 為 text-display 加最小高度

- [x] 2.1 在 `.text-display` 規則加上 `min-height: 80px`

## 3. 小螢幕 media query

- [x] 3.1 在 `style.css` 末端新增 `@media (max-height: 680px)` breakpoint：`gap: 6px`、`.panel-heading { margin-bottom: 4px }`、`.text-display { min-height: 56px; font-size: 1rem }`

## 4. 驗收

- [x] 4.1 執行 `node --test` 確認全部通過
- [x] 4.2 執行 `npm run build:pages` 確認建置無誤
