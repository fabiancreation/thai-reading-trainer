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

## 8. Implementation Phases

### Phase 1: Group Activation + Targeted Practice — DONE (2026-04-02)
- [x] Restructure home screen into groups (Groups tab with all 17 groups)
- [x] Add group activation toggle (tap to activate/deactivate)
- [x] "Drill this group" button on each active group
- [x] Targeted practice buttons (Consonants / Vowels / Reading / Tones)
- [x] Anti-confusion logic: separate pools per quiz question
- [x] Quiz engine refactored to accept arbitrary item pools (not lesson-based)
- [x] Lessons tab preserved as separate overview with detail drill-down
- [x] `activeGroups` persisted to Supabase + localStorage
- [x] Progress stats bar (consonants/vowels) on Groups home screen

**Not yet done from Phase 1 spec:**
- [ ] Reading practice button — UI present but disabled ("Coming soon"), needs syllable generator (Phase 4)
- [ ] Tones practice button — UI present but disabled ("Coming soon"), needs tone quiz types (Phase 3)

### Phase 2: SRS + Daily Mix
- [ ] Implement full SM-2 SRS per card (current SRS is simplified: interval doubles on correct, resets on wrong, no ease factor adjustment)
- [ ] Build daily mix session (due items + new items)
- [ ] Due count on home screen
- [ ] Wrong answer explanation popups
- [ ] Re-queue wrong items within session

### Phase 3: Difficulty Stars + Quiz Variety
- [ ] Assign baseDifficulty to all items
- [ ] Display stars on cards
- [ ] Dynamic star adjustment after reviews
- [ ] Add quiz types: Char→Class, Position, Long/Short, Odd One Out
- [ ] Adaptive quiz type selection based on mastery

### Phase 4: Reading Practice
- [ ] Syllable generator from active consonant + vowel pools
- [ ] Read Syllable / Build Syllable / What Tone quiz types
- [ ] Progressive difficulty levels
- [ ] Word vocabulary integration

### Phase 5: Polish
- [ ] Streak tracking
- [ ] Session stats (accuracy, time, items reviewed)
- [ ] Leech detection + focus cards
- [ ] Confusable character warnings
- [ ] Course script import (Option C)

---

## 9. Handoff Notes (for continuing in a new chat)

### Architecture after Phase 1

**Navigation:** 4 tabs: Lessons | Groups | Tones | SRS (+ dark mode toggle)

**Key files changed/added in Phase 1:**
- `lib/data/groups.ts` — NEW: defines all 17 character groups (4 consonant, 11 vowel, 2 tone) with IDs, categories, helper functions (`getActiveConsonants`, `getActiveVowels`, `hasActiveConsonants`, etc.)
- `lib/data/types.ts` — added `activeGroups: string[]` to `UserProgress`
- `lib/storage.ts` — persists `activeGroups` to Supabase (`active_groups` column) + localStorage
- `app/components/Home.tsx` — Groups home screen: activation toggles, targeted practice buttons, drill buttons, progress stats
- `app/components/Quiz.tsx` — refactored: accepts `pool: QuizItem[]` + optional `title` instead of a `Lesson` object
- `app/components/AppShell.tsx` — new view routing: `home` (groups), `lessons` (list), `lesson` (detail), `tones`, `flash`, `practice`
- `app/components/Lesson.tsx` — passes `pool` to Quiz instead of `lesson`
- `data/002_add_active_groups.sql` — migration to add `active_groups text[]` column to Supabase

**Group IDs:** `con_mid`, `con_high`, `con_low_paired`, `con_low_sonorant`, `vow_aa_a`, `vow_ii_i`, `vow_uu_u`, `vow_ʉʉ_ʉ`, `vow_ee_e`, `vow_ɛɛ_ɛ`, `vow_oo_o`, `vow_ɔɔ_ɔ`, `vow_əə_ə`, `vow_diphthongs`, `vow_special`, `tone_rules`, `tone_marks`

**Data flow:** User toggles group → `updateProgress` updates `activeGroups[]` → saved to Supabase/localStorage → practice buttons read from `activeGroups` to build item pools → Quiz receives pool directly

**Current quiz types (2 only):** Name→Char, Char→Name. More quiz types planned in Phase 3.

**Current SRS (simplified):** Interval doubles on correct (max 30 days), resets to 0 on wrong. No ease factor adjustment yet. Full SM-2 planned for Phase 2.

**Supabase table `user_progress`:** `user_id text`, `completed_lessons integer[]`, `srs_cards jsonb`, `active_groups text[]`, `preferences jsonb`, timestamps. Single user "fabian" for now.
