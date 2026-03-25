# TWO BY TWO — Claude Code Project Brief

## What this is

A browser-based management sim where you play as an 18-year-old Mormon missionary in Budapest, Hungary. You allocate time across competing priorities (language study, contacting, teaching, companion bonding, etc.) over a 24-month mission. The goal is to baptize as many investigators as possible while managing your spirit, budget, language skills, obedience, and companion relationship.

**Tone:** Affectionate satire. Funny, specific, occasionally poignant. Think Papers, Please meets Stardew Valley, raised in a chapel.

**Reference the full GDD** (`two-by-two-gdd.md`) for complete system design. This doc is the technical implementation spec.

---

## Tech Stack

- **Framework:** React 18+ with Vite
- **Styling:** CSS Modules or Tailwind (your call — the UI mockup uses a custom dark palette, see below)
- **State:** Zustand (lightweight, good for game state) or useReducer if you prefer zero deps
- **Save system:** Export/import JSON save files (NOT localStorage — doesn't work in some artifact contexts)
- **Routing:** None needed — single page, screen states managed in game state
- **No backend.** Everything client-side.
- **Target:** Desktop-first, responsive down to tablet. Not mobile-optimized yet.

---

## Design System

### Palette (from UI mockup)
```css
--bg-dark: #1a1714;
--panel: #2a2520;
--panel-light: #352f29;
--border: #4a4035;
--border-light: #5a5045;
--text: #e8ddd0;
--text-dim: #9a8e80;
--text-muted: #6a5e50;
--accent: #c4793c;        /* primary action color */
--accent-bright: #e89850;
--spirit: #5b8fb9;         /* blue */
--language: #7ab648;       /* green */
--budget: #c9b458;         /* gold */
--skills: #b05baa;         /* purple */
--obedience: #c45b5b;      /* red */
--rapport: #5bbab0;        /* teal */
--success: #6abf69;
--danger: #c45b5b;
```

### Typography
- **Headers / Game UI labels:** `Silkscreen` (Google Fonts) — pixel font for that retro management sim feel
- **Body / descriptions / events:** `DM Sans` (Google Fonts) — clean and readable
- Keep font sizes small: 10-13px for most UI, 12px for event text, 16px max for title

### Layout
- Max width: ~720px centered
- Dark background, card-based panels with 1px borders
- Stat bars are thin (6px) with colored fills
- The UI mockup widget above is your visual target

---

## Architecture

### Game State Shape
```typescript
interface GameState {
  screen: 'title' | 'game' | 'event' | 'pday' | 'transfer' | 'summary' | 'endgame';
  
  // Time
  day: number;           // 0-6 within the week (6 = P-Day)
  week: number;          // 1-104
  transfer: number;      // 1-17 (every 6 weeks)
  
  // Core stats (all 0-100 except budget)
  stats: {
    language: number;    // starts 8
    spirit: number;      // starts 75
    skills: number;      // starts 10
    obedience: number;   // starts 80
    budget: number;      // starts ~45000 HUF per month
  };
  
  // Companion
  companion: {
    name: string;
    archetype: string;   // "The Greenie", "The Trunky Senior", etc.
    rapport: number;     // 0-10
    traits: string[];
    quotes: { happy: string[]; neutral: string[]; unhappy: string[] };
  };
  
  // Investigators (the pipeline)
  investigators: Investigator[];
  
  // Schedule for current day
  schedule: {
    morning: ActivityId | null;
    afternoon: ActivityId | null;
    evening: ActivityId | null;
  };
  
  // Event queue
  pendingEvent: RandomEvent | null;
  eventLog: EventLogEntry[];
  
  // Scoring
  baptisms: number;
  totalConnections: number;
  
  // Flags
  laundryWeeksSkipped: number;
  catAdopted: boolean;
  // etc — add as needed
}

interface Investigator {
  id: string;
  name: string;
  personality: string;   // "The Seeker", "English Student", etc.
  stage: number;         // 0-6 (Contact through Baptized)
  warmth: number;        // 0-10
  weeksSinceContact: number;
  objections: string[];
  isActive: boolean;
}
```

### Core Loop Flow
```
1. DAILY VIEW (Mon-Sat)
   → Player assigns activities to 3 time slots
   → "End Day" button
   → Resolve effects (stat changes, investigator progression, random rolls)
   → Possibly trigger a Random Event (modal overlay with choices)
   → Advance to next day

2. P-DAY (Sunday)
   → Different activity pool (letters home, laundry, explore, sports, etc.)
   → Player picks 3 activities
   → Resolve effects
   → Show weekly summary

3. WEEKLY SUMMARY
   → Stat changes this week
   → Investigator pipeline status
   → Companion mood
   → Budget remaining
   → "Continue" to next week

4. TRANSFER (every 6 weeks)
   → New companion assigned (random from pool)
   → Zone Conference event
   → Mission President interview (stat check → possible calling change)
   → Fresh start feeling

5. ENDGAME (week 104)
   → Homecoming Talk summary
   → Final scoring across all dimensions
   → Ending archetype revealed
```

### Activity Effect Resolution
Each activity has an effects map with [min, max] ranges. Roll randomly within range.

```typescript
const ACTIVITIES = {
  study_language: {
    label: "Study Hungarian",
    effects: { language: [3,5], spirit: [-2,1], skills: [0,1] },
    description: "Flashcards, grammar drills, repeat 'köszönöm' 47 times."
  },
  street_contact: {
    label: "Street Contacting", 
    effects: { language: [1,3], spirit: [-3,2], skills: [1,2] },
    description: "Stand on Deák tér and talk to strangers. What could go wrong?"
  },
  teach_lesson: {
    label: "Teach Investigator",
    effects: { skills: [2,3], language: [1,2], spirit: [0,3] },
    // Also advances a random active investigator's stage (probability check)
  },
  // ... etc (see GDD for full list)
};
```

### Random Event System
- Each day has a ~30% chance of triggering an event
- Events are drawn from a pool, weighted by current state (e.g., homesickness events more likely when Spirit < 40)
- Each event has 2 choices with different risk/reward profiles
- Each choice has a `result_good` and `result_bad` outcome (50/50 or modified by relevant stats)

### Investigator Progression
- When player picks "Teach Investigator", select the highest-warmth active investigator
- Roll for progression: base 30% + (Skills/100 * 20%) + (Language/100 * 20%) = up to 70% at max stats
- On success: advance stage by 1
- On fail: warmth -1 (they're getting impatient)
- All investigators lose 1 warmth per week if not visited
- At warmth 0: investigator drops (gone forever)
- At stage 6 (Interview) → automatic baptism on next successful teach → stage 7 (Baptized!)

---

## Screens to Build

### 1. Title Screen
- Game title "TWO BY TWO" in pixel font
- Subtitle: "A Mormon Missionary Management Sim"
- "New Mission" button
- (Later: "Load Save" button)
- Brief flavor text: "Budapest, Hungary — 2004"

### 2. Intro / MTC Sequence (simple)
- 2-3 text screens with "Next" buttons
- Set the scene: you're at the MTC, you've been called to Budapest, here's your first companion
- Show starting stats

### 3. Daily View (main game screen — see UI mockup)
- Header: game title, current day, week counter
- 6 stat bars in two rows of 3
- Main area: schedule panel (3 time slots with activity buttons) + side panel (companion + investigators)
- Random event overlay (when triggered)
- Footer: week progress dots + End Day button

### 4. P-Day View
- Same layout but different activity pool
- Maybe slightly different vibe (more relaxed colors?)

### 5. Weekly Summary
- Stat deltas (↑ Language +12, ↓ Spirit -5, etc.)
- Investigator pipeline visual
- Notable events this week
- Budget summary
- "Continue" button

### 6. Transfer Screen
- "Transfer Day" announcement
- Old companion farewell
- New companion reveal (name, archetype, traits)
- Mission President feedback
- Possible calling change

### 7. Endgame / Homecoming Talk
- Narrative summary pulling from accumulated stats and events
- Final scores revealed
- Ending archetype
- "Play Again" button

---

## MVP Scope (Build This First)

Start with a **one-week vertical slice** to prove the core loop:

1. Title screen → start game
2. Daily view with all 6 stat tracks
3. 3 time slots with ~8 activities to choose from
4. 1 fixed companion (Elder Thompson, The Greenie)
5. 2 starting investigators (one promising, one time-waster)
6. ~8 random events in the pool
7. P-Day with its own activity set
8. End-of-week summary
9. Basic stat resolution and investigator progression

**Don't build yet:** Transfer system, endgame, save/load, multiple companions, leadership track, seasonal events, the full 104-week timeline.

Once the one-week loop feels fun, we expand.

---

## Content: Starter Data

### Random Events (implement these 8 first)
1. Tram debate about Book of Abraham
2. Sister Kovács kocsonya incident
3. Package from home
4. Stray cat adoption opportunity
5. Heating breaks at -12°C
6. JW missionary contacts YOU
7. Companion's Hungarian language fail ("golden potatoes")
8. Zone Conference training assignment

(Full event text and choice/effect data in the GDD)

### Companion Pool (for later, start with just Thompson)
- Elder Thompson (The Greenie)
- Elder Davis (The Trunky Senior)
- Elder Park (The Zone Leader)
- Elder Jensen (The Secret Gamer)
- Elder Santos (The True Believer)
- Elder Horváth (The Convert)
- Elder Williams (The Homesick Kid)

### Investigator Pool (start with 2, add more as game progresses)
- Szabó Péter (The Seeker) — starts warm, progresses fast
- Kiss Ági (English Student) — wants free English practice, slow to convert
- (Later) Nagy Gábor (The Debater), Tóth Eszter (The Lonely Elder), Farkas Bence (Family Referral)

### Hungarian Flavor Text
- Street names: Váci utca, Deák tér, Andrássy út, Dózsa György út
- Foods: paprikás, kocsonya, palacsinta, lángos, túró rudi
- Weather: Budapest winters are brutal (-10 to -15°C Dec-Feb), summers are hot
- Transit: Trams 4/6, Metro lines, BKV pass
- Currency: Hungarian Forints (HUF) — monthly stipend ~45,000 Ft in 2004

---

## File Structure Suggestion
```
two-by-two/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── store/
│   │   └── gameStore.js          # Zustand store
│   ├── data/
│   │   ├── activities.js         # Activity definitions + effects
│   │   ├── events.js             # Random event pool
│   │   ├── companions.js         # Companion archetypes
│   │   ├── investigators.js      # Investigator personality types
│   │   └── constants.js          # Tuning knobs (event probability, stat caps, etc.)
│   ├── screens/
│   │   ├── TitleScreen.jsx
│   │   ├── DailyView.jsx         # Main game screen
│   │   ├── PDayView.jsx
│   │   ├── WeeklySummary.jsx
│   │   ├── TransferScreen.jsx
│   │   └── EndgameScreen.jsx
│   ├── components/
│   │   ├── StatBar.jsx
│   │   ├── CompanionCard.jsx
│   │   ├── InvestigatorCard.jsx
│   │   ├── EventModal.jsx
│   │   ├── ActivitySelector.jsx
│   │   └── WeekProgress.jsx
│   ├── engine/
│   │   ├── resolveDay.js         # Process daily choices → stat changes
│   │   ├── resolveEvent.js       # Process event choice → outcomes
│   │   ├── investigatorEngine.js # Progression, decay, dropout logic
│   │   └── companionEngine.js    # Rapport, quotes, mood
│   └── styles/
│       ├── variables.css          # The palette + typography
│       └── global.css
├── index.html
├── package.json
└── vite.config.js
```

---

## Notes for Claude Code

- **Prioritize feel over completeness.** A polished one-week loop with good animations and satisfying feedback beats a feature-complete skeleton that feels lifeless.
- **The humor is in the writing.** Event text, companion quotes, activity descriptions — these carry the tone. Be specific (Budapest details, real Hungarian words, real missionary culture).
- **Stat numbers should be visible when they change.** Show "+3 Language" floating text or a brief highlight on the stat bar. Feedback is everything in management sims.
- **Sound is NOT needed yet.** Visual feedback only for v1.
- **Test the balance** by playing through a few weeks. If Language never gets above 20, or Spirit always crashes, the constants need tuning. Keep all tuning knobs in `constants.js` so they're easy to tweak.
