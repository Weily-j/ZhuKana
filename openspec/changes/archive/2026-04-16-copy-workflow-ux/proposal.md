# Proposal: copy-workflow-ux

## Problem
使用者完成日文輸入後，「複製到其他 App」的工作流程摩擦力過高：複製按鈕視覺權重與分享按鈕相同、複製成功後無按鈕狀態回饋、Toast 沒有引導後續操作、header 沒有說明 ZhuKana 是「中間站」而非系統 IME。

## Core Insight
ZhuKana 的使用情境是：**在 App 內組好日文 → 複製 → 切換到 LINE / Instagram 貼上**。使用者不需要「在 App 裡編輯文字」，需要的是「看到結果 → 複製出去」這條路徑順暢無阻。現有設計沒有強化這條主要路徑。

## Solution
1. **文字輸入區副標**：header 區加一行副標「輸入完成後複製到其他 App」，一句話設定正確預期
2. **複製按鈕升級**：`copy-button` 改為寬版主要 CTA（比分享按鈕更大、更顯眼）
3. **複製狀態回饋**：複製成功後按鈕文字短暫變為「已複製 ✓」（1.5 秒後恢復）
4. **Toast 引導**：複製後的 Toast 加第二行「切換到目標 App，長按輸入框選「貼上」」
5. **user-select 修正**：`.text-display` 加 `user-select: text`，確保 iOS 長按可觸發原生選取

## Out of Scope
- 文字輸入區全面視覺重設計
- 可編輯文字（contenteditable）功能
- 分享功能本身的改動

## Success Criteria
- 使用者一眼能辨認「複製」是主要動作
- 複製後按鈕有「已複製」狀態 1.5 秒
- Toast 文字引導後續操作
- iOS Safari 長按 text-display 可觸發原生複製選單
