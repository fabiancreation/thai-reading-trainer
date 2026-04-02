import { LessonItem, ToneMarkItem } from "./types";
import { GeneratedQuestion, QuizOption } from "../quiz-types";

// --- Tone Rules: class + syllable type → tone (no marks) ---

const TONE_RULES: Record<string, Record<string, string>> = {
  mid:  { live: "mid",    dead_long: "low",     dead_short: "low" },
  high: { live: "rising", dead_long: "low",     dead_short: "low" },
  low:  { live: "mid",    dead_long: "falling", dead_short: "high" },
};

const SYLLABLE_TYPE_LABELS: Record<string, string> = {
  live: "Live syllable",
  dead_long: "Dead syllable (long vowel)",
  dead_short: "Dead syllable (short vowel)",
};

const CLASS_LABELS: Record<string, string> = {
  mid: "Mid class",
  high: "High class",
  low: "Low class",
};

// --- Tone Marks: mark + class → tone ---

interface ToneMarkRule {
  mark: string;    // Thai mark character
  markName: string;
  classes: Record<string, string>; // class → tone
}

const TONE_MARK_RULES: ToneMarkRule[] = [
  { mark: "\u0e48", markName: "Mai Eek",  classes: { mid: "low",     high: "low",     low: "falling" } },
  { mark: "\u0e49", markName: "Mai Too",   classes: { mid: "falling", high: "falling", low: "high" } },
  { mark: "\u0e4a", markName: "Mai Dtrii", classes: { mid: "high" } },
  { mark: "\u0e4b", markName: "Mai Jat",   classes: { mid: "rising" } },
];

// --- All 5 tones as options ---

const TONE_OPTIONS: QuizOption[] = [
  { label: "Mid", value: "mid" },
  { label: "Low", value: "low" },
  { label: "Falling", value: "falling" },
  { label: "High", value: "high" },
  { label: "Rising", value: "rising" },
];

function shuffleWithCorrect(correctValue: string): { options: QuizOption[]; correctIndex: number } {
  const shuffled = [...TONE_OPTIONS].sort(() => Math.random() - 0.5);
  const correctIndex = shuffled.findIndex((o) => o.value === correctValue);
  return { options: shuffled, correctIndex };
}

// Synthetic item for SRS tracking of tone rules
function toneRuleItem(cls: string, syllType: string): LessonItem {
  return {
    thai: `rule_${cls}_${syllType}`,
    pb: `${CLASS_LABELS[cls]} + ${SYLLABLE_TYPE_LABELS[syllType]}`,
    en: `Tone rule`,
    type: "tone_mark" as const,
  } as ToneMarkItem;
}

function toneMarkItem(markName: string, mark: string, cls: string): LessonItem {
  return {
    thai: `mark_${markName}_${cls}`,
    pb: `${markName} (${mark}) + ${CLASS_LABELS[cls]}`,
    en: `Tone mark rule`,
    type: "tone_mark" as const,
  } as ToneMarkItem;
}

// --- Generate questions ---

export function generateToneQuestions(
  toneRulesActive: boolean,
  toneMarksActive: boolean
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  // Type 15: Class + Syllable Type → Tone
  if (toneRulesActive) {
    for (const cls of ["mid", "high", "low"]) {
      for (const syllType of ["live", "dead_long", "dead_short"]) {
        const tone = TONE_RULES[cls][syllType];
        const { options, correctIndex } = shuffleWithCorrect(tone);
        questions.push({
          type: 15,
          item: toneRuleItem(cls, syllType),
          prompt: "What tone does this produce?",
          display: `${CLASS_LABELS[cls]}`,
          subtitle: SYLLABLE_TYPE_LABELS[syllType],
          options,
          correctIndex,
        });
      }
    }
  }

  // Type 16: Mark + Class → Tone
  if (toneMarksActive) {
    for (const rule of TONE_MARK_RULES) {
      for (const [cls, tone] of Object.entries(rule.classes)) {
        const { options, correctIndex } = shuffleWithCorrect(tone);
        questions.push({
          type: 16,
          item: toneMarkItem(rule.markName, rule.mark, cls),
          prompt: "What tone does this produce?",
          display: `${rule.markName} ${rule.mark}`,
          subtitle: CLASS_LABELS[cls],
          options,
          correctIndex,
        });
      }
    }
  }

  // Shuffle and pick up to 10
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
}
