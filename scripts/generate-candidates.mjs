import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");

const items = new Map();

function add(text, category = "general") {
  const reading = text.trim();
  if (!reading || items.has(reading)) {
    return;
  }

  items.set(reading, {
    text: reading,
    reading,
    category,
  });
}

[
  "すみません",
  "ありがとうございます",
  "こんにちは",
  "こんばんは",
  "おはようございます",
  "はじめまして",
  "よろしくおねがいします",
  "ごめんなさい",
  "だいじょうぶです",
  "けっこうです",
  "おねがいします",
  "わかりました",
  "わかりません",
  "もういちどおねがいします",
  "ゆっくりおねがいします",
  "にほんごはすこしだけです",
  "えいごはできますか",
  "しゃしんをとってもいいですか",
  "ちずをみせてください",
  "たすけてください",
  "きっぷをください",
  "これをください",
  "おみずをください",
  "おちゃをください",
  "おかいけいおねがいします",
  "おすすめはなんですか",
  "どこですか",
  "いくらですか",
  "つぎでおります",
  "ここでおります",
].forEach((text) => add(text, "essential"));

const cities = [
  "とうきょう",
  "おおさか",
  "きょうと",
  "なら",
  "こうべ",
  "よこはま",
  "なごや",
  "さっぽろ",
  "ふくおか",
  "ひろしま",
  "せんだい",
  "かなざわ",
  "おきなわ",
  "はこだて",
  "にっこう",
];

const locations = [
  "えき",
  "くうこう",
  "ばすてい",
  "ちかてつ",
  "ほてる",
  "りょかん",
  "といれ",
  "こんびに",
  "すーぱー",
  "やっきょく",
  "びょういん",
  "こうばん",
  "ぎんこう",
  "ゆうびんきょく",
  "かふぇ",
  "きっさてん",
  "れすとらん",
  "いざかや",
  "すしや",
  "らーめんや",
  "うどんや",
  "ぎゅうどんや",
  "やきにくや",
  "でぱーと",
  "どらっぐすとあ",
  "どんきほーて",
  "でんきや",
  "おてら",
  "じんじゃ",
  "びじゅつかん",
  "はくぶつかん",
  "こうえん",
  "しろ",
  "たわー",
  "てんぼうだい",
  "かいがん",
  "おんせん",
  "ゆうえんち",
  "どうぶつえん",
  "すいぞくかん",
];

const foods = [
  "すし",
  "さしみ",
  "てんぷら",
  "らーめん",
  "うどん",
  "そば",
  "おにぎり",
  "かれー",
  "やきとり",
  "ぎょうざ",
  "おこのみやき",
  "たこやき",
  "やきにく",
  "ぎゅうどん",
  "とんかつ",
  "からあげ",
  "おでん",
  "ちゃーはん",
  "みそしる",
  "さけ",
];

const drinks = [
  "みず",
  "おちゃ",
  "こうちゃ",
  "こーひー",
  "じゅーす",
  "びーる",
  "にほんしゅ",
  "うーろんちゃ",
  "れもんさわー",
  "みるく",
];

const shopping = [
  "おみやげ",
  "ふく",
  "くつ",
  "かばん",
  "かさ",
  "でんち",
  "もばいるばってりー",
  "すいとう",
  "まっぷ",
  "きっぷ",
  "かーど",
  "すまーとふぉんけーす",
  "しんかんせんきっぷ",
  "きっさてんちけっと",
  "ゆかた",
];

const adjectives = [
  "おいしい",
  "あつい",
  "つめたい",
  "あたたかい",
  "やすい",
  "たかい",
  "ちいさい",
  "おおきい",
  "しずか",
  "にぎやか",
  "きれい",
  "べんり",
];

const quantities = [
  "ひとつ",
  "ふたつ",
  "みっつ",
  "よっつ",
  "いつつ",
  "むっつ",
  "ななつ",
  "やっつ",
  "ここのつ",
  "とお",
];

const paymentMethods = [
  "げんきん",
  "くれじっとかーど",
  "こうつうけいあいしー",
  "ぺいぺい",
  "あっぷるぺい",
];

