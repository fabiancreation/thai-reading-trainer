# Thai Reading Trainer - Learning Logic Specification v2

## 1. Design Principle: Course Companion, Not Course Replacement

The user takes an offline Thai class. The class determines **what** to learn and **when**. The app's job is:
- Let the user **activate** character groups when the class covers them
- Drill those groups effectively with smart quiz logic
- Track memory with SRS so nothing is forgotten
- Allow **any combination** of groups to be practiced at any time

The app does NOT impose a fixed curriculum. It is a flexible practice tool.

---

## 2. Architecture: Groups + Pools + Sessions

### 2.1 Character Groups

All content is organized into independently activatable **groups**:

```
CONSONANTS
  ├── Mid Class (9)
  ├── High Class (11)
  ├── Low Paired (14)
  └── Low Sonorant (10)

VOWELS
  ├── Basic Pair: a/aa (2)
  ├── Basic Pair: i/ii (2)
  ├── Basic Pair: u/uu (2)
  ├── Basic Pair: ʉ/ʉʉ (2)
  ├── Basic Pair: e/ee (2)
  ├── Basic Pair: ɛ/ɛɛ (2)
  ├── Basic Pair: o/oo (2)
  ├── Basic Pair: ɔ/ɔɔ (2)
  ├── Basic Pair: ə/əə (2)
  ├── Diphthongs (6)
  └── Special Vowels (6)

TONE SYSTEM
  ├── Tone Rules (theory)
  └── Tone Marks (4)
```

Each group can be:
- **Locked** (default) - not yet covered in class, greyed out
- **Active** - currently learning, appears in practice
- **Mastered** - all items reviewed successfully ≥3 times, still appears in SRS review

The user taps a group to activate it. No forced sequence.

### 2.2 Vowels as Individual Pairs

Vowels are split into **small pairs** (long + short), not one giant "all vowels" block. This matters because:
- The offline class may teach aa/a in week 1 but ɔɔ/ɔ not until week 3
- The user activates only the pairs they've learned so far
- Each pair is small enough (2 items) to learn in one sitting

### 2.3 The Practice Pool

When the user hits "Practice", the app builds a pool from **all active groups**. But crucially:

**Consonants and vowels are NEVER mixed in the same quiz question.**

The pool is split into sub-pools:
- Consonant pool (from all active consonant groups)
- Vowel pool (from all active vowel groups)
- Reading pool (syllables/words combining learned consonants + vowels) — only if ≥1 consonant group AND ≥1 vowel group are active

Each quiz question draws from ONE sub-pool only.

---

## 3. Session Engine

### 3.1 Session Modes

The home screen offers these practice options:

```
┌─────────────────────────────────────┐
│  PRACTICE                           │
│  ┌───────────────────────────────┐  │
│  │  ▶  Daily Mix                 │  │
│  │     12 due · 3 new            │  │
│  └───────────────────────────────┘  │
│                                     │
│  TARGETED PRACTICE                  │
│  ┌──────────┐  ┌──────────┐        │
│  │ Consonants│  │  Vowels  │        │
│  │  34 cards │  │ 12 cards │        │
│  └──────────┘  └──────────┘        │
│  ┌──────────┐  ┌──────────┐        │
│  │ Reading  │  │  Tones   │        │
│  │ 8 combos │  │  Rules   │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  MY GROUPS                          │
│  ✅ Mid Consonants        9 items   │
│  ✅ Vowel: a/aa           2 items   │
│  ✅ Vowel: i/ii           2 items   │
│  ✅ Vowel: u/uu           2 items   │
│  ⬜ High Consonants      11 items   │
│  ⬜ Vowel: ʉ/ʉʉ          2 items   │
│  ...                                │
└─────────────────────────────────────┘
```

#### Daily Mix
- Pulls from ALL active groups
- 70% SRS review (due items), 30% new items from active groups
- Keeps consonants and vowels in separate questions
- 15-25 items per session
- Default when you just want to practice

