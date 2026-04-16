# flick-input Specification

## Purpose
TBD - created by archiving change zhuyin-jp-keyboard-pwa. Update Purpose after archive.
## Requirements
### Requirement: 標準フリック撥動方向
撥動方向 SHALL 遵循日文標準：點按＝あ段、上↑＝い段、右→＝う段、下↓＝え段、左←＝お段。

#### Scenario: 點按 ㄎ 鍵輸入 か
- **WHEN** 使用者點按 ㄎ(か行) 鍵
- **THEN** 組字緩衝區新增 か

#### Scenario: 撥上 ㄎ 鍵輸入 き
- **WHEN** 使用者在 ㄎ(か行) 鍵向上撥動
- **THEN** 組字緩衝區新增 き

#### Scenario: 撥右 ㄎ 鍵輸入 く
- **WHEN** 使用者在 ㄎ(か行) 鍵向右撥動
- **THEN** 組字緩衝區新增 く

#### Scenario: 撥下 ㄎ 鍵輸入 け
- **WHEN** 使用者在 ㄎ(か行) 鍵向下撥動
- **THEN** 組字緩衝區新增 け

#### Scenario: 撥左 ㄎ 鍵輸入 こ
- **WHEN** 使用者在 ㄎ(か行) 鍵向左撥動
- **THEN** 組字緩衝區新增 こ

### Requirement: 撥動時顯示注音提示
撥動展開選字框時，每個假名格子 SHALL 同時顯示對應的注音組合。

#### Scenario: 撥動 ㄎ 鍵顯示注音提示
- **WHEN** 使用者開始撥動 ㄎ(か行) 鍵
- **THEN** 展開的選字框顯示：か(ㄎㄚ)、き(ㄎㄧ)、く(ㄎㄨ)、け(ㄎㄝ)、こ(ㄎㄛ)

### Requirement: 例外字橘色高亮
撥動展開時，發音不規則的例外字 SHALL 以橘色背景高亮，並顯示正確注音組合。

#### Scenario: 撥動 ㄙ 鍵顯示 し 例外高亮
- **WHEN** 使用者撥動 ㄙ(さ行) 鍵並移至 し 方向（↑）
- **THEN** し 格子顯示橘色背景，注音顯示 ㄒㄧ（非 ㄙㄧ），並標示「例外」

#### Scenario: 撥動 ㄊ 鍵顯示 ち・つ 例外高亮
- **WHEN** 使用者撥動 ㄊ(た行) 鍵
- **THEN** ち(↑) 顯示 ㄑㄧ 橘色高亮，つ(→) 顯示 ㄘㄨ 橘色高亮

#### Scenario: 撥動 ㄏ 鍵顯示 ふ 例外高亮
- **WHEN** 使用者撥動 ㄏ(は行) 鍵並移至 ふ 方向（→）
- **THEN** ふ 格子顯示橘色背景，注音顯示 ㄈㄨ，並標示「例外」

### Requirement: や行・わ行空格處理
や行（い・え段）與わ行（い・う・え段）無對應假名，撥動展開時 SHALL 顯示空白或不可選取狀態。

#### Scenario: や行空格不可選取
- **WHEN** 使用者撥動 ㄧ(や行) 鍵至 ↑（い段）方向
- **THEN** 該方向顯示為空白，不觸發任何輸入

### Requirement: 按鍵長按放大預覽
長按按鍵時 SHALL 顯示放大的 callout bubble，呈現當前選中的假名。

#### Scenario: 長按顯示 callout
- **WHEN** 使用者長按任一假名鍵超過 200ms
- **THEN** 按鍵上方顯示放大的假名預覽泡泡

### Requirement: 震動回饋
按鍵點按時 SHALL 觸發短震動（如瀏覽器支援 Vibration API）。

#### Scenario: 點按有震動回饋（支援的裝置）
- **WHEN** 使用者在支援 Vibration API 的 Android 裝置上點按按鍵
- **THEN** 裝置產生 10ms 短震動

#### Scenario: 不支援時優雅降級
- **WHEN** 使用者在 iOS Safari 等不支援 Vibration API 的瀏覽器操作
- **THEN** 無震動但功能正常，不產生錯誤

