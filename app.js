import {
  appendConfirmedText,
  applyKanaInput,
  backspaceInput,
  commitBuffer,
  createInitialState,
  cycleKanaVariant,
  cycleKanaEntry,
  getCandidatePage,
  getDisplayText,
  getKanaCell,
  resolveFlickDirection,
  selectCandidate,
  toKatakana,
  toggleKanaMode,
} from "./lib/core.js";

const CANDIDATE_PAGE_SIZE = 100; // show all matching candidates; rail is horizontally scrollable
const CANDIDATE_HINT_KEY = "zhuyin-jp-keyboard-pwa:candidate-hint-used";

const KEY_LAYOUT = [
  { type: "row", rowId: "a" },
  { type: "row", rowId: "ka" },
  { type: "row", rowId: "sa" },
  { type: "action", actionId: "backspace", label: "⌫", subLabel: "退格" },
  { type: "row", rowId: "ta" },
  { type: "row", rowId: "na" },
  { type: "row", rowId: "ha" },
  { type: "action", actionId: "confirm", label: "確定", subLabel: "送出" },
  { type: "row", rowId: "ma" },
  { type: "row", rowId: "ya" },
  { type: "row", rowId: "ra" },
  { type: "action", actionId: "newline", label: "↵", subLabel: "換行" },
  { type: "action", actionId: "mode", label: "平", subLabel: "模式" },
  { type: "row", rowId: "wa" },
  { type: "action", actionId: "voicing", label: "変音", subLabel: "゛゜小" },
  { type: "action", actionId: "space", label: "空白", subLabel: "\u3000" },
];

const elements = {
  keyboardGrid: document.querySelector("#keyboard-grid"),
  candidateRail: document.querySelector("#candidate-rail"),
  candidateHint: document.querySelector("#candidate-hint"),
  textDisplay: document.querySelector("#text-display"),
  confirmedText: document.querySelector("#confirmed-text"),
  bufferText: document.querySelector("#buffer-text"),
  emptyPlaceholder: document.querySelector("#empty-placeholder"),
  compositionBadge: document.querySelector("#composition-badge"),
  feedbackMessage: document.querySelector("#feedback-message"),
  modeStatus: document.querySelector("#mode-status"),
  flickCallout: document.querySelector("#flick-callout"),
  toast: document.querySelector("#toast"),
  copyButton: document.querySelector("#copy-button"),
  shareButton: document.querySelector("#share-button"),
  clearButton: document.querySelector("#clear-button"),
};

let appState = createInitialState();
let phoneticMap = null;
let candidates = [];
let currentCandidatePage = { items: [], hasMore: false, total: 0, pageSize: CANDIDATE_PAGE_SIZE };
let toastTimer = null;
let feedbackTimer = null;
let activeTouch = null;
let clearHoldTimer = null;
let clearHoldInterval = null;

const actionButtons = new Map();
const rowButtons = new Map();

init().catch((error) => {
  console.error(error);
  showToast("載入失敗，請重新整理再試一次");
});

async function init() {
  [phoneticMap, candidates] = await Promise.all([
    fetchJson("./data/phonetic-map.json"),
    fetchJson("./data/candidates.json"),
  ]);

  buildKeyboard();
  bindOutputActions();
  hydrateCandidateHintState();
  render();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

function buildKeyboard() {
  const fragment = document.createDocumentFragment();

  KEY_LAYOUT.forEach((definition) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "keyboard-key";

    if (definition.type === "row") {
      const row = phoneticMap.baseRows.find((item) => item.id === definition.rowId);
      button.classList.add("keyboard-key--row");
      if (row.exceptionRow) {
        button.classList.add("keyboard-key--exception");
      }

      button.dataset.rowId = definition.rowId;
      button.innerHTML = `
        <span class="key-main">${row.labelBopomofo}</span>
        <span class="key-sub">${row.labelKana}</span>
      `;
      button.setAttribute("aria-label", `${row.labelBopomofo} ${row.labelKana}`);

      bindRowButton(button, definition.rowId);
      rowButtons.set(definition.rowId, button);
    } else {
      button.classList.add("keyboard-key--action");
      button.dataset.actionId = definition.actionId;
      button.innerHTML = `
        <span class="key-main">${definition.label}</span>
        <span class="key-sub">${definition.subLabel}</span>
      `;
      button.setAttribute("aria-label", `${definition.label}${definition.subLabel ? ` ${definition.subLabel}` : ""}`);
      button.addEventListener("click", () => handleAction(definition.actionId));
      actionButtons.set(definition.actionId, button);
    }

    fragment.appendChild(button);
  });

  elements.keyboardGrid.replaceChildren(fragment);
}

