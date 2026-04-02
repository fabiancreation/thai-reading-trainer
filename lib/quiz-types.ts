import { LessonItem, ConsonantItem, VowelItem, SyllableItem, SRSCard } from "./data/types";

// --- Types ---

export type QuizTypeId = 1 | 2 | 3 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 13 | 15 | 16;

export interface QuizOption {
  label: string;
  value: string;
  large?: boolean; // render in larger font (for thai chars)
}

export interface GeneratedQuestion {
  type: QuizTypeId;
  item: LessonItem;
  prompt: string;
  display: string;
  subtitle?: string;
  options: QuizOption[];
  correctIndex: number;
}

// --- Availability ---

function isConsonant(item: LessonItem): item is ConsonantItem {
  return "cls" in item;
}

function isVowel(item: LessonItem): item is VowelItem {
  return "type" in item && item.type === "vowel";
}

function isSyllable(item: LessonItem): item is SyllableItem {
  return "type" in item && item.type === "syllable";
}

function getActiveClasses(pool: LessonItem[]): Set<string> {
  const classes = new Set<string>();
  for (const it of pool) {
    if (isConsonant(it)) classes.add(it.cls);
  }
  return classes;
}

function isLongShortVowel(v: VowelItem): boolean {
  return v.en.startsWith("long") || v.en.startsWith("short");
}

export function getAvailableTypes(
  item: LessonItem,
  pool: LessonItem[],
  card: SRSCard | undefined
): QuizTypeId[] {
  const types: QuizTypeId[] = [];

  if (isConsonant(item)) {
    types.push(1, 2); // Name<->Char always available
    types.push(6);    // Char->Sound always available

    const classes = getActiveClasses(pool);
    if (classes.size >= 2) {
      types.push(3); // Char->Class

      // Odd One Out: need >=4 consonants and can form 3+1 split
      const consonants = pool.filter(isConsonant);
      if (consonants.length >= 4) {
        // Check: can we find 3 consonants of a different class than this item?
        const othersInDiffClass = consonants.filter(
          (c) => c.cls !== item.cls && c.thai !== item.thai
        );
        // Group by class to find one with >=3
        const classCounts = new Map<string, number>();
        for (const c of othersInDiffClass) {
          classCounts.set(c.cls, (classCounts.get(c.cls) || 0) + 1);
        }
        const hasGroupOf3 = [...classCounts.values()].some((n) => n >= 3);
        if (hasGroupOf3) types.push(5);
      }
    }
  } else if (isVowel(item)) {
    types.push(7, 8); // Name<->Char always available
    types.push(9);    // Position always available

    if (isLongShortVowel(item)) {
      types.push(10); // Long/Short
    }
  } else if (isSyllable(item)) {
    types.push(12, 13); // Read Syllable / Build Syllable
  }

  return types;
}

// --- Selection ---

const EASY_TYPES: QuizTypeId[] = [1, 2, 7, 8, 12];
const HARD_TYPES: QuizTypeId[] = [3, 5, 6, 9, 10, 13];

