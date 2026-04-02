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

export type LessonItem = ConsonantItem | VowelItem | ToneMarkItem;

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

export interface UserProgress {
  done: number[];
  srs: Record<string, SRSCard>;
  activeGroups: string[];
}

export interface SRSCard {
  thai: string;
  interval: number;
  ease: number;
  due: string;
  reps: number;
}
