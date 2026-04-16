import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const phoneticMap = JSON.parse(
  await readFile(new URL("../data/phonetic-map.json", import.meta.url), "utf8"),
);
const candidates = JSON.parse(
  await readFile(new URL("../data/candidates.json", import.meta.url), "utf8"),
);

test("phonetic-map includes all row groups and merge metadata", () => {
  assert.equal(phoneticMap.baseRows.length, 10);
  assert.equal(phoneticMap.voicedRows.length, 4);
  assert.equal(phoneticMap.semiVoicedRows.length, 1);

  const mergeJi = phoneticMap.mergeGroups.find((group) =>
    group.members.includes("じ") && group.members.includes("ぢ"),
  );
  assert.ok(mergeJi);

  const mergeZu = phoneticMap.mergeGroups.find((group) =>
    group.members.includes("ず") && group.members.includes("づ"),
  );
  assert.ok(mergeZu);

  const specialWo = phoneticMap.specials["を"];
  assert.equal(specialWo.phonetic, "ㄛ");
  assert.equal(specialWo.special, true);
});

test("candidate library stays within the planned travel vocabulary size", () => {
  assert.ok(candidates.length >= 500);
  assert.ok(candidates.length <= 1000);

  const readings = new Set(candidates.map((item) => item.reading));
  assert.ok(readings.has("すみません"));
  assert.ok(readings.has("ありがとうございます"));
  assert.ok(readings.has("えき"));
  assert.ok(readings.has("とうきょう"));
  assert.ok(readings.has("といれ"));
});
