## MODIFIED Requirements

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

## ADDED Requirements

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