function bindRowButton(button, rowId) {
  button.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length > 1) {
        return;
      }
      event.preventDefault();
      button.dataset.touchAt = String(Date.now());
      startTouchInteraction(rowId, button, event.changedTouches[0]);
    },
    { passive: false },
  );

  button.addEventListener(
    "touchmove",
    (event) => {
      if (!activeTouch) {
        return;
      }
      const touch = [...event.changedTouches].find((item) => item.identifier === activeTouch.identifier);
      if (!touch) {
        return;
      }
      event.preventDefault();
      updateTouchInteraction(touch);
    },
    { passive: false },
  );

  button.addEventListener(
    "touchend",
    (event) => {
      if (!activeTouch) {
        return;
      }
      const touch = [...event.changedTouches].find((item) => item.identifier === activeTouch.identifier);
      if (!touch) {
        return;
      }
      event.preventDefault();
      finishTouchInteraction();
    },
    { passive: false },
  );

  button.addEventListener(
    "touchcancel",
    (event) => {
      if (!activeTouch) {
        return;
      }
      const touch = [...event.changedTouches].find((item) => item.identifier === activeTouch.identifier);
      if (!touch) {
        return;
      }
      event.preventDefault();
      resetTouchInteraction();
    },
    { passive: false },
  );

  button.addEventListener("click", () => {
    const lastTouchAt = Number(button.dataset.touchAt ?? 0);
    if (Date.now() - lastTouchAt < 450) {
      return;
    }
    commitRowInput(rowId, "tap");
  });
}

function startTouchInteraction(rowId, button, touch) {
  resetTouchInteraction();

  button.classList.add("is-pressed");
  activeTouch = {
    rowId,
    button,
    identifier: touch.identifier,
    start: { x: touch.clientX, y: touch.clientY },
    direction: "tap",
    calloutVisible: false,
    longPressTimer: window.setTimeout(() => {
      if (!activeTouch) {
        return;
      }
      activeTouch.calloutVisible = true;
      renderFlickCallout(rowId, activeTouch.direction, button);
    }, 200),
  };
}

function updateTouchInteraction(touch) {
  if (!activeTouch) {
    return;
  }

  const nextDirection = resolveFlickDirection(activeTouch.start, {
    x: touch.clientX,
    y: touch.clientY,
  });

  if (nextDirection !== activeTouch.direction) {
    activeTouch.direction = nextDirection;
    activeTouch.calloutVisible = true;
    renderFlickCallout(activeTouch.rowId, activeTouch.direction, activeTouch.button);
  } else if (activeTouch.calloutVisible) {
    renderFlickCallout(activeTouch.rowId, activeTouch.direction, activeTouch.button);
  }
}

function finishTouchInteraction() {
  if (!activeTouch) {
    return;
  }

  const { rowId, direction } = activeTouch;
  resetTouchInteraction();
  commitRowInput(rowId, direction);
}

function resetTouchInteraction() {
  if (!activeTouch) {
    hideFlickCallout();
    return;
  }

  window.clearTimeout(activeTouch.longPressTimer);
  activeTouch.button.classList.remove("is-pressed");
  activeTouch = null;
  hideFlickCallout();
}

function renderFlickCallout(rowId, activeDirection, button) {
  const directions = ["tap", "up", "right", "down", "left"];
  const cells = directions.map((direction) => {
    const cell = getKanaCell(phoneticMap, rowId, direction, appState.mode);
    const badge = cell.exception
      ? '<span class="flick-badge">例外</span>'
      : cell.merge
        ? '<span class="flick-badge">合流</span>'
        : cell.special
          ? '<span class="flick-badge">特殊</span>'
          : "";

    return `
      <div
        class="flick-cell${cell.exception ? " is-exception" : ""}${cell.disabled ? " is-disabled" : ""}${direction === activeDirection ? " is-active" : ""}"
        data-direction="${direction}"
      >
        <span class="flick-kana">${cell.kana || "　"}</span>
        <span class="flick-phonetic">${cell.phonetic || "　"}</span>
        ${badge}
      </div>
    `;
  });

  const rect = button.getBoundingClientRect();
  const width = 248;
  const height = 228;
  const left = clamp(rect.left + rect.width / 2 - width / 2, 10, window.innerWidth - width - 10);
  const top = rect.top > height + 18 ? rect.top - height - 8 : rect.bottom + 8;

  elements.flickCallout.innerHTML = cells.join("");
  elements.flickCallout.style.left = `${left}px`;
  elements.flickCallout.style.top = `${top}px`;
  elements.flickCallout.hidden = false;
}

