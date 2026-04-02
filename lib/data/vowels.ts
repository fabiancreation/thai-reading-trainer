import { VowelItem } from "./types";

export const VOWELS_BASIC: VowelItem[] = [
  { thai: "-\u0e32", pb: "aa", en: "long /aa/ (father)", pos: "right", type: "vowel" },
  { thai: "-\u0e30", pb: "a", en: "short /a/", pos: "right", type: "vowel" },
  { thai: "-\u0e35", pb: "ii", en: "long /ii/ (see)", pos: "above", type: "vowel" },
  { thai: "-\u0e34", pb: "i", en: "short /i/ (sit)", pos: "above", type: "vowel" },
  { thai: "-\u0e39", pb: "uu", en: "long /uu/ (moon)", pos: "below", type: "vowel" },
  { thai: "-\u0e38", pb: "u", en: "short /u/ (put)", pos: "below", type: "vowel" },
  { thai: "-\u0e37\u0e2d", pb: "\u0289\u0289", en: "long /\u0289\u0289/ (no Eng.)", pos: "above+right", type: "vowel" },
  { thai: "-\u0e36", pb: "\u0289", en: "short /\u0289/", pos: "above", type: "vowel" },
  { thai: "\u0e40-", pb: "ee", en: "long /ee/ (day)", pos: "left", type: "vowel" },
  { thai: "\u0e40-\u0e30", pb: "e", en: "short /e/", pos: "left+right", type: "vowel" },
  { thai: "\u0e41-", pb: "\u025b\u025b", en: "long /\u025b\u025b/ (bed)", pos: "left", type: "vowel" },
  { thai: "\u0e41-\u0e30", pb: "\u025b", en: "short /\u025b/", pos: "left+right", type: "vowel" },
  { thai: "\u0e42-", pb: "oo", en: "long /oo/ (go)", pos: "left", type: "vowel" },
  { thai: "\u0e42-\u0e30", pb: "o", en: "short /o/", pos: "left+right", type: "vowel" },
  { thai: "-\u0e2d", pb: "\u0254\u0254", en: "long /\u0254\u0254/ (law)", pos: "right", type: "vowel" },
  { thai: "\u0e40-\u0e32\u0e30", pb: "\u0254", en: "short /\u0254/", pos: "wrap", type: "vowel" },
  { thai: "\u0e40-\u0e2d", pb: "\u0259\u0259", en: "long /\u0259\u0259/ (fur)", pos: "left+right", type: "vowel" },
  { thai: "\u0e40-\u0e34", pb: "\u0259", en: "short /\u0259/", pos: "left+above", type: "vowel" },
];

export const VOWELS_DIPHT: VowelItem[] = [
  { thai: "\u0e40-\u0e35\u0e22", pb: "iia", en: "long /iia/", pos: "wrap", type: "vowel" },
  { thai: "\u0e40-\u0e35\u0e22\u0e30", pb: "ia", en: "short /ia/", pos: "wrap", type: "vowel" },
  { thai: "-\u0e31\u0e27", pb: "uua", en: "long /uua/", pos: "above+right", type: "vowel" },
  { thai: "-\u0e27\u0e30", pb: "ua", en: "short /ua/", pos: "right", type: "vowel" },
  { thai: "\u0e40-\u0e37\u0e2d", pb: "\u0289\u0289a", en: "long /\u0289\u0289a/", pos: "wrap", type: "vowel" },
  { thai: "\u0e40-\u0e34\u0e2d\u0e30", pb: "\u0289a", en: "short /\u0289a/", pos: "wrap", type: "vowel" },
];

export const VOWELS_SPECIAL: VowelItem[] = [
  { thai: "\u0e44-", pb: "ai", en: "/ai/ (Thai)", pos: "left", type: "vowel" },
  { thai: "\u0e43-", pb: "ai", en: "/ai/ (Maimaluan)", pos: "left", type: "vowel" },
  { thai: "-\u0e33", pb: "am", en: "/am/", pos: "above+right", type: "vowel" },
  { thai: "\u0e40-\u0e32", pb: "ao", en: "/ao/", pos: "left+right", type: "vowel" },
  { thai: "\u0e24", pb: "r\u0289", en: "/r\u0289/ (special)", pos: "standalone", type: "vowel" },
  { thai: "\u0e26", pb: "l\u0289", en: "/l\u0289/ (rare)", pos: "standalone", type: "vowel" },
];
