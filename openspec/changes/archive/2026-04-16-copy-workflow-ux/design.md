# Design: copy-workflow-ux

## 修改檔案
- `index.html`（副標文字、按鈕結構）
- `style.css`（複製按鈕升級、text-display user-select）
- `app.js`（複製按鈕狀態回饋、Toast 文字）

## 1. Header 副標

`index.html` 的 `<h1>` 後加副標：

```html
<h1 id="output-heading">注音日文鍵盤</h1>
<p class="app-tagline">輸入完成後複製到其他 App</p>
```

CSS：
```css
.app-tagline {
  margin: 0;
  font-size: 0.75rem;
  color: var(--muted);
}
```

## 2. 複製按鈕升級為主要 CTA

```css
.output-button--copy {
  flex: 2;          /* 比分享按鈕寬（分享 flex: 1） */
  font-weight: 700;
  background: var(--primary);
  color: #fff;
}
```

## 3. 複製成功狀態回饋（app.js）

在 `handleCopy()` 函式中，複製成功後：
```js
copyButton.textContent = "已複製 ✓";
copyButton.disabled = true;
setTimeout(() => {
  copyButton.textContent = "複製";
  copyButton.disabled = false;
}, 1500);
```

## 4. Toast 引導文字

```js
showToast("已複製到剪貼簿\n切換到目標 App，長按輸入框選「貼上」");
```

Toast CSS 需支援多行：
```css
.toast {
  white-space: pre-line;   /* 新增，支援 \n 換行 */
}
```

## 5. text-display user-select

```css
.text-display {
  -webkit-user-select: text;   /* 新增 */
  user-select: text;
}
```
