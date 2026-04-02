export interface ConsonantItem {
  thai: string;
  pb: string;       // Full Paiboon name, e.g. "gɔɔ gài"
  sound: string;    // Initial consonant sound
  en: string;       // English meaning of acrophonic word
  cls: "mid" | "high" | "low";
}

export interface VowelItem {
  thai: string;
  pb: string;       // Paiboon romanization of vowel sound
  en: string;       // Description
  pos: string;      // Position relative to consonant: left, right, above, below, wrap, etc.
  type: "vowel";
}

export interface ToneMarkItem {
  thai: string;
  pb: string;
  en: string;
  type: "tone_mark";
}

export interface WordItem {
  thai: string;
  pb: string;
  en: string;
}

export interface TheoryItem {
  label: string;
  text: string;
}

export interface Lesson {
  id: number;
  phase: string;
  title: string;
  desc: string;
  items: (ConsonantItem | VowelItem | ToneMarkItem)[];
  words?: WordItem[];
  theory?: TheoryItem[];
  tip?: string;
}

export interface UserProgress {
  done: number[];           // Completed lesson IDs
  srs: Record<string, SRSCard>;
}

export interface SRSCard {
  thai: string;
  interval: number;         // Days until next review
  ease: number;             // Ease factor (SM-2)
  due: string;              // ISO date string
  reps: number;             // Number of successful reviews
}

export interface ThemeColors {
  bg: string;
  sf: string;
  sl: string;
  ac: string;
  ad: string;
  mid: string;
  high: string;
  low: string;
  tx: string;
  td: string;
  tm: string;
  ok: string;
  no: string;
  bd: string;
  cd: string;
  qz: string;
}