export function selectQuizType(
  available: QuizTypeId[],
  card: SRSCard | undefined,
  lastType: QuizTypeId | null
): QuizTypeId {
  const reps = card?.reps ?? 0;
  const hard = (card?.difficulty ?? 0) >= 3;

  let candidates: QuizTypeId[];

  if (reps <= 1 && !hard) {
    // New items: prefer easy types
    candidates = available.filter((t) => EASY_TYPES.includes(t));
    if (candidates.length === 0) candidates = [...available];
  } else if (reps >= 3 || hard) {
    // Well-known or hard items: prefer harder types
    candidates = available.filter((t) => HARD_TYPES.includes(t));
    if (candidates.length === 0) candidates = [...available];
  } else {
    candidates = [...available];
  }

  // Never same type twice in a row
  if (candidates.length > 1 && lastType !== null) {
    candidates = candidates.filter((t) => t !== lastType);
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

// --- Question Generation ---

function pickDistractors<T>(
  pool: T[],
  exclude: (item: T) => boolean,
  count: number
): T[] {
  return pool
    .filter((x) => !exclude(x))
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function shuffleWithCorrect(options: QuizOption[], correctValue: string): { options: QuizOption[]; correctIndex: number } {
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  const correctIndex = shuffled.findIndex((o) => o.value === correctValue);
  return { options: shuffled, correctIndex };
}

export function generateQuestion(
  type: QuizTypeId,
  item: LessonItem,
  pool: LessonItem[]
): GeneratedQuestion {
  switch (type) {
    case 1: return genNameToThai(item, pool);
    case 2: return genThaiToName(item, pool);
    case 3: return genCharToClass(item as ConsonantItem);
    case 5: return genOddOneOut(item as ConsonantItem, pool);
    case 6: return genCharToSound(item as ConsonantItem, pool);
    case 7: return genNameToThai(item, pool); // same as type 1 but for vowels
    case 8: return genThaiToName(item, pool); // same as type 2 but for vowels
    case 9: return genPosition(item as VowelItem, pool);
    case 10: return genLongShort(item as VowelItem);
    case 12: return genReadSyllable(item as SyllableItem, pool);
    case 13: return genBuildSyllable(item as SyllableItem, pool);
    default: return genThaiToName(item, pool);
  }
}

// Type 1/7: Name -> Thai
function genNameToThai(item: LessonItem, pool: LessonItem[]): GeneratedQuestion {
  const distractors = pickDistractors(pool, (x) => x.thai === item.thai, 3);
  const allOpts: QuizOption[] = [
    { label: item.thai, value: item.thai, large: true },
    ...distractors.map((d) => ({ label: d.thai, value: d.thai, large: true })),
  ];
  const { options, correctIndex } = shuffleWithCorrect(allOpts, item.thai);
  return {
    type: isConsonant(item) ? 1 : 7,
    item,
    prompt: "Which character is this?",
    display: item.pb,
    subtitle: item.en,
    options,
    correctIndex,
  };
}

// Type 2/8: Thai -> Name
function genThaiToName(item: LessonItem, pool: LessonItem[]): GeneratedQuestion {
  const distractors = pickDistractors(pool, (x) => x.thai === item.thai, 3);
  const allOpts: QuizOption[] = [
    { label: item.pb, value: item.thai },
    ...distractors.map((d) => ({ label: d.pb, value: d.thai })),
  ];
  const { options, correctIndex } = shuffleWithCorrect(allOpts, item.thai);
  return {
    type: isConsonant(item) ? 2 : 8,
    item,
    prompt: "How do you read this?",
    display: item.thai,
    options,
    correctIndex,
  };
}

// Type 3: Char -> Class
function genCharToClass(item: ConsonantItem): GeneratedQuestion {
  const allOpts: QuizOption[] = [
    { label: "Mid", value: "mid" },
    { label: "High", value: "high" },
    { label: "Low", value: "low" },
  ];
  const { options, correctIndex } = shuffleWithCorrect(allOpts, item.cls);
  return {
    type: 3,
    item,
    prompt: "What class is this consonant?",
    display: item.thai,
    subtitle: item.pb,
    options,
    correctIndex,
  };
}

// Type 5: Odd One Out
function genOddOneOut(item: ConsonantItem, pool: LessonItem[]): GeneratedQuestion {
  const consonants = pool.filter(isConsonant);
  // Find 3 consonants from a different class than the target
  const otherClass = consonants.filter(
    (c) => c.cls !== item.cls && c.thai !== item.thai
  );
  // Group by class, pick the largest group
  const byClass = new Map<string, ConsonantItem[]>();
  for (const c of otherClass) {
    const arr = byClass.get(c.cls) || [];
    arr.push(c);
    byClass.set(c.cls, arr);
  }
  let majorityGroup: ConsonantItem[] = [];
  for (const [, group] of byClass) {
    if (group.length > majorityGroup.length) majorityGroup = group;
  }
  const three = majorityGroup
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const allOpts: QuizOption[] = [
    { label: item.thai, value: item.thai, large: true },
    ...three.map((c) => ({ label: c.thai, value: c.thai, large: true })),
  ];
  const { options, correctIndex } = shuffleWithCorrect(allOpts, item.thai);
  return {
    type: 5,
    item,
    prompt: "Which one doesn't belong?",
    display: "",
    subtitle: "3 are the same class, 1 is different",
    options,
    correctIndex,
  };
}

// Type 6: Char -> Sound
function genCharToSound(item: ConsonantItem, pool: LessonItem[]): GeneratedQuestion {
  const consonants = pool.filter(isConsonant);
  // Get unique sounds from pool, excluding the target sound
  const otherSounds = [...new Set(consonants.map((c) => c.sound))].filter(
    (s) => s !== item.sound
  );
  const distractorSounds = otherSounds
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const allOpts: QuizOption[] = [
    { label: item.sound, value: item.sound },
    ...distractorSounds.map((s) => ({ label: s, value: s })),
  ];
  const { options, correctIndex } = shuffleWithCorrect(allOpts, item.sound);
  return {
    type: 6,
    item,
    prompt: "What sound does this make?",
    display: item.thai,
    subtitle: item.pb,
    options,
    correctIndex,
  };
}

// Type 9: Position
function genPosition(item: VowelItem, pool: LessonItem[]): GeneratedQuestion {
  const vowels = pool.filter(isVowel);
  // Get distinct positions from pool
  const allPositions = [...new Set(vowels.map((v) => v.pos))];
  const distractorPositions = allPositions
    .filter((p) => p !== item.pos)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const allOpts: QuizOption[] = [
    { label: item.pos, value: item.pos },
    ...distractorPositions.map((p) => ({ label: p, value: p })),
  ];
  const { options, correctIndex } = shuffleWithCorrect(allOpts, item.pos);
  return {
    type: 9,
    item,
    prompt: "Where is this vowel written?",
    display: item.thai,
    subtitle: item.pb,
    options,
    correctIndex,
  };
}

// Type 12: Read Syllable -- show Thai syllable, pick romanization
function genReadSyllable(item: SyllableItem, pool: LessonItem[]): GeneratedQuestion {
  const syllables = pool.filter(isSyllable);
  const distractors = pickDistractors(syllables, (x) => x.pb === item.pb, 3);
  const allOpts: QuizOption[] = [
    { label: item.pb, value: item.thai },
    ...distractors.map((d) => ({ label: d.pb, value: d.thai })),
  ];
  const { options, correctIndex } = shuffleWithCorrect(allOpts, item.thai);
  return {
    type: 12,
    item,
    prompt: "How do you read this syllable?",
    display: item.thai,
    options,
    correctIndex,
  };
}

// Type 13: Build Syllable -- show romanization, pick Thai syllable
function genBuildSyllable(item: SyllableItem, pool: LessonItem[]): GeneratedQuestion {
  const syllables = pool.filter(isSyllable);
  const distractors = pickDistractors(syllables, (x) => x.thai === item.thai, 3);
  const allOpts: QuizOption[] = [
    { label: item.thai, value: item.thai, large: true },
    ...distractors.map((d) => ({ label: d.thai, value: d.thai, large: true })),
  ];
  const { options, correctIndex } = shuffleWithCorrect(allOpts, item.thai);
  return {
    type: 13,
    item,
    prompt: "Which syllable is this?",
    display: item.pb,
    subtitle: item.en,
    options,
    correctIndex,
  };
}

// Type 10: Long or Short
function genLongShort(item: VowelItem): GeneratedQuestion {
  const isLong = item.en.startsWith("long");
  const correctValue = isLong ? "long" : "short";
  const allOpts: QuizOption[] = [
    { label: "Long", value: "long" },
    { label: "Short", value: "short" },
  ];
  const { options, correctIndex } = shuffleWithCorrect(allOpts, correctValue);
  return {
    type: 10,
    item,
    prompt: "Is this vowel long or short?",
    display: item.thai,
    subtitle: item.pb,
    options,
    correctIndex,
  };
}
