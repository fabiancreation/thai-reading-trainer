import { ConsonantItem, VowelItem } from "./types";
import { MID, HIGH, LOW_PAIRED, LOW_SONORANT } from "./consonants";
import { VOWELS_BASIC, VOWELS_DIPHT, VOWELS_SPECIAL } from "./vowels";

const ALL_CONSONANTS: ConsonantItem[] = [...MID, ...HIGH, ...LOW_PAIRED, ...LOW_SONORANT];
const ALL_VOWELS: VowelItem[] = [...VOWELS_BASIC, ...VOWELS_DIPHT, ...VOWELS_SPECIAL];

// --- Manually curated sets ---

/** Pairs of visually similar consonants */
const VISUALLY_SIMILAR: string[][] = [
  ["\u0e14", "\u0e04"], // ด ค
  ["\u0e1b", "\u0e1a"], // ป บ
  ["\u0e16", "\u0e20"], // ถ ภ
  ["\u0e0e", "\u0e14"], // ฎ ด
  ["\u0e0f", "\u0e15"], // ฏ ต
  ["\u0e02", "\u0e03"], // ข ฃ
  ["\u0e04", "\u0e05"], // ค ฅ
  ["\u0e0a", "\u0e0b"], // ช ซ
  ["\u0e1e", "\u0e1c"], // พ ผ
  ["\u0e1f", "\u0e1d"], // ฟ ฝ
];
const VISUALLY_SIMILAR_SET = new Set<string>();
for (const pair of VISUALLY_SIMILAR) {
  for (const ch of pair) VISUALLY_SIMILAR_SET.add(ch);
}

/** Rare or obsolete consonants */
const RARE_OBSOLETE = new Set([
  "\u0e03", // ฃ
  "\u0e05", // ฅ
  "\u0e0c", // ฌ
  "\u0e2c", // ฬ
  "\u0e0e", // ฎ
  "\u0e0f", // ฏ
  "\u0e11", // ฑ
  "\u0e12", // ฒ
  "\u0e13", // ณ
  "\u0e0d", // ญ
]);

/** Consonants with unintuitive class */
const UNINTUITIVE_CLASS = new Set([
  "\u0e2d", // อ - mid class but looks like a vowel
]);

/** Vowel pairs that are easily confused */
const CONFUSED_VOWELS: string[][] = [
  ["\u0e40-\u0e30", "\u0e41-\u0e30"],       // เ-ะ แ-ะ
  ["\u0e40-", "\u0e41-"],                     // เ- แ-
  ["\u0e44-", "\u0e43-"],                     // ไ- ใ-
  ["-\u0e34", "-\u0e36"],                     // -ิ -ึ
  ["-\u0e35", "-\u0e37\u0e2d"],              // -ี -ือ
];
const CONFUSED_VOWEL_SET = new Set<string>();
for (const pair of CONFUSED_VOWELS) {
  for (const v of pair) CONFUSED_VOWEL_SET.add(v);
}

// --- Computation ---

function computeConsonantDifficulty(c: ConsonantItem): number {
  let stars = 0;

  // 1. Same sound as another consonant
  const sameSound = ALL_CONSONANTS.filter(
    (x) => x.thai !== c.thai && x.sound === c.sound
  );
  if (sameSound.length > 0) stars++;

  // 2. Visually similar to another
  if (VISUALLY_SIMILAR_SET.has(c.thai)) stars++;

  // 3. Rare or obsolete
  if (RARE_OBSOLETE.has(c.thai)) stars++;

  // 4. Unintuitive class
  if (UNINTUITIVE_CLASS.has(c.thai)) stars++;

  // 5. Same name-sound as another (same pb prefix before space)
  const nameSound = c.pb.split(" ")[0];
  const sameName = ALL_CONSONANTS.filter(
    (x) => x.thai !== c.thai && x.pb.split(" ")[0] === nameSound
  );
  if (sameName.length > 0) stars++;

  return Math.min(5, stars);
}

function computeVowelDifficulty(v: VowelItem): number {
  let stars = 0;

  // 1. Position is not simply "right"
  if (v.pos !== "right") stars++;

  // 2. Multi-part form (contains + or is wrap)
  if (v.pos.includes("+") || v.pos === "wrap") stars++;

  // 3. No English equivalent
  if (v.en.includes("no Eng.")) stars++;

  // 4. Easily confused with another vowel
  if (CONFUSED_VOWEL_SET.has(v.thai)) stars++;

  // 5. Written form looks different from what you hear
  // Left-position vowels are counterintuitive for beginners
  if (v.pos.startsWith("left") || v.pos === "standalone") stars++;

  return Math.min(5, stars);
}

// --- Build the map ---

export const BASE_DIFFICULTY: Record<string, number> = {};

for (const c of ALL_CONSONANTS) {
  BASE_DIFFICULTY[c.thai] = computeConsonantDifficulty(c);
}
for (const v of ALL_VOWELS) {
  BASE_DIFFICULTY[v.thai] = computeVowelDifficulty(v);
}

export function getBaseDifficulty(thai: string): number {
  return BASE_DIFFICULTY[thai] ?? 0;
}

export function getConfusables(thai: string): string[] {
  const result: string[] = [];
  for (const pair of VISUALLY_SIMILAR) {
    const idx = pair.indexOf(thai);
    if (idx !== -1) {
      for (const ch of pair) {
        if (ch !== thai) result.push(ch);
      }
    }
  }
  for (const pair of CONFUSED_VOWELS) {
    const idx = pair.indexOf(thai);
    if (idx !== -1) {
      for (const v of pair) {
        if (v !== thai) result.push(v);
      }
    }
  }
  return result;
}
