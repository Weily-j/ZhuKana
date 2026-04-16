# kana-composition Specification

## Purpose
TBD - created by archiving change zhuyin-jp-keyboard-pwa. Update Purpose after archive.
## Requirements
### Requirement: 假名組字緩衝區
系統 SHALL 維護一個前端組字緩衝區，累積使用者輸入的假名，在確定送出前以藍色底線標示為「未確定」狀態。

#### Scenario: 輸入假名進入緩衝區
- **WHEN** 使用者點按或撥動選出假名（如 す）
- **THEN** す 出現在文字輸入區，帶藍色底線，旁邊顯示「組字中」小標籤

#### Scenario: 連續輸入假名
- **WHEN** 使用者連續輸入 す、み、ま、せ、ん
- **THEN** 文字區顯示 すみません（帶底線），為未確定狀態

### Requirement: 候補欄即時顯示
輸入假名時，候補欄 SHALL 即時顯示符合的常用詞候補，第一個候補預設高亮。

#### Scenario: 輸入す顯示候補
- **WHEN** 使用者輸入 す
- **THEN** 候補欄顯示包含 す 開頭的常用詞，第一個候補以藍色背景高亮

#### Scenario: 點選候補自動確定
- **WHEN** 使用者點選候補欄中的詞語
- **THEN** 該詞語寫入文字輸入區，底線消失，組字緩衝區清空

#### Scenario: 候補欄可橫向滾動
- **WHEN** 候補詞語超過候補欄寬度
- **THEN** 使用者可左右滑動候補欄查看更多候補

#### Scenario: 首次使用顯示引導文字
- **WHEN** 使用者第一次看到候補欄出現候補
- **THEN** 候補欄右側顯示「點選完成輸入」提示文字，使用一次後不再顯示

### Requirement: 確定鍵送出
按下 `確定` 鍵時，組字緩衝區內容 SHALL 寫入文字輸入區，底線消失。

#### Scenario: 按確定送出組字
- **WHEN** 使用者在有未確定內容時按下 確定 鍵
- **THEN** 緩衝區假名寫入文字輸入區，底線消失，緩衝區清空

### Requirement: 更多候補
按下 `更多 ›` 鍵時，候補欄 SHALL 切換至下一組候補詞語。

#### Scenario: 更多候補顯示更多選項
- **WHEN** 使用者按下 更多 › 鍵
- **THEN** 候補欄更新顯示下一組候補，或展開更多候補列表

### Requirement: 候補欄高度
候補欄高度 SHALL 固定為 44px，符合 iOS HIG 最小觸控目標規範。

#### Scenario: 候補欄高度正確
- **WHEN** 候補欄顯示候補詞語
- **THEN** 候補欄高度為 44px，每個候補項目可輕鬆點按

