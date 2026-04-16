const HIRA_TO_KATA_OFFSET = 0x60;
const DIRECTION_PRIORITY = ["tap", "up", "right", "down", "left"];

const SMALL_VOWELS = ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ"];
const SMALL_Y = {
  tap: "ゃ",
  right: "ゅ",
  left: "ょ",
};

const ROW_VARIANTS = [
  {
    base: ["あ", "い", "う", "え", "お"],
    small: SMALL_VOWELS,
  },
  {
    base: ["か", "き", "く", "け", "こ"],
    voiced: ["が", "ぎ", "ぐ", "げ", "ご"],
    small: SMALL_VOWELS,
  },
  {
    base: ["さ", "し", "す", "せ", "そ"],
    voiced: ["ざ", "じ", "ず", "ぜ", "ぞ"],
    small: SMALL_VOWELS,
  },
  {
    base: ["た", "ち", "つ", "て", "と"],
    voiced: ["だ", "ぢ", "づ", "で", "ど"],
    small: ["ぁ", "ぃ", "っ", "ぇ", "ぉ"],
  },
  {
    base: ["な", "に", "ぬ", "ね", "の"],
    small: SMALL_VOWELS,
  },
  {
    base: ["は", "ひ", "ふ", "へ", "ほ"],
    voiced: ["ば", "び", "ぶ", "べ", "ぼ"],
    semiVoiced: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
    small: SMALL_VOWELS,
  },
  {
    base: ["ま", "み", "む", "め", "も"],
    small: SMALL_VOWELS,
  },
  {
    base: ["や", "", "ゆ", "", "よ"],
    small: ["ゃ", "", "ゅ", "", "ょ"],
  },
  {
    base: ["ら", "り", "る", "れ", "ろ"],
    small: SMALL_VOWELS,
  },
  {
    base: ["わ", "", "", "", "を"],
    small: ["ゎ", "", "", "", "ぉ"],
  },
];

const { baseGroups, memberGroups } = buildVariantGroups();

export function createInitialState() {
  return {
    confirmed: "",
    buffer: [],
    variantOrigins: [],
    mode: "hiragana",
    candidatePage: 0,
    punctuationIndex: 0,
  };
}

export function resolveFlickDirection(start, end, threshold = 20) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
    return "tap";
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }

  return dy > 0 ? "down" : "up";
}

export function getKanaCell(phoneticMap, rowId, direction, mode = "hiragana") {
  const row = findRowById(phoneticMap.baseRows, rowId);
  if (!row) {
    throw new Error(`Unknown row: ${rowId}`);
  }

  const cell = row.cells[direction];
  if (!cell) {
    throw new Error(`Unknown direction: ${direction}`);
  }

  return {
    ...cell,
    kana: cell.disabled ? "" : mode === "katakana" ? cell.katakana : cell.hiragana,
  };
}

export function applyKanaInput(state, kana) {
  if (!kana) {
    return state;
  }

  return {
    ...state,
    buffer: [...state.buffer, kana],
    variantOrigins: [...(state.variantOrigins ?? []), null],
    candidatePage: 0,
  };
}

export function commitBuffer(state) {
  if (state.buffer.length === 0) {
    return state;
  }

  return {
    ...state,
    confirmed: `${state.confirmed}${state.buffer.join("")}`,
    buffer: [],
    variantOrigins: [],
    candidatePage: 0,
  };
}

export function backspaceInput(state) {
  if (state.buffer.length > 0) {
    return {
      ...state,
      buffer: state.buffer.slice(0, -1),
      variantOrigins: (state.variantOrigins ?? []).slice(0, -1),
      candidatePage: 0,
    };
  }

  if (!state.confirmed) {
    return state;
  }

  const chars = Array.from(state.confirmed);
  chars.pop();

  return {
    ...state,
    confirmed: chars.join(""),
  };
}

