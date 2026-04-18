## ADDED Requirements

### Requirement: 複製工作流程副標
輸出區 header SHALL 顯示一行副標，明確說明本介面的主要用途是完成輸入後複製到其他 App。

#### Scenario: Header 顯示複製導向副標
- **WHEN** 使用者開啟 ZhuKana
- **THEN** 在標題「注音日文鍵盤」下方顯示「輸入完成後複製到其他 App」

### Requirement: 複製按鈕為主要 CTA
當輸出區可操作時，複製按鈕 SHALL 比分享按鈕擁有更高的視覺權重，讓使用者一眼辨識複製是主要下一步。

#### Scenario: 複製按鈕視覺上比分享按鈕更突出
- **WHEN** 輸出區同時顯示複製與分享按鈕
- **THEN** 複製按鈕呈現更大的主要 CTA 樣式，分享按鈕維持次要動作樣式

### Requirement: 複製後顯示貼上引導
複製成功後，系統 SHALL 顯示包含下一步操作說明的回饋訊息，引導使用者切換到目標 App 並貼上文字。

#### Scenario: 複製成功後顯示兩段式引導
- **WHEN** 使用者成功按下複製按鈕
- **THEN** Toast 顯示「已複製到剪貼簿」以及「切換到目標 App，長按輸入框選『貼上』」的多行提示

### Requirement: 文字輸出區支援原生選取
文字輸出區 SHALL 允許瀏覽器原生文字選取，作為 Clipboard API 不可用或使用者偏好手動複製時的備援流程。

#### Scenario: 在支援原生選取的瀏覽器可長按選字
- **WHEN** 使用者在 iOS Safari 等支援原生選取的瀏覽器長按文字輸出區
- **THEN** 系統允許原生文字選取與複製選單出現