#### Targeted: Consonants Only
- Pulls ONLY from active consonant groups
- Great for drilling before/after class
- Uses consonant-specific quiz types

#### Targeted: Vowels Only
- Pulls ONLY from active vowel groups
- Uses vowel-specific quiz types (position, long/short, etc.)

#### Targeted: Reading
- Combines learned consonants + vowels into syllables
- Only available when ≥1 consonant group AND ≥1 vowel group active
- Shows a syllable, asks for reading or tone

#### Targeted: Tones
- Tone rule drills
- Only available when Tone Rules group is active

#### Single Group Drill
- Tap any active group in "My Groups" to drill just that group
- E.g., tap "Mid Consonants" to only practice those 9 characters
- Useful right after learning a new group in class

### 3.2 Non-Blocking Principle

**Due reviews NEVER block access to anything.** The user can always:
- Start a new group drill even with 50 reviews pending
- Do targeted practice on vowels while consonant reviews pile up
- Learn new items without finishing old reviews first

The home screen shows due reviews as an invitation, not a gate:

```
┌─────────────────────────────────────┐
│  ▶ REVIEW        12 cards due       │
│    Tap to clear your review queue   │
│                                     │
│  ▶ LEARN NEW     Continue Stage     │
│    3 new items from Vowel: ɛ/ɛɛ    │
│                                     │
│  ▶ DRILL         Pick a group       │
│    Practice any active group        │
└─────────────────────────────────────┘
```

All three buttons are **always available**. Due reviews are highlighted with a badge count but never disable the other options.

In the **Daily Mix**, due reviews come first but new items are always mixed in. If the user only wants new items, they use "Learn New" or a group drill. If they only want review, they use "Review".

The philosophy: **the user is an adult learner taking an offline course. The app serves them, not the other way around.**

### 3.2 Quiz Types by Category

**Consonant quiz types:**

| # | Type | Question | Answer | When |
|---|------|----------|--------|------|
| 1 | Name → Char | Show "gɔɔ gài" | Pick ก | Always |
| 2 | Char → Name | Show ก | Pick "gɔɔ gài" | Always |
| 3 | Char → Class | Show ก | Pick Mid/High/Low | When ≥2 classes active |
| 4 | Sound → All Chars | Show "s" | Pick ALL s-consonants | When ≥2 same-sound chars active |
| 5 | Odd One Out | Show 4 chars, 3 same class | Pick the different one | When ≥2 classes active |
| 6 | Char → Sound | Show ก | Pick "g" | Always |

**Vowel quiz types:**

| # | Type | Question | Answer | When |
|---|------|----------|--------|------|
| 7 | Form → Sound | Show -า | Pick "aa" | Always |
| 8 | Sound → Form | Show "ee" | Pick เ- | Always |
| 9 | Position | Show vowel | Pick left/right/above/below/wrap | Always |
| 10 | Long or Short? | Show vowel | Pick long/short | Always |
| 11 | Find the Pair | Show short form | Pick the long partner | When both in active group |

**Reading quiz types (from learned combinations):**

| # | Type | Question | Answer | When |
|---|------|----------|--------|------|
| 12 | Read Syllable | Show กา | Pick "gaa" | ≥1 cons + ≥1 vowel active |
| 13 | Build Syllable | Show "gaa" | Pick กา | ≥1 cons + ≥1 vowel active |
| 14 | What Tone? | Show syllable | Pick mid/low/falling/high/rising | Tone rules active |

**Tone quiz types:**

| # | Type | Question | Answer | When |
|---|------|----------|--------|------|
| 15 | Class + Type → Tone | "Mid + Live" | Pick "Mid tone" | Tone rules active |
| 16 | Mark + Class → Tone | "Mai Eek + Low" | Pick "Falling" | Tone marks active |

### 3.3 Quiz Selection Logic

