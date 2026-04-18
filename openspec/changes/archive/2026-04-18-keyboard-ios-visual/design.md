# Design: keyboard-ios-visual

## 修改檔案
- `style.css`（全部為 CSS token + 元件樣式，零 JS 修改）

## 1. 新增鍵盤色彩 tokens（`:root`）

```css
--kbd-bg: #D1D5DB;
--kbd-key-bg: #FFFFFF;
--kbd-key-bg-pressed: #A8AEBC;
--kbd-fn-bg: #ADB5BD;
--kbd-fn-bg-pressed: #888E99;
--kbd-key-shadow: 0 1px 0 1px #898A8D;
--kbd-fn-shadow: 0 1px 0 1px #62666E;
--cand-bg: #FFFFFF;
--cand-border: #C5C5C5;
```

## 2. `.keyboard-panel` 底板

```css
.keyboard-panel {
  background: var(--kbd-bg);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding-top: 12px;
}
```

## 3. `.keyboard-key--row`（一般行鍵）

```css
.keyboard-key--row {
  background: var(--kbd-key-bg);
  border-radius: 10px;
  box-shadow: var(--kbd-key-shadow);
  /* 移除現有的毛玻璃漸層 background */
}
.keyboard-key--row:active,
.keyboard-key--row.is-pressed {
  background: var(--kbd-key-bg-pressed);
  box-shadow: none;
}
```

## 4. `.keyboard-key--action`（功能鍵）

```css
.keyboard-key--action {
  background: var(--kbd-fn-bg);
  border-radius: 10px;
  box-shadow: var(--kbd-fn-shadow);
}
.keyboard-key--action:active,
.keyboard-key--action.is-pressed {
  background: var(--kbd-fn-bg-pressed);
  box-shadow: none;
}
```

## 5. 確定鍵特別樣式

```css
.keyboard-key--action[data-action-id="confirm"] {
  background: #007AFF;
  color: #fff;
  box-shadow: 0 1px 0 1px #0055CC;
}
.keyboard-key--action[data-action-id="confirm"]:disabled {
  background: var(--kbd-fn-bg);
  color: var(--muted);
  box-shadow: var(--kbd-fn-shadow);
}
```

## 6. `.candidate-panel` 白底

```css
.candidate-panel {
  background: var(--cand-bg);
  border-bottom: 1px solid var(--cand-border);
}
```

## 注意事項
- 確認 `renderButtons()` 中 `actionId` 是否作為 `data-*` attribute 寫入 DOM，若無需補充
- 確定鍵 disabled 狀態需保持灰色（不能是藍色 + disabled 視覺混淆）
