# text-output Specification

## Purpose
TBD - created by archiving change zhuyin-jp-keyboard-pwa. Update Purpose after archive.
## Requirements
### Requirement: 文字輸入區顯示
文字輸入區 SHALL 顯示所有已確定輸入的日文假名，並區分已確定（無底線）與未確定（藍色底線）狀態。

#### Scenario: 已確定文字無底線
- **WHEN** 使用者按下確定鍵送出組字
- **THEN** 文字輸入區的文字底線消失，顯示為一般文字

### Requirement: 複製功能
複製按鈕 SHALL 將文字輸入區全部內容複製至裝置剪貼簿。

#### Scenario: 成功複製文字
- **WHEN** 使用者按下 複製 按鈕
- **THEN** 文字輸入區內容寫入剪貼簿，按鈕短暫顯示「已複製✓」回饋

#### Scenario: 無文字時複製按鈕狀態
- **WHEN** 文字輸入區為空
- **THEN** 複製按鈕呈灰色不可用狀態

### Requirement: 分享功能
分享按鈕 SHALL 呼叫系統原生 Web Share API 分享文字輸入區內容。

#### Scenario: 成功觸發系統分享
- **WHEN** 使用者按下 分享 按鈕且裝置支援 Web Share API
- **THEN** 系統分享表單彈出，包含文字輸入區內容

#### Scenario: 不支援時降級為複製
- **WHEN** 使用者的瀏覽器不支援 Web Share API
- **THEN** 自動執行複製功能，並顯示「已複製」提示

### Requirement: 長按清除防誤觸
清除按鈕 SHALL 需要長按（≥500ms）才能觸發清除，防止誤觸。

#### Scenario: 長按觸發清除
- **WHEN** 使用者長按 清除 按鈕超過 500ms
- **THEN** 文字輸入區清空，組字緩衝區清空

#### Scenario: 短按不觸發清除
- **WHEN** 使用者短按（＜500ms）清除按鈕
- **THEN** 不執行任何清除操作，按鈕視覺短暫反應後恢復原狀

#### Scenario: 清除按鈕視覺區隔
- **WHEN** 輸出區處於可操作狀態
- **THEN** 清除按鈕以紅色 icon（×）呈現於文字輸入區（text-display）右上角，與複製／分享動作分離；複製與分享則以 icon bar 佈局呈現於文字輸入區下方，複製為實心主 CTA，分享為幽靈次要按鈕

### Requirement: 平假名 ↔ 片假名切換
`平/片` 按鈕 SHALL 切換鍵盤輸入模式，影響後續所有輸入的假名類型。

#### Scenario: 切換至片假名模式
- **WHEN** 使用者按下 平/片 按鈕（從平假名模式）
- **THEN** 按鈕高亮顯示「片」，後續輸入的假名為片假名（ア行 而非 あ行）

#### Scenario: 切換回平假名模式
- **WHEN** 使用者再次按下 平/片 按鈕（從片假名模式）
- **THEN** 按鈕高亮顯示「平」，後續輸入為平假名

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

### Requirement: 動作區採 icon bar 佈局
輸出區的複製、分享 SHALL 以 icon bar 形式並列於文字輸入區下方，並以視覺權重區分主／次要動作，避免以大面積三色 pill 佔用版面。

#### Scenario: 複製為主要 CTA
- **WHEN** 文字輸入區有可複製內容
- **THEN** 複製按鈕以 systemBlue 實心 pill 呈現（icon + 「複製」文字），視覺權重高於分享

#### Scenario: 分享為次要幽靈按鈕
- **WHEN** 瀏覽器支援 Web Share API 且文字輸入區有內容
- **THEN** 分享按鈕以 icon + 文字幽靈樣式呈現（透明底、1px border、同 `--key-ink` 色），視覺權重低於複製

#### Scenario: 無內容時 icon bar 整體 disabled
- **WHEN** 文字輸入區為空
- **THEN** 複製與分享按鈕皆呈灰色不可用狀態

### Requirement: 輸入法風視覺基調
PWA 介面 SHALL 在色彩、圓角、字級、陰影上對齊 iOS 鍵盤視覺慣例，以降低使用者對「Web demo」的心理落差。

#### Scenario: 色彩僅以 systemBlue 作單一強調
- **WHEN** 介面靜態顯示
- **THEN** 藍色（`#007AFF`）僅用於「確定」鍵與「複製」主 CTA，其他文字／按鈕／標題皆使用黑灰色階

#### Scenario: 按鍵採 iOS 風圓角
- **WHEN** 鍵盤區渲染
- **THEN** 所有行鍵與功能鍵圓角介於 4–8px 之間，不使用 >12px 的大圓角

#### Scenario: 主副字級明確主從
- **WHEN** 行鍵顯示雙層標籤
- **THEN** 主字（注音教學標籤，如 ㄎ／母音）字級為副字（假名行名，如 か行／あ行）的 ≥ 2.5 倍，副字 opacity ≤ 0.6，強化 ZhuKana 作為「注音優先、假名輔助」的教學定位