cities.forEach((city) => {
  add(city, "city");
  add(`${city}えき`, "city");
  add(`${city}へいきたいです`, "navigation");
  add(`${city}までおねがいします`, "transport");
  add(`${city}までいくらですか`, "transport");
});

locations.forEach((location) => {
  add(location, "location");
  add(`${location}はどこですか`, "navigation");
  add(`${location}にいきたいです`, "navigation");
  add(`${location}はありますか`, "navigation");
  add(`${location}まであるいていけますか`, "navigation");
  add(`${location}までなんぷんですか`, "navigation");
  add(`${location}までちかいですか`, "navigation");
  add(`${location}までのちずはありますか`, "navigation");
});

foods.forEach((food) => {
  add(food, "food");
  add(`${food}をください`, "food");
  add(`${food}はありますか`, "food");
  add(`${food}をひとつください`, "food");
  add(`${food}はおいしいですか`, "food");
  add(`${food}をおすすめしますか`, "food");
  add(`${food}はからいですか`, "food");
  add(`${food}はあついですか`, "food");
});

drinks.forEach((drink) => {
  add(drink, "drink");
  add(`${drink}をください`, "drink");
  add(`${drink}をひとつください`, "drink");
  add(`${drink}はありますか`, "drink");
  add(`${drink}はつめたいですか`, "drink");
  add(`${drink}はあたたかいですか`, "drink");
});

shopping.forEach((item) => {
  add(item, "shopping");
  add(`${item}はありますか`, "shopping");
  add(`${item}をみせてください`, "shopping");
  add(`${item}をください`, "shopping");
  add(`${item}はいくらですか`, "shopping");
  add(`${item}のやすいものはありますか`, "shopping");
  add(`${item}のちいさいさいずはありますか`, "shopping");
});

adjectives.forEach((word) => {
  add(word, "descriptor");
  locations.forEach((location) => {
    add(`${location}は${word}です`, "descriptor");
  });
  foods.forEach((food) => {
    add(`${food}は${word}です`, "descriptor");
  });
});

quantities.forEach((quantity) => {
  foods.forEach((food) => {
    add(`${food}を${quantity}ください`, "food");
  });
  drinks.forEach((drink) => {
    add(`${drink}を${quantity}ください`, "drink");
  });
  shopping.forEach((item) => {
    add(`${item}を${quantity}ください`, "shopping");
  });
});

paymentMethods.forEach((method) => {
  add(method, "payment");
  add(`${method}はつかえますか`, "payment");
  add(`${method}でしはらえますか`, "payment");
});

[
  "きっぷうりば",
  "のりば",
  "しんかんせん",
  "ろーかるせん",
  "きゅうこう",
  "とっきゅう",
  "はっしゃじこく",
  "つぎのばす",
  "のりかえ",
  "ほーむ",
  "えれべーたー",
  "えすかれーたー",
  "かいだん",
  "にゅうじょうけん",
  "ざせき",
  "よやく",
  "しゅっぱつ",
  "とうちゃく",
  "わすれもの",
  "にもつ",
  "すーつけーす",
  "ぱすぽーと",
  "りょこうけん",
  "えーてぃーえむ",
  "ちゅうしゃじょう",
].forEach((text) => add(text, "travel"));

[
  "えきまでおねがいします",
  "くうこうまでおねがいします",
  "ほてるまでおねがいします",
  "ここでとめてください",
  "つぎでとめてください",
  "ちぇっくいんをおねがいします",
  "ちぇっくあうとはなんじですか",
  "にもつをあずけたいです",
  "へやのかぎをください",
  "よやくしています",
  "よやくしていません",
  "へやをへんこうできますか",
  "たくしーをよんでください",
  "おすすめのみせはありますか",
  "べじたりあんめにゅーはありますか",
  "あれるぎーがあります",
  "からくしないでください",
  "こみていますか",
  "まっています",
  "おねがいできますか",
  "おてつだいします",
  "しつもんがあります",
  "どういたしまして",
  "きをつけてください",
  "よいたびを",
].forEach((text) => add(text, "phrase"));

const result = Array.from(items.values()).slice(0, 780);

await mkdir(dataDir, { recursive: true });
await writeFile(
  path.join(dataDir, "candidates.json"),
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);

console.log(`Generated ${result.length} candidate items.`);
