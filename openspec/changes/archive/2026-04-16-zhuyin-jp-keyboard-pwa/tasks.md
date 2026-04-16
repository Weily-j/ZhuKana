## 1. 專案初始化

- [x] 1.1 建立 PWA 專案結構（index.html、style.css、app.js、manifest.json、sw.js）
- [x] 1.2 設定 manifest.json：name、short_name、display: standalone、orientation: portrait、theme_color
- [x] 1.3 設定 Service Worker（sw.js）快取所有靜態資源，支援離線使用
- [x] 1.4 設定 viewport meta：`viewport-fit=cover`，處理 Safe Area
- [x] 1.5 鎖定 portrait 方向（manifest orientation 與 CSS media query 雙重保障）

## 2. 注音↔假名對應資料

- [x] 2.1 建立 `data/phonetic-map.json`：清音 10 行完整對應，含注音、例外標記（exception: true）
- [x] 2.2 補充 phonetic-map.json：濁音 4 行（が・ざ・だ・ば行）
- [x] 2.3 補充 phonetic-map.json：半濁音 1 行（ぱ行）
- [x] 2.4 標記同音合流字：じ＝ぢ＝ㄐㄧ、ず＝づ＝ㄗㄨ（merge: true）
- [x] 2.5 標記 を＝ㄛ（special: true，說明「現代口語等同お」）
- [x] 2.6 建立靜態候補詞庫 `data/candidates.json`（旅遊常用詞 500–1000 筆）

## 3. 鍵盤版面（HTML/CSS）

- [x] 3.1 實作三層 UI 結構：文字輸入區（27%）、候補欄（44px）、九宮格鍵盤（55–65%）
- [x] 3.2 建立九宮格鍵盤 DOM：5欄×4列，主假名鍵 + 功能鍵
- [x] 3.3 例外行按鍵（ㄙ/ㄊ/ㄏ）套用橘色邊框樣式
- [x] 3.4 實作 Safe Area 底部留白（`padding-bottom: env(safe-area-inset-bottom)`）
- [x] 3.5 候補欄：固定 44px、橫向 overflow-x scroll、隱藏 scrollbar
- [x] 3.6 文字輸入區：複製（藍）、分享（紫）、清除（紅，右側獨立）三個按鈕樣式
- [x] 3.7 RWD 驗證：375px（iPhone SE）、390px（iPhone 14）、414px（iPhone Plus）寬度測試

## 4. 觸控事件與撥動機制

- [x] 4.1 實作 touch 事件處理（touchstart、touchmove、touchend），設定 `touch-action: none` 防止頁面捲動
- [x] 4.2 計算撥動方向（上/下/左/右）：依 touch 位移向量判斷，閾值設 20px
- [x] 4.3 長按偵測（>200ms）：觸發 callout bubble 顯示
- [x] 4.4 撥動展開選字框 UI：5 方向格子，顯示假名 + 注音提示
- [x] 4.5 例外字格子：橘色背景 + 正確注音 + 「例外」標籤
- [x] 4.6 ya 行・wa 行空格：特定方向格子顯示空白，不觸發輸入
- [x] 4.7 Vibration API 整合（按鍵點按：10ms 短震動，不支援時靜默降級）

## 5. 組字緩衝區與輸入邏輯

- [x] 5.1 實作前端組字緩衝區（JS 陣列），維護當前未確定假名序列
- [x] 5.2 輸入假名時：追加至緩衝區，文字區顯示帶藍色底線 + 「組字中」標籤
- [x] 5.3 「確定」鍵：緩衝區內容寫入 confirmed text，清空緩衝區，底線消失
- [x] 5.4 「⌫」退格鍵：優先刪除緩衝區最後一字；緩衝區空時刪除 confirmed 最後一字
- [x] 5.5 「更多 ›」鍵：候補欄切換至下一組候補
- [x] 5.6 點選候補：詞語寫入 confirmed text，緩衝區清空
- [x] 5.7 候補欄邏輯：以緩衝區假名為前綴比對 candidates.json，即時更新候補列表

## 6. 平假名 ↔ 片假名切換

- [x] 6.1 實作 kana mode 狀態（hiragana / katakana）
- [x] 6.2 `平/片` 按鍵切換 mode，按鍵標示高亮當前模式
- [x] 6.3 切換後所有新輸入假名依 mode 輸出對應字元（ひらがな 或 カタカナ）

## 7. 變音鍵（゛゜小）

- [x] 7.1 定義各假名的循環對應表（清音→濁音→半濁音→小字→清音）
- [x] 7.2 `變音` 鍵邏輯：取緩衝區最後一字，按循環表轉換，更新緩衝區
- [x] 7.3 片假名模式下相同邏輯適用（カ→ガ 等）

## 8. 文字輸出功能

- [x] 8.1 複製按鈕：呼叫 Clipboard API（`navigator.clipboard.writeText`），成功後短暫顯示「已複製✓」
- [x] 8.2 複製按鈕空文字時呈灰色不可用狀態
- [x] 8.3 分享按鈕：呼叫 Web Share API；不支援時降級為複製並顯示提示
- [x] 8.4 清除按鈕：長按 500ms 觸發清除，短按不執行；長按中顯示進度視覺反饋

## 9. Onboarding 與首次引導

- [x] 9.1 候補欄首次出現時顯示「點選完成輸入」提示；使用一次後寫入 localStorage 不再顯示
- [x] 9.2 清除按鈕旁顯示「長按才清除」提示文字（小字，不搶眼）

## 10. 測試與部署

- [ ] 10.1 在 iOS Safari 完整測試撥動輸入、複製、Safe Area
- [ ] 10.2 在 Android Chrome 完整測試震動回饋、分享功能
- [ ] 10.3 PWA 加至主畫面測試（iOS Add to Home Screen、Android 安裝提示）
- [x] 10.4 離線測試：關閉網路後重新開啟，確認 Service Worker 快取生效
- [x] 10.5 部署至靜態主機（Vercel 或 GitHub Pages）
