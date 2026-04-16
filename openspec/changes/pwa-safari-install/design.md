# Design: pwa-safari-install

## 修改檔案
- `manifest.json`
- `index.html`

## manifest.json 變更

```json
{
  "name": "注音日文鍵盤 PWA",
  "short_name": "注日鍵盤",
  "id": "/ZhuKana/",
  "scope": "./",
  "start_url": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#f5f7ff",
  "theme_color": "#2f6fed",
  "icons": [
    { "src": "./icons/app-icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "./icons/app-icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "./icons/app-icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "./icons/app-icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "./icons/app-icon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any maskable" }
  ]
}
```

注意：`purpose: "maskable"` 重用現有 PNG（已有安全區域設計則直接加；若 icon 設計無安全區域，需先確認再加）。

## index.html 變更

在 `<head>` 新增主要 iOS 螢幕尺寸的 startup image meta（使用通用規格覆蓋最常見機型）：

```html
<!-- iPhone startup images -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-startup-image" href="./icons/app-icon-512.png" />
```

補充說明：
- `black-translucent` 讓 status bar 疊在 viewport 上，搭配 `viewport-fit=cover` 更好
- 標準 startup image 需要精確的螢幕尺寸（要求 launch screen 圖片），目前以 512 icon 作為簡易 fallback

## SW 緩存更新
manifest.json 是靜態資源但不在 STATIC_ASSETS 中（已有 `./manifest.json` 在清單），修改後需確認 SW 版本是否要遞增。
