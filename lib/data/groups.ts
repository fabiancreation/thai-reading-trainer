import { ConsonantItem, VowelItem, LessonItem } from "./types";
import { MID, HIGH, LOW_PAIRED, LOW_SONORANT } from "./consonants";
import { VOWELS_BASIC, VOWELS_DIPHT, VOWELS_SPECIAL } from "./vowels";

export type GroupCategory = "consonant" | "vowel" | "tone";

export interface CharacterGroup {
  id: string;
  name: string;
  category: GroupCategory;
  items: LessonItem[];
  /** Short label for the vowel sound pair, e.g. "a / aa" */
  pairLabel?: string;
}

// --- Consonant groups ---

export const CONSONANT_GROUPS: CharacterGroup[] = [
  { id: "con_mid", name: "Mid Class", category: "consonant", items: MID },
  { id: "con_high", name: "High Class", category: "consonant", items: HIGH },
  { id: "con_low_paired", name: "Low Paired", category: "consonant", items: LOW_PAIRED },
  { id: "con_low_sonorant", name: "Low Sonorant", category: "consonant", items: LOW_SONORANT },
];

// --- Vowel groups: split into pairs (long + short) ---

function vowelPair(long: VowelItem, short: VowelItem, label: string): CharacterGroup {
  return {
    id: `vow_${label.replace(/\s*\/\s*/g, "_").replace(/\s+/g, "")}`,
    name: `Vowel: ${label}`,
    category: "vowel",
    items: [long, short],
    pairLabel: label,
  };
}

// VOWELS_BASIC has 18 items: 9 pairs ordered long, short, long, short...
const VB = VOWELS_BASIC;

export const VOWEL_GROUPS: CharacterGroup[] = [
  vowelPair(VB[0], VB[1], "aa / a"),
  vowelPair(VB[2], VB[3], "ii / i"),
  vowelPair(VB[4], VB[5], "uu / u"),
  vowelPair(VB[6], VB[7], "ʉʉ / ʉ"),
  vowelPair(VB[8], VB[9], "ee / e"),
  vowelPair(VB[10], VB[11], "ɛɛ / ɛ"),
  vowelPair(VB[12], VB[13], "oo / o"),
  vowelPair(VB[14], VB[15], "ɔɔ / ɔ"),
  vowelPair(VB[16], VB[17], "əə / ə"),
  { id: "vow_diphthongs", name: "Diphthongs", category: "vowel", items: VOWELS_DIPHT },
  { id: "vow_special", name: "Special Vowels", category: "vowel", items: VOWELS_SPECIAL },
];

// --- Tone groups ---

export const TONE_GROUPS: CharacterGroup[] = [
  {
    id: "tone_rules",
    name: "Tone Rules",
    category: "tone",
    items: [],
  },
  {
    id: "tone_marks",
    name: "Tone Marks",
    category: "tone",
    items: [
      { thai: "\u0e48", pb: "mái èek", en: "1st tone mark", type: "tone_mark" as const },
      { thai: "\u0e49", pb: "mái tôo", en: "2nd tone mark", type: "tone_mark" as const },
      { thai: "\u0e4a", pb: "mái dtrii", en: "3rd (mid only)", type: "tone_mark" as const },
      { thai: "\u0e4b", pb: "mái jàt-dtà-waa", en: "4th (mid only)", type: "tone_mark" as const },
    ],
  },
];

// --- All groups flat ---

export const ALL_GROUPS: CharacterGroup[] = [
  ...CONSONANT_GROUPS,
  ...VOWEL_GROUPS,
  ...TONE_GROUPS,
];

// --- Helpers ---

export function getActiveItems(activeGroupIds: string[], category?: GroupCategory): LessonItem[] {
  return ALL_GROUPS
    .filter((g) => activeGroupIds.includes(g.id) && (!category || g.category === category))
    .flatMap((g) => g.items);
}

export function getActiveConsonants(activeGroupIds: string[]): ConsonantItem[] {
  return getActiveItems(activeGroupIds, "consonant") as ConsonantItem[];
}

export function getActiveVowels(activeGroupIds: string[]): VowelItem[] {
  return getActiveItems(activeGroupIds, "vowel") as VowelItem[];
}

export function hasActiveConsonants(activeGroupIds: string[]): boolean {
  return CONSONANT_GROUPS.some((g) => activeGroupIds.includes(g.id));
}

export function hasActiveVowels(activeGroupIds: string[]): boolean {
  return VOWEL_GROUPS.some((g) => activeGroupIds.includes(g.id));
}