function hideFlickCallout() {
  elements.flickCallout.hidden = true;
  elements.flickCallout.innerHTML = "";
}

function commitRowInput(rowId, direction) {
  const cell = getKanaCell(phoneticMap, rowId, direction, appState.mode);
  if (cell.disabled || !cell.kana) {
    return;
  }

  appState = applyKanaInput(appState, cell.kana);
  vibrateShort();
  render();
}

function bindOutputActions() {
  elements.copyButton.addEventListener("click", () => {
    copyText().catch(() => showToast("複製失敗，請手動選取複製"));
  });

  elements.shareButton.addEventListener("click", () => {
    shareText().catch((err) => {
      if (err?.name !== "AbortError") {
        showToast("分享失敗，請重試");
      }
    });
  });

  const startHold = (event) => {
    event.preventDefault();
    if (!getDisplayText(appState)) {
      return;
    }

    clearHold();
    const startedAt = Date.now();

    clearHoldInterval = window.setInterval(() => {
      const progress = Math.min(1, (Date.now() - startedAt) / 500);
      elements.clearButton.style.setProperty("--hold-progress", `${progress * 100}%`);
      if (progress >= 1) {
        clearAllText();
        clearHold();
      }
    }, 16);

    clearHoldTimer = window.setTimeout(() => {
      clearAllText();
      clearHold();
    }, 500);
  };

  const cancelHold = () => {
    clearHold();
  };

  elements.clearButton.addEventListener("pointerdown", startHold);
  elements.clearButton.addEventListener("pointerup", cancelHold);
  elements.clearButton.addEventListener("pointerleave", cancelHold);
  elements.clearButton.addEventListener("pointercancel", cancelHold);
}

function clearHold() {
  window.clearTimeout(clearHoldTimer);
  window.clearInterval(clearHoldInterval);
  clearHoldTimer = null;
  clearHoldInterval = null;
  elements.clearButton.style.setProperty("--hold-progress", "0%");
}

function handleAction(actionId) {
  switch (actionId) {
    case "mode":
      appState = {
        ...appState,
        mode: toggleKanaMode(appState.mode),
      };
      render();
      return;
    case "backspace":
      appState = backspaceInput(appState);
      render();
      return;
    case "newline":
      appState = appendConfirmedText(commitBuffer(appState), "\n");
      render();
      return;
    case "space":
      appState = appendConfirmedText(commitBuffer(appState), "　");
      render();
      return;
    case "voicing":
      mutateLastKana();
      return;
    case "confirm":
      appState = commitBuffer(appState);
      render();
      return;
    default:
      return;
  }
}

function mutateLastKana() {
  if (appState.buffer.length === 0) {
    showToast("先輸入一個假名，再使用變音");
    return;
  }

  const nextBuffer = [...appState.buffer];
  const nextOrigins = [...(appState.variantOrigins ?? [])];
  const lastKana = nextBuffer.at(-1);
  const { kana, origin } = cycleKanaEntry(lastKana, nextOrigins[nextOrigins.length - 1]);
  nextBuffer[nextBuffer.length - 1] = kana;
  nextOrigins[nextOrigins.length - 1] = origin;
  appState = {
    ...appState,
    buffer: nextBuffer,
    variantOrigins: nextOrigins,
    candidatePage: 0,
  };
  render();
}


function clearAllText() {
  const currentMode = appState.mode;
  appState = { ...createInitialState(), mode: currentMode };
  render();
  showToast("已清除全部文字");
}

async function copyText() {
  const text = getDisplayText(appState);
  if (!text) {
    return;
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const fallback = document.createElement("textarea");
    fallback.value = text;
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.append(fallback);
    fallback.select();
    document.execCommand("copy");
    fallback.remove();
  }

  setFeedback("已複製✓");
  showToast("已複製到剪貼簿\n切換到目標 App，長按輸入框選「貼上」");
  const copyLabel = elements.copyButton.querySelector("span");
  if (copyLabel) {
    copyLabel.textContent = "已複製 ✓";
    window.setTimeout(() => {
      copyLabel.textContent = "複製";
    }, 1500);
  }
}