Within a session, the engine picks quiz types based on:

1. **Item mastery level**: New items get easier types (1, 2, 7, 8). Well-known items get harder types (3, 4, 5, 9, 14).
2. **Available data**: Type 3 (Char → Class) only works when multiple classes are activated. Type 4 (Sound → All) only when multiple same-sound chars exist in active pool.
3. **Variety**: Never show the same quiz type twice in a row.
4. **Difficulty stars**: Items with ≥3 stars get shown more often and in harder quiz types.

### 3.4 Wrong Answer Handling

After a wrong answer:
1. Show the correct answer highlighted (green)
2. Show a brief **explanation** (max 1-2 lines):
   - Consonant: "ก is gɔɔ gài (chicken). It's Mid class."
   - Vowel: "-า is aa (long). It goes to the right of the consonant."
3. **Re-queue** the item: it will appear again within the next 3-5 questions in the same session
4. Update SRS (see section 4)

---

## 4. SRS Memory System

### 4.1 Algorithm: Simplified SM-2

```typescript
interface SRSCard {
  id: string;              // "con_ก", "vow_-า", "read_กา"
  category: "consonant" | "vowel" | "tone_mark" | "reading";
  thai: string;
  interval: number;        // days until next review
  ease: number;            // starts at 2.5
  due: string;             // ISO date
  reps: number;            // consecutive correct
  lapses: number;          // total times wrong
  difficulty: number;      // 0-5 stars
  status: "new" | "learning" | "review" | "leech";
}
```

### 4.2 Scheduling

```
WRONG:
  reps = 0
  interval = 1
  ease = max(1.3, ease - 0.2)
  lapses += 1
  status = lapses >= 5 ? "leech" : "learning"

CORRECT:
  reps == 0 → interval = 1
  reps == 1 → interval = 3
  reps >= 2 → interval = round(interval * ease)
  reps += 1
  ease = min(3.0, ease + 0.1)
  status = reps >= 3 ? "review" : "learning"

EASY (optional):
  interval = round(interval * ease * 1.3)
  reps += 1
  ease = min(3.0, ease + 0.15)
```

### 4.3 New Item Introduction

- Max **5 new items per session** from active groups
- New items are shown with full info card first (character, name, class, meaning) before quizzing
- After initial introduction, they enter the SRS as "learning" with interval=0 (due today)

### 4.4 Leech Handling

Items wrong ≥5 times total get "leech" status:
- Shown with a ⚠️ badge
- Before quizzing, show a "Focus Card" with:
  - The character large
  - Full name and meaning
  - What it's commonly confused with
  - A mnemonic hint if available
- Reviewed more frequently (interval capped at 3 days)

---

## 5. Difficulty Stars

### 5.1 Base Difficulty (preset per item)

**Consonants** - automatic stars for:
- ⭐ Same sound as another consonant (e.g., ซ/ศ/ษ/ส all = "s")
- ⭐ Visually similar to another character (e.g., ด/ค, บ/ป, ถ/ภ, ฎ/ฏ)
- ⭐ Rare or obsolete (ฃ, ฅ, ฌ, ฬ, ฎ, ฏ)
- ⭐ Class is unintuitive (อ is mid despite looking like a vowel)
- ⭐ Multiple chars with same name-sound (ด dɔɔ dèk vs ฎ dɔɔ chá-daa)

**Vowels** - automatic stars for:
- ⭐ Position is not simply "right" (left, above, below, wrapping)
- ⭐ Multi-part form (เ-ือ, เ-ีย, -ัว)
- ⭐ No English equivalent (ʉ, ɔ, ə)
- ⭐ Easily confused with another vowel (เ-ะ vs แ-ะ)
- ⭐ Written form looks very different from what you hear

### 5.2 Dynamic Adjustment

