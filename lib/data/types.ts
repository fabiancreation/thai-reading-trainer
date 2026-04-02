export interface ConsonantItem {
  thai: string;
  pb: string;
  sound: string;
  en: string;
  cls: "mid" | "high" | "low";
}

export interface VowelItem {
  thai: string;
  pb: string;
  en: string;
  pos: string;
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

export interface SyllableItem {
  thai: string;
  pb: string;
  en: string;
  type: "syllable";
  consonant: ConsonantItem;
  vowel: VowelItem;
}

export type LessonItem = ConsonantItem | VowelItem | ToneMarkItem | SyllableItem;

export interface Lesson {
  id: number;
  phase: string;
  title: string;
  desc: string;
  items: LessonItem[];
  words?: WordItem[];
  theory?: TheoryItem[];
  tip?: string;
}

export interface StreakData {
  current: number;
  lastPracticeDate: string; // "YYYY-MM-DD"
}

export interface UserProgress {
  done: number[];
  srs: Record<string, SRSCard>;
  activeGroups: string[];
  streak?: StreakData;
}

export type SRSStatus = "new" | "learning" | "review" | "leech";
export type SRSCategory = "consonant" | "vowel" | "tone_mark" | "syllable";

export interface SRSCard {
  thai: string;
  interval: number;
  ease: number;
  due: string;
  reps: number;
  lapses: number;
  category: SRSCategory;
  status: SRSStatus;
  difficulty: number;
  consecutiveCorrect: number;
}