async function shareText() {
  const text = getDisplayText(appState);
  if (!text) {
    return;
  }

  if (navigator.share) {
    await navigator.share({
      title: "注音日文鍵盤輸出",
      text,
    });
    setFeedback("已呼叫系統分享");
    return;
  }

  await copyText();
  setFeedback("已複製，可直接貼上分享");
  showToast("不支援分享，已自動複製");
}

function render() {
  const bufferText = appState.buffer.join("");
  currentCandidatePage = getCandidatePage(
    bufferText,
    candidates,
    appState.candidatePage,
    CANDIDATE_PAGE_SIZE,
    appState.mode,
  );

  if (bufferText && currentCandidatePage.items.length === 0 && appState.candidatePage > 0) {
    appState = {
      ...appState,
      candidatePage: 0,
    };
    currentCandidatePage = getCandidatePage(bufferText, candidates, 0, CANDIDATE_PAGE_SIZE, appState.mode);
  }

  renderText();
  renderCandidates();
  renderButtons();
}

function renderText() {
  const displayText = getDisplayText(appState);
  const bufferText = appState.buffer.join("");

  elements.confirmedText.textContent = appState.confirmed;
  elements.bufferText.textContent = bufferText;
  elements.bufferText.className = bufferText ? "buffer-text" : "";
  elements.emptyPlaceholder.hidden = Boolean(displayText);
  elements.compositionBadge.hidden = appState.buffer.length === 0;
  elements.modeStatus.textContent = appState.mode === "katakana" ? "片假名" : "平假名";
}

function renderCandidates() {
  const fragment = document.createDocumentFragment();
  const bufferText = appState.buffer.join("");

  if (!bufferText || currentCandidatePage.items.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "candidate-placeholder";
    emptyState.textContent = bufferText ? "沒有更多符合的候補" : "輸入後會即時顯示候補";
    fragment.append(emptyState);
  } else {
    currentCandidatePage.items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `candidate-chip${index === 0 ? " is-active" : ""}`;
      button.textContent = item.displayText;
      button.setAttribute("role", "option");
      button.addEventListener("click", () => {
        markCandidateHintUsed();
        appState = selectCandidate(appState, item);
        render();
      });
      fragment.append(button);
    });
  }

  elements.candidateRail.replaceChildren(fragment);
  elements.candidateRail.scrollLeft = 0;
  elements.candidateHint.hidden = currentCandidatePage.items.length === 0 || hasUsedCandidateHint();
}

function renderButtons() {
  const text = getDisplayText(appState);
  const hasBuffer = appState.buffer.length > 0;
  elements.copyButton.disabled = !text;
  elements.shareButton.disabled = !text;
  elements.clearButton.disabled = !text;

  setActionDisabled("backspace", !text);
  setActionDisabled("confirm", !hasBuffer);
  setActionDisabled("voicing", !hasBuffer);

  const modeButton = actionButtons.get("mode");
  if (modeButton) {
    const isKatakana = appState.mode === "katakana";
    modeButton.classList.toggle("keyboard-key--mode-active", isKatakana);
    modeButton.querySelector(".key-main").textContent = isKatakana ? "片" : "平";
    modeButton.querySelector(".key-sub").textContent = "模式";
  }

}

function setActionDisabled(actionId, disabled) {
  const button = actionButtons.get(actionId);
  if (!button) {
    return;
  }
  button.disabled = disabled;
}

function setFeedback(message) {
  elements.feedbackMessage.textContent = message;
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    elements.feedbackMessage.textContent = "";
  }, 1800);
}

function showToast(message) {
  elements.toast.hidden = false;
  elements.toast.textContent = message;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 1800);
}

function vibrateShort() {
  try {
    navigator.vibrate?.(10);
  } catch (error) {
    console.warn("Vibration API unavailable:", error);
  }
}

function markCandidateHintUsed() {
  try {
    localStorage.setItem(CANDIDATE_HINT_KEY, "1");
  } catch (error) {
    console.warn("Unable to persist candidate hint state:", error);
  }
}

function hasUsedCandidateHint() {
  try {
    return localStorage.getItem(CANDIDATE_HINT_KEY) === "1";
  } catch (error) {
    console.warn("Unable to read candidate hint state:", error);
    return false;
  }
}

function hydrateCandidateHintState() {
  if (!hasUsedCandidateHint()) {
    return;
  }
  elements.candidateHint.hidden = true;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
