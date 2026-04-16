# keyboard-layout Specification

## Purpose
TBD - created by archiving change zhuyin-jp-keyboard-pwa. Update Purpose after archive.
## Requirements
### Requirement: 九宮格鍵盤版面
鍵盤 SHALL 以 5 欄 × 4 列的九宮格排列呈現，每個主要輸入鍵代表一個日文假名行，按鍵上方顯示對應注音符號，下方顯示行名。

#### Scenario: 鍵盤正確顯示所有行按鍵
- **WHEN** 使用者開啟 PWA
- **THEN** 鍵盤顯示：母音(あ行)、ㄙ(さ行)、ㄊ(た行)、ㄎ(か行)、ㄋ(な行)、ㄏ(は行)、ㄇ(ま行)、ㄧ(や行)、ㄌ(ら行)、ㄨ(わ行) 共 10 個主鍵

#### Scenario: 例外行顯示橘色邊框
- **WHEN** 鍵盤靜態顯示時
- **THEN** ㄙ(さ行)、ㄊ(た行)、ㄏ(は行) 三個按鍵顯示橘色邊框，與一般行視覺區隔

### Requirement: 功能鍵配置
鍵盤 SHALL 包含以下功能鍵：`平/片`（平片假名切換）、`⌫`（退格）、`↵`（換行）、`ABC`（英文模式）、`變音`（゛゜小循環）、`更多 ›`（次候補）、`確定`（送出組字）、`🌐`（語言切換）、`ㄣ(ん)`（ん 獨立鍵）、`。、?!`（標點符號）。

#### Scenario: 退格鍵刪除最後一個字
- **WHEN** 使用者按下 ⌫
- **THEN** 組字緩衝區或文字輸入區的最後一個字元被刪除

#### Scenario: ん 獨立鍵直接輸入
- **WHEN** 使用者點按 ㄣ(ん) 鍵
- **THEN** 組字緩衝區新增 ん（或 ン，依當前平/片模式）

### Requirement: Safe Area 保護
鍵盤底部 SHALL 預留 `env(safe-area-inset-bottom)` 空間，避免被手機 Home Bar 遮蔽。

#### Scenario: iPhone 底部不被遮蔽
- **WHEN** 在有 Home Bar 的 iPhone 上使用
- **THEN** 最底排按鍵完整可見，不被 Home Bar 遮蔽

### Requirement: 版面比例
鍵盤 SHALL 佔螢幕高度的 55–65%，文字輸入區佔 25–30%，候補欄固定 44px。

#### Scenario: 版面在常見手機尺寸正確顯示
- **WHEN** 在 375px 寬度的手機上開啟（iPhone SE 尺寸）
- **THEN** 鍵盤、候補欄、文字區均完整顯示且無溢出

### Requirement: Portrait 方向鎖定
PWA SHALL 鎖定直向（portrait）顯示模式。

#### Scenario: 旋轉手機不改變版面
- **WHEN** 使用者將手機橫放
- **THEN** 介面維持直向，不切換為橫向佈局