export function getCandidatePage(bufferText, candidates, page = 0, pageSize = 6, mode = "hiragana") {
  if (!bufferText) {
    return { items: [], hasMore: false, page, pageSize, total: 0 };
  }

  const query = toHiragana(bufferText);
  const matches = candidates
    .filter((item) => toHiragana(item.reading).startsWith(query))
    .map((item) => ({
      ...item,
      displayText: mode === "katakana" ? toKatakana(item.text) : toHiragana(item.text),
    }));

  const startIndex = page * pageSize;

  return {
    items: matches.slice(startIndex, startIndex + pageSize),
    hasMore: startIndex + pageSize < matches.length,
    page,
    pageSize,
    total: matches.length,
  };
}

export function selectCandidate(state, candidate) {
  if (!candidate) {
    return state;
  }

  const committedText =
    state.mode === "katakana" ? toKatakana(candidate.text) : toHiragana(candidate.text);

  return {
    ...state,
    confirmed: `${state.confirmed}${committedText}`,
    buffer: [],
    variantOrigins: [],
    candidatePage: 0,
  };
}

export function toggleKanaMode(mode) {
  return mode === "hiragana" ? "katakana" : "hiragana";
}

/**
 * @deprecated 此函式在輸入小假名（ぁぃぅぇぉっゃゅょ）時行為未定義，
 * 因為小假名同時屬於多個循環群組，無法在沒有 origin 的情況下確定歸屬。
 * 請改用 cycleKanaEntry(char, origin) 並傳入 origin 字元以取得正確結果。
 */
export function cycleKanaVariant(char) {
  return cycleKanaEntry(char).kana;
}

export function cycleKanaEntry(char, origin = null) {
  const group = origin
    ? baseGroups.get(origin)
    : memberGroups.get(char)?.length === 1
      ? memberGroups.get(char)[0]
      : null;

  if (!group) {
    return {
      kana: char,
      origin: null,
    };
  }

  const currentIndex = group.indexOf(char);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextKana = group[(safeIndex + 1) % group.length];
  const nextOrigin = nextKana === group[0] ? null : group[0];

  return {
    kana: nextKana,
    origin: nextOrigin,
  };
}

export function getDisplayText(state) {
  return `${state.confirmed}${state.buffer.join("")}`;
}

export function appendConfirmedText(state, text) {
  if (!text) {
    return state;
  }

  return {
    ...state,
    confirmed: `${state.confirmed}${text}`,
  };
}

export function toKatakana(text) {
  return Array.from(text, (char) => {
    const codePoint = char.codePointAt(0);
    if (codePoint >= 0x3041 && codePoint <= 0x3096) {
      return String.fromCodePoint(codePoint + HIRA_TO_KATA_OFFSET);
    }
    return char;
  }).join("");
}

export function toHiragana(text) {
  return Array.from(text, (char) => {
    const codePoint = char.codePointAt(0);
    if (codePoint >= 0x30a1 && codePoint <= 0x30f6) {
      return String.fromCodePoint(codePoint - HIRA_TO_KATA_OFFSET);
    }
    return char;
  }).join("");
}

function buildVariantGroups() {
  const baseGroups = new Map();
  const memberGroups = new Map();

  for (const row of ROW_VARIANTS) {
    row.base.forEach((baseChar, index) => {
      if (!baseChar) {
        return;
      }

      const group = [baseChar];
      const voicedChar = row.voiced?.[index];
      const semiVoicedChar = row.semiVoiced?.[index];
      const smallChar = row.small?.[index];

      if (voicedChar) {
        group.push(voicedChar);
      }
      if (semiVoicedChar) {
        group.push(semiVoicedChar);
      }
      if (smallChar && !group.includes(smallChar)) {
        group.push(smallChar);
      }

      registerGroup(baseGroups, memberGroups, group);
      registerGroup(
        baseGroups,
        memberGroups,
        group.map((char) => toKatakana(char)),
      );
    });
  }

  return { baseGroups, memberGroups };
}

function registerGroup(baseGroups, memberGroups, group) {
  if (group.length <= 1) {
    return;
  }

  baseGroups.set(group[0], group);

  group.forEach((char) => {
    const existingGroups = memberGroups.get(char) ?? [];
    existingGroups.push(group);
    memberGroups.set(char, existingGroups);
  });
}

function findRowById(rows, rowId) {
  return rows.find((row) => row.id === rowId) ?? null;
}
