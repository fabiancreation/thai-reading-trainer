import { ConsonantItem, VowelItem, SyllableItem } from "./data/types";
import { getActiveConsonants, getActiveVowels } from "./data/groups";

// --- Vowel sound map ---

export const VOWEL_SOUND_MAP: Record<string, string> = {
  // Basic pairs
  "-\u0e32": "aa",    // -า
  "-\u0e30": "a",     // -ะ
  "-\u0e35": "ii",    // -ี
  "-\u0e34": "i",     // -ิ
  "-\u0e39": "uu",    // -ู
  "-\u0e38": "u",     // -ุ
  "-\u0e37\u0e2d": "\u0289\u0289",  // -ือ
  "-\u0e36": "\u0289",              // -ึ
  "\u0e40-": "ee",                  // เ-
  "\u0e40-\u0e30": "e",            // เ-ะ
  "\u0e41-": "\u025b\u025b",       // แ-
  "\u0e41-\u0e30": "\u025b",       // แ-ะ
  "\u0e42-": "oo",                  // โ-
  "\u0e42-\u0e30": "o",            // โ-ะ
  "-\u0e2d": "\u0254\u0254",       // -อ
  "\u0e40-\u0e32\u0e30": "\u0254", // เ-าะ
  "\u0e40-\u0e2d": "\u0259\u0259", // เ-อ
  "\u0e40-\u0e2d\u0e30": "\u0259", // เ-อะ (sara ə)
  // Diphthongs
  "\u0e40-\u0e35\u0e22": "iia",                    // เ-ีย
  "\u0e40-\u0e35\u0e22\u0e30": "ia",               // เ-ียะ
  "-\u0e31\u0e27": "uua",                           // -ัว
  "-\u0e27\u0e30": "ua",                             // -วะ
  "\u0e40-\u0e37\u0e2d": "\u0289\u0289a",           // เ-ือ
  "\u0e40-\u0e37\u0e2d\u0e30": "\u0289a",           // เ-ือะ
  // Special (excluding standalone ฤ ฦ)
  "\u0e44-": "ai",           // ไ-
  "\u0e43-": "ai",           // ใ-
  "-\u0e33": "am",           // -ำ
  "\u0e40-\u0e32": "ao",    // เ-า
};

// --- Syllable combination ---

export function combineSyllable(consonant: ConsonantItem, vowel: VowelItem): string {
  return vowel.thai.replace(/-/g, consonant.thai);
}

export function romanizeSyllable(consonant: ConsonantItem, vowel: VowelItem): string {
  const vowelSound = VOWEL_SOUND_MAP[vowel.thai] ?? "?";
  // อ as initial consonant is a silent glottal stop (not pronounced),
  // except with sara ɔɔ (-อ) where อ+อ = ออ = "ɔɔ"
  const conSound = consonant.thai === "\u0e2d" ? "" : consonant.sound;
  return conSound + vowelSound;
}

// --- Pool generation ---

export function generateSyllablePool(activeGroups: string[]): SyllableItem[] {
  const consonants = getActiveConsonants(activeGroups);
  const vowels = getActiveVowels(activeGroups).filter(
    (v) => v.pos !== "standalone"
  );

  const syllables: SyllableItem[] = [];
  for (const c of consonants) {
    for (const v of vowels) {
      const thai = combineSyllable(c, v);
      const pb = romanizeSyllable(c, v);
      syllables.push({
        thai,
        pb,
        en: `${c.sound} + ${VOWEL_SOUND_MAP[v.thai] ?? "?"}`,
        type: "syllable",
        consonant: c,
        vowel: v,
      });
    }
  }
  return syllables;
}
