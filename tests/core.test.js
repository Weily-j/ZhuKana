import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  createInitialState,
  resolveFlickDirection,
  getKanaCell,
  applyKanaInput,
  commitBuffer,
  backspaceInput,
  getCandidatePage,
  selectCandidate,
  toggleKanaMode,
  cycleKanaVariant,
  cycleKanaEntry,
} from "../lib/core.js";

const phoneticMap = JSON.parse(
  await readFile(new URL("../data/phonetic-map.json", import.meta.url), "utf8"),
);

test("resolveFlickDirection uses 20px threshold and dominant axis", () => {
  assert.equal(resolveFlickDirection({ x: 0, y: 0 }, { x: 10, y: 8 }), "tap");
  assert.equal(resolveFlickDirection({ x: 0, y: 0 }, { x: 0, y: -32 }), "up");
  assert.equal(resolveFlickDirection({ x: 0, y: 0 }, { x: 40, y: 4 }), "right");
  assert.equal(resolveFlickDirection({ x: 0, y: 0 }, { x: -8, y: 36 }), "down");
  assert.equal(resolveFlickDirection({ x: 0, y: 0 }, { x: -40, y: 4 }), "left");
});

test("getKanaCell returns mapped kana, exceptions, and disabled gaps", () => {
  const kaTap = getKanaCell(phoneticMap, "ka", "tap", "hiragana");
  assert.equal(kaTap.kana, "か");
  assert.equal(kaTap.phonetic, "ㄎㄚ");

  const shi = getKanaCell(phoneticMap, "sa", "up", "hiragana");
  assert.equal(shi.kana, "し");
  assert.equal(shi.phonetic, "ㄒㄧ");
  assert.equal(shi.exception, true);

  const yaGap = getKanaCell(phoneticMap, "ya", "up", "hiragana");
  assert.equal(yaGap.kana, "");
  assert.equal(yaGap.disabled, true);

  const kaKatakana = getKanaCell(phoneticMap, "ka", "tap", "katakana");
  assert.equal(kaKatakana.kana, "カ");
});

test("composition flow prioritizes buffer before confirmed text", () => {
  let state = createInitialState();

  state = applyKanaInput(state, "す");
  state = applyKanaInput(state, "み");
  assert.deepEqual(state.buffer, ["す", "み"]);
  assert.equal(state.confirmed, "");

  state = commitBuffer(state);
  assert.equal(state.confirmed, "すみ");
  assert.deepEqual(state.buffer, []);

  state = applyKanaInput(state, "せ");
  state = backspaceInput(state);
  assert.deepEqual(state.buffer, []);
  assert.equal(state.confirmed, "すみ");

  state = backspaceInput(state);
  assert.equal(state.confirmed, "す");
});

test("candidate pagination and selection follow kana prefix matching", () => {
  const candidates = [
    { text: "すし", reading: "すし" },
    { text: "すみません", reading: "すみません" },
    { text: "すこし", reading: "すこし" },
    { text: "えき", reading: "えき" },
  ];

  const pageOne = getCandidatePage("す", candidates, 0, 2);
  assert.deepEqual(
    pageOne.items.map((item) => item.text),
    ["すし", "すみません"],
  );
  assert.equal(pageOne.hasMore, true);

  const pageTwo = getCandidatePage("す", candidates, 1, 2);
  assert.deepEqual(
    pageTwo.items.map((item) => item.text),
    ["すこし"],
  );
  assert.equal(pageTwo.hasMore, false);

  const selected = selectCandidate(
    {
      ...createInitialState(),
      buffer: ["す", "み"],
      mode: "hiragana",
    },
    { text: "すみません", reading: "すみません" },
  );

  assert.equal(selected.confirmed, "すみません");
  assert.deepEqual(selected.buffer, []);
});

test("wa row flick-right inputs ん/ン", () => {
  const nHira = getKanaCell(phoneticMap, "wa", "right", "hiragana");
  assert.equal(nHira.kana, "ん");
  assert.equal(nHira.phonetic, "ㄣ");

  const nKata = getKanaCell(phoneticMap, "wa", "right", "katakana");
  assert.equal(nKata.kana, "ン");

  const woHira = getKanaCell(phoneticMap, "wa", "left", "hiragana");
  assert.equal(woHira.kana, "を");

  const waUp = getKanaCell(phoneticMap, "wa", "up", "hiragana");
  assert.equal(waUp.disabled, true);
});

test("toggleKanaMode and cycleKanaVariant support both scripts", () => {
  assert.equal(toggleKanaMode("hiragana"), "katakana");
  assert.equal(toggleKanaMode("katakana"), "hiragana");

  assert.equal(cycleKanaVariant("か"), "が");
  assert.equal(cycleKanaVariant("が"), "ぁ");

  assert.equal(cycleKanaVariant("は"), "ば");
  assert.equal(cycleKanaVariant("ば"), "ぱ");
  assert.equal(cycleKanaVariant("ぱ"), "ぁ");

  assert.equal(cycleKanaVariant("つ"), "づ");
  assert.equal(cycleKanaVariant("づ"), "っ");
  assert.equal(cycleKanaVariant("カ"), "ガ");

  const wrapped = cycleKanaEntry("ぁ", "か");
  assert.equal(wrapped.kana, "か");
  assert.equal(wrapped.origin, null);
});