After every review:
- If wrong AND base difficulty < 5 → difficulty += 1
- If correct 3 times in a row AND difficulty > base → difficulty -= 1
- Stars shown on cards: ⭐ × difficulty value
- Items with ≥3 stars get a subtle "Hard" badge

### 5.3 Preset Values

Examples (not exhaustive):

| Char | Base Stars | Reason |
|------|-----------|--------|
| ก | 0 | First letter, easy |
| อ | 2 | Looks like vowel, is mid consonant |
| ฎ | 3 | Rare, same sound as ด, similar to ฏ |
| ษ | 4 | Rare, same sound as ศ/ส/ซ, Sanskrit |
| เ-ือ | 3 | 3-part wrap vowel, ʉ sound |
| -ำ | 2 | Combines vowel + final consonant |
| ไ-/ใ- | 3 | Two spellings for same sound |

---

## 6. Reading Practice (Syllable Generator)

### 6.1 When Available

Reading practice unlocks automatically when:
- At least 1 consonant group is active AND
- At least 1 vowel group is active

### 6.2 Syllable Generation

The app **generates practice syllables** from the active pool:

```typescript
function generateSyllable(activeConsonants: string[], activeVowels: string[]): Syllable {
  const consonant = random(activeConsonants);
  const vowel = random(activeVowels);
  // Combine: apply vowel to consonant
  // Calculate expected tone based on class + vowel length + live/dead
  return { thai: combine(consonant, vowel), pb: romanize(...), tone: calcTone(...) };
}
```

This ensures:
- The learner only sees syllables made from characters they've learned
- As more groups are activated, the syllable pool grows
- New combinations keep appearing naturally
- The difficulty scales with what has been activated

### 6.3 Progressive Reading

Level 1: Single consonant + single vowel (e.g., กา, ดี, ปู)
Level 2: With tone marks (e.g., ก่า, ดี้)
Level 3: With final consonants (e.g., กาน, ดิน) — requires final consonant knowledge
Level 4: Multi-syllable words from vocabulary list

---

## 7. Home Screen Redesign

```
┌─────────────────────────────────────┐
│                                     │
│  ▶ REVIEW         12 cards due      │
│    Clear your review queue          │
│                                     │
│  ▶ LEARN NEW      Vowel: ɛ/ɛɛ      │
│    3 new items to learn             │
│                                     │
│  ▶ DAILY MIX      Reviews + new     │
│    15 items · balanced session      │
│                                     │
│  DRILL BY TYPE                      │
│  [Consonants 34]  [Vowels 12]      │
│  [Reading ✨]     [Tones]          │
│                                     │
│  ── MY GROUPS ──────────────────    │
│                                     │
│  CONSONANTS                         │
│  ✅ Mid Class         9  ⭐avg 0.8 │
│  ⬜ High Class       11  tap to     │
│  ⬜ Low Paired       14  activate   │
│  ⬜ Low Sonorant     10             │
│                                     │
│  VOWELS                             │
│  ✅ a / aa            2  ⭐avg 0.5 │
│  ✅ i / ii            2  ⭐avg 0   │
│  ✅ u / uu            2  ⭐avg 0   │
│  ⬜ ʉ / ʉʉ           2             │
│  ⬜ e / ee            2             │
│  ⬜ ɛ / ɛɛ            2             │
│  ⬜ o / oo            2             │
│  ⬜ ɔ / ɔɔ            2             │
│  ⬜ ə / əə            2             │
│  ⬜ Diphthongs        6             │
│  ⬜ Special           6             │
│                                     │
│  TONE SYSTEM                        │
│  ⬜ Tone Rules                      │
│  ⬜ Tone Marks                      │
│                                     │
│  ── STATS ──────────────────────    │
│  Consonants  ████░░░░  9/44        │
│  Vowels      ██░░░░░░  6/30        │
│  Streak      🔥 3 days             │
└─────────────────────────────────────┘
```

Tapping a group shows two options:
1. **Activate** (if locked) — adds items to active pool
2. **Drill** (if active) — starts a session with just this group

