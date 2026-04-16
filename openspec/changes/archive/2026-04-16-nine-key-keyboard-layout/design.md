## Context

目前 `app.js` 的 `KEY_LAYOUT` 陣列定義了 20 個按鍵，渲染到 `style.css` 中 `grid-template-columns: repeat(5, 1fr)` 的 5×4 grid。這個佈局讓按鍵較窄、且 9 個假名主鍵的空間位置與 iOS 日文九宮格不同，練習 ZhuKana 建立的肌肉記憶無法遷移到真實鍵盤。

## Goals / Non-Goals

**Goals:**
- 重排 grid 為 4 欄 × 4 列（3 假名欄 + 1 功能欄）
- 假名主鍵（あ/か/さ/た/な/は/ま/や/ら/わ）的位置完全對齊 iOS 九宮格標準
- 平/片 鍵顯示當前模式（視覺狀態，非純觸發器）

**Non-Goals:**
- 不增加英文輸入（ABC）功能
- 不新增標點符號選單
- 不改動 flick 輸入邏輯或 phonetic-map 資料

## Decisions

### D1：4×4 grid，右欄為功能鍵

```
[あ][か][さ][⌫  ]
[た][な][は][確定]
[ま][や][ら][↵  ]
[平/片][わ][変音][空白]
```

相較 iOS 標準（⌫ / ↵ / 変換 / ABC / わ / 。、 / 空白），差異如下：

| 位置 | iOS 原版 | ZhuKana | 理由 |
|------|---------|---------|------|
| R2C4 | 変換 | 確定 | 語意等效（確認輸入） |
| R4C1 | ABC | 平/片 | 無英文切換需求，同位置語意替換 |
| R4C3 | 。、 | 変音 | 練習模式下変音使用頻率遠高於標點 |

9 個假名主鍵位置 100% 與 iOS 標準一致。

### D2：移除的功能鍵

移除 ABC、🌐、更多 ›、ん 獨立鍵、。、標點鍵。

- **ん 輸入**：改由 `わ行` 的 flick → 方向輸入（わ tap、を ↑、ん → ），與 iOS 行為一致。
- **標點輸入**：Phase 1 不支援，使用者可貼上後編輯。
- **次候補翻頁**：移除「更多 ›」，候補欄改為水平 scroll（目前已有 scroll 機制，無需翻頁鍵）。

### D3：わ行 新增 ん 方向

`phonetic-map.json` 中 `wa` 行的 `right` 方向目前為 disabled。需要補上：

```json
"right": { "hiragana": "ん", "katakana": "ン", "phonetic": "ㄣ" }
```

這與 iOS 的 わ 行 flick → = ん 行為一致。

### D4：平/片 鍵顯示當前模式

`keyboard-key--mode-active` 樣式類別已存在（目前用於平/片鍵）。改為：
- 平假名模式：正常樣式，標籤顯示「平」
- 片假名模式：`keyboard-key--mode-active` 樣式，標籤顯示「片」

讓使用者一眼看到當前模式，不必查看右上角指示器。

### D5：確定鍵在無 buffer 時維持 disabled

不改變現有行為，避免誤觸換行。

## Risks / Trade-offs

- **[Risk] 移除 。、 標點鍵** → Phase 1 接受此限制；候選詞庫包含含標點的詞組可繼續使用
- **[Risk] わ 行新增 ん** → 需同步更新 `sw.js` 的 STATIC_ASSETS（data 路徑未變動，實際上不影響）；需新增對應測試
- **[Risk] 使用者舊習慣適應** → 這是刻意 breaking change，目標是對齊新標準

## Open Questions

（已於 explore 階段決定，無待解事項）