---

## 8. Implementation Status (updated 2026-04-02)

### Phase 1: Group Activation + Targeted Practice — DONE
- [x] Groups home screen with 17 groups, activation toggles, drill buttons
- [x] Targeted practice (Consonants / Vowels / Reading / Tones / All Active)
- [x] "Select all / Deselect all" per category
- [x] Quiz engine accepts arbitrary item pools
- [x] Lessons tab preserved, progress stats bar

### Phase 2: SRS + Daily Mix — DONE
- [x] Full SM-2 SRS (ease factor, intervals 1/3/ease*interval, lapses, leech detection)
- [x] Daily Mix (70% due / 30% new, 15-25 items, max 5 new per session)
- [x] Due count + new count on home screen
- [x] Wrong answer explanation popups with "Got it" dismiss
- [x] Re-queue wrong items 3-5 positions later

### Phase 3: Difficulty Stars + Quiz Variety — DONE
- [x] Base difficulty computed from data (same sound, visual similarity, rarity, etc.)
- [x] Dynamic difficulty adjustment (+1 on wrong, -1 after 3 correct in a row)
- [x] Stars + "Hard" badge displayed in quiz
- [x] 7 new quiz types: Char→Class, Odd One Out, Char→Sound, Position, Long/Short, Read Syllable, Build Syllable
- [x] Adaptive quiz type selection (easy types for new items, hard types for mastered/difficult)

### Phase 4: Reading Practice — LEVEL 1 DONE
- [x] Syllable generator (consonant + vowel combinations)
- [x] Read Syllable (Typ 12) / Build Syllable (Typ 13) quiz types
- [x] อ as silent initial consonant (อี = "ii", not "ɔii")
- [ ] **Level 2: + Tone marks** — see Future Work below
- [ ] **Level 3: + Final consonants** — see Future Work below
- [ ] **Level 4: Multi-syllable words** — see Future Work below

### Phase 5: Polish — DONE
- [x] Streak tracking (consecutive days, displayed on home screen)
- [x] Session stats (questions, accuracy, duration, unique items)
- [x] Leech detection + Focus Cards (shown before quizzing leech items)
- [x] Confusable character warnings in wrong-answer explanations
- [x] Leech interval cap (max 3 days, status persists until 3x correct)
- [x] New Item Introduction Cards (info card before first quiz of new character)

### Additional features (not in original spec)
- [x] "Practice All" button (all active items, consonants + vowels mixed)
- [x] Tone Practice (Typ 15: Class+Type→Tone, Typ 16: Mark+Class→Tone)
- [x] Pre-generated quiz questions support (for tone rules)

---

## 9. Future Work: Reading Levels 2-4 + Word Vocabulary

### Reading Level 2: Tone Marks on Syllables
**Aufwand: Mittel (1 Session)**

Silben mit Tonzeichen: กา → ก่า (gàa), ก้า (gâa), etc.

Voraussetzungen:
- Tonzeichen an kombinierte Silbe haengen (Unicode combining: Konsonant + Tonzeichen + Vokal-Teile)
- Ton berechnen: Konsonant-Klasse + Vokallaenge (lang/kurz) + Tonzeichen → einer von 5 Toenen
- Romanisierung mit Tondiakritika (Paiboon: à â á ǎ fuer low/falling/high/rising)
- Tonberechnungsregeln sind bereits als Daten in `lib/data/tones.ts` (TONE_RULES, TONE_MARK_RULES)

Neuer Quiz-Typ 14 (What Tone?): Zeige Silbe mit Tonzeichen → Welcher Ton?

Abhaengigkeit: `tone_marks` Gruppe muss aktiv sein.

### Reading Level 3: Final Consonants
**Aufwand: Hoch (1-2 Sessions)**

Geschlossene Silben: กาน (gaan), ดิน (din), จับ (jàp).

Voraussetzungen:
- Schlusskonsonant-Sound-Mapping: Thai hat nur 8 finale Sounds (k, t, p, n, m, ng, y, w), unabhaengig vom Anfangssound des Konsonanten. Z.B. ง/ณ/น am Ende = alle "n".
- Live/Dead-Erkennung aendert sich (Schlusskonsonant macht die Silbe "dead")
- Tonberechnung haengt von Live/Dead ab
- Deutlich mehr Kombinatorik: Anfangskonsonant x Vokal x Schlusskonsonant
- Neue Datenstruktur fuer finale Konsonant-Sounds

### Reading Level 4: Multi-Syllable Words
**Aufwand: Datenarbeit + Mittel**

Echte Thai-Woerter aus kuratierter Vokabelliste.

Voraussetzungen:
- Wortliste mit: Thai, Romanisierung (Paiboon), Bedeutung, Silbentrennung
- Woerter muessen nur aus gelernten Zeichen bestehen (filtern nach aktiven Gruppen)
- Kein algorithmisches Problem, reine Datenarbeit
- Integration in Quiz-System ueber bestehende Infrastruktur (WordItem Typ existiert bereits)

### Word Vocabulary Integration
**Aufwand: Klein (wenn Wortliste existiert)**

Woerter als eigene Gruppe oder als automatischer Pool wenn genug Zeichen aktiviert sind. Quiz-Typen: Wort lesen → Bedeutung, Bedeutung → Wort waehlen.

---

## 10. Architecture Reference (current state)

**Navigation:** 4 tabs: Lessons | Groups | Tones | SRS (+ dark mode toggle)

**Practice modes:** Daily Mix, All Active, Consonants, Vowels, Reading, Tones, Group Drill

**Quiz types (11 active):**
| ID | Type | Category |
|----|------|----------|
| 1 | Name→Thai | Consonants |
| 2 | Thai→Name | Consonants |
| 3 | Char→Class | Consonants (≥2 classes) |
| 5 | Odd One Out | Consonants (≥2 classes) |
| 6 | Char→Sound | Consonants |
| 7 | Name→Thai | Vowels |
| 8 | Thai→Name | Vowels |
| 9 | Position | Vowels |
| 10 | Long/Short | Vowels (with long/short) |
| 12 | Read Syllable | Reading |
| 13 | Build Syllable | Reading |
| 15 | Class+Type→Tone | Tones (rules) |
| 16 | Mark+Class→Tone | Tones (marks) |

**Key files:**
- `lib/srs.ts` — SM-2 algorithm, difficulty tracking, daily mix builder, explanations
- `lib/quiz-types.ts` — Quiz type system, adaptive selection, question generation
- `lib/syllables.ts` — Syllable combination engine (consonant + vowel → Thai + romanization)
- `lib/data/tones.ts` — Tone rule data + tone quiz question generator
- `lib/data/difficulty.ts` — Base difficulty map, confusable character detection
- `lib/streak.ts` — Consecutive day streak tracking
- `lib/data/groups.ts` — 17 character groups, helper functions
- `lib/data/types.ts` — All TypeScript interfaces (SRSCard, LessonItem, SyllableItem, etc.)
- `lib/storage.ts` — Supabase + localStorage persistence
- `app/components/Quiz.tsx` — Generic quiz: adaptive types, stats, focus cards, intro cards, explanations
- `app/components/Home.tsx` — Group management, practice buttons, streak, due counts
- `app/components/AppShell.tsx` — View routing, SRS answer handling, streak updates

**SRS fields:** thai, interval, ease, due, reps, lapses, category, status, difficulty, consecutiveCorrect

**UserProgress:** done[], srs{}, activeGroups[], streak?{current, lastPracticeDate}

**Supabase table `user_progress`:** user_id, completed_lessons, srs_cards (jsonb), active_groups (text[]), preferences (jsonb incl. dark + streak). Single user "fabian".
