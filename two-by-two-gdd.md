# TWO BY TWO
### A Mormon Missionary Management Sim
---

## Elevator Pitch

You're an 18-year-old Elder, fresh off the plane in Budapest, Hungary. You have 24 months, a name tag, a Book of Mormon, and approximately zero Hungarian vocabulary. Allocate your time, manage your companion, nurture investigators, survive on a shoestring budget, and try to baptize as many people as possible before your mission ends — without losing your mind, your testimony, or your appetite for kocsonya.

**Genre:** Management sim / narrative strategy
**Platform:** Web (browser-based)
**Tone:** Affectionate satire — funny, authentic, occasionally poignant. Think *Papers, Please* meets *Stardew Valley*, raised in a chapel.
**Session Length:** 5–15 minutes per in-game week. Full playthrough ≈ 4–6 hours.

---

## 1. Core Loop

Each in-game **day** the player allocates time blocks (Morning, Afternoon, Evening) across activities. Each **week** ends with P-Day (Preparation Day) — a special free-choice day. Every **6 weeks** is a Transfer, where companions rotate and stats are evaluated.

```
Daily Cycle:
  Morning   → Study / Language / Companion bonding
  Afternoon → Contacting / Teaching / Service
  Evening   → Teaching / Member visits / Personal time
  
Weekly Cycle:
  Mon–Sat   → Daily cycle
  P-Day     → Laundry, Letters home, Exploration, Shopping, Sports
  
Transfer Cycle (every 6 weeks):
  Companion assignment
  Zone Conference
  Mission President interview
  Stats evaluation → potential calling changes
```

**The Calendar:** The game spans 104 weeks (24 months). A persistent calendar shows progress, upcoming events, holidays, and deadlines. Time is the only resource you can never get back.

---

## 2. The Six Pillars (Resource Tracks)

### 2.1 Language (0–100)
- Starts at 5 (you learned "szia" at the MTC)
- Improves through: Study (+steady, slow), Conversations (+fast, risky), Teaching (+moderate)
- Affects: Teaching effectiveness, contacting success, random event outcomes
- Milestones: 20 (basic survival), 40 (simple lessons), 60 (real conversations), 80 (fluent teaching), 95+ (locals think you're Hungarian-American)
- Decay: None (language only goes up, but plateaus require active study)

### 2.2 Spirit (0–100)
- Starts at 75 (nervous but eager)
- Rises from: Letters home, baptisms, good companion rapport, member meals, small victories, P-Day activities
- Drops from: Rejection, homesickness events, companion conflicts, bad weather streaks, holidays away from family, investigator dropoffs
- Below 30: "Trunky" state — reduced effectiveness across all activities
- Below 10: Crisis event triggers (Mission President intervention)
- Above 90: "On fire" bonus — increased charisma in all interactions

### 2.3 Connections (Pipeline)
- Not a single number — a list of active **Investigators** (NPCs), each with their own state
- New connections come from: Street contacting, referrals from members, English class, community events
- Each connection has: Name, Warmth (0–10), Stage (Contact → Lessons → Progressing → Baptismal Date → Baptism), Personality traits, Objections
- Connections decay if neglected (Warmth drops weekly without visits)
- Some connections are "golden" (fast progression), most are slow, some are time-wasters (just want free English practice)

### 2.4 Skills (0–100)
- Composite of sub-skills:
  - **Teaching:** How well you deliver lessons (affects investigator progression)
  - **Contacting:** Door approach, street stop technique (affects new connection rate)
  - **Objection Handling:** Responding to tough questions ("What about polygamy?", "Why can't I drink coffee?")
- Improves through: Study, practice (teaching), companion mentoring, Zone Conference workshops
- High skill + low language = frustrating (you know what to say but can't say it)
- Low skill + high language = awkward (you can talk fluently about nothing useful)

### 2.5 Budget (Forints per month)
- Fixed monthly stipend (modest — based on real missionary allowances adjusted for Hungary)
- Expenses: Food (daily), Transit pass (monthly), Supplies (teaching materials, batteries, etc.), Clothing maintenance
- Choices: Cook at home (cheap, time cost) vs. eat out (expensive, time saved) vs. member dinners (free but costs Connection maintenance)
- Surplus: Can buy small luxuries (American snacks at the import store, a nice journal)
- Deficit: Debt accumulates, stress increases (Spirit penalty), companion may report you
- **Black market peanut butter** is a real mechanic. It exists. It costs a fortune.

### 2.6 Obedience (0–100)
- Starts at 80 (good kid, still adjusting)
- The "invisible hand" — affects things you don't always see
- High obedience: Mission President trust, leadership callings, "blessings" (small RNG bonuses across all activities)
- Low obedience: More personal freedom, access to "off-limits" events (tourist sites, unapproved movies at a member's house, sleeping in), but risk of consequences
- Tracked by: Wake-up time adherence, study habits, curfew, dress code, companion reporting
- **Key tension:** Obedience and Spirit don't always move together. Following every rule can drain Spirit; breaking rules can restore it — but at a cost.

---

## 3. Key Systems

### 3.1 Companion System
- New companion assigned every Transfer (6 weeks), sometimes mid-transfer for special reasons
- **You never choose your companion**
- Companions are procedurally generated from a trait pool:

| Archetype | Traits | Effect |
|-----------|--------|--------|
| The Greenie | Nervous, eager, asks too many questions | Slower progress, but high Spirit boost if you mentor well |
| The Trunky Senior | Counting days, mentally home | Low motivation, may refuse activities, Spirit drain |
| The Zone Leader | Ambitious, by-the-book, statistically obsessed | Obedience pressure, but Skills boost from drilling |
| The Secret Gamer | Hides a Game Boy, stays up late | Fun but Obedience risk, Spirit boost from shared secret |
| The True Believer | Intense, never stops working | High productivity, but Spirit drain from relentlessness |
| The Convert | Baptized 2 years ago, passionate | Great with investigators, language advantage |
| The Homesick Kid | First time away from home, cries at night | Spirit drain, but bonding opportunity |

- **Companion Rapport** (0–10): Affects daily effectiveness. High rapport = bonus to all activities. Low rapport = penalties and possible conflict events.
- **24/7 rule:** You are always with your companion. Always. This is both gameplay constraint and comedy engine.

### 3.2 Investigator Pipeline

Each investigator progresses through stages:

```
Street Contact → First Lesson → Second Lesson → Third Lesson → 
Fourth Lesson → Baptismal Date Set → Baptismal Interview → Baptism
```

At each stage, there's a probability of:
- **Progression** (affected by your Teaching skill, Language, and their personality)
- **Stalling** (they need more time — Warmth must be maintained)
- **Backsliding** (they cool off — Warmth drops, may revert a stage)
- **Dropping** (they ghost you entirely — connection lost)

**Investigator Personality Traits:**
- The Seeker (genuinely curious, fast progression)
- The Socializer (loves the missionaries, attends everything, never commits)
- The Debater (wants to argue theology — fun but slow)
- The Lonely Elder (wants company, not religion)
- The Family Referral (member's relative, starts warm but fragile)
- The English Student (there for free English, might accidentally get baptized)
- The Skeptic (hard to crack but solid if converted)

**Post-Baptism:** Baptized investigators don't vanish. They become members who can provide referrals, dinner invitations, and Spirit boosts — or they go inactive, which costs you Spirit.

### 3.3 The Calendar & Events

**Seasonal Events:**
- **Christmas:** Massive homesickness spike. Special P-Day. Members invite you for dinner.
- **Easter:** Teaching opportunity (Christ-focused lessons get bonus)
- **Hungarian holidays:** August 20 (St. Stephen's Day), October 23 (Revolution Day) — unique contacting opportunities
- **Transfer Day:** Anxiety, new companion, fresh start or dreaded pairing

**Random Events (sampled weekly):**
- Drunk man on tram wants to debate the Book of Abraham
- Sister Kovács made kocsonya (meat jelly). Will save required.
- Companion found a stray cat. Do you adopt it? (Obedience risk, Spirit boost)
- Your investigator's family intervenes — they're pulling them away
- Package from home arrives (Spirit boost, but what's inside?)
- Zone Leader announces a baptism challenge (pressure vs. motivation)
- It's -15°C and your apartment heating is broken
- You accidentally say something wildly inappropriate in Hungarian (Language check)
- A JW missionary tries to contact YOU on the street

### 3.4 P-Day System

One day per week, you choose from:
- **Letters home** (+Spirit, story content)
- **Laundry** (mandatory every 2 weeks or Obedience/Spirit penalties)
- **Explore the city** (hidden events, cultural discovery, small Obedience risk)
- **Sports with members** (+Connection, +Spirit, injury risk)
- **Shopping** (Budget management, possible luxury purchases)
- **Study** (Language/Skills boost, but at the cost of rest)
- **Companion activity** (+Rapport, variable outcomes based on companion type)

### 3.5 Mission Leadership Track

Based on cumulative performance, you may be called to leadership positions:

```
Regular Missionary → District Leader → Zone Leader → Assistant to the President (AP)
```

Each level adds:
- **Responsibilities:** More meetings, more reporting, less personal teaching time
- **Perks:** Respect, influence over transfers, Mission President access
- **Pressure:** Higher expectations, visible failure

Being an AP is the "prestige ending" path — but it's a treadmill. The best baptism numbers often come from missionaries who stay in the field.

---

## 4. Scoring & Endgame

### Primary Score: Baptisms
The number everyone asks about. Displayed prominently. The "obvious" metric.

### Hidden Scores (revealed at end):
- **Relationships maintained** — how many investigators stayed active post-baptism?
- **Language mastery** — final fluency level
- **Personal growth** — composite of Spirit stability, companion relationships, crisis management
- **Cultural immersion** — how much of Budapest did you actually experience?
- **Companion impact** — did your companions do better or worse after being paired with you?

### The Homecoming Talk
The endgame summary is delivered as a **sacrament meeting homecoming talk** — narrated in that very specific cadence. Your stats are woven into the narrative. Multiple endings based on different scoring profiles:

- **The Golden Missionary:** High baptisms, high obedience, leadership track. The bishop weeps.
- **The Cultural Ambassador:** Low baptisms, high language, high cultural immersion. You learned more about Hungary than the church.
- **The Burnout:** Started strong, crashed mid-mission. Came home early or limped to the finish.
- **The Quiet Servant:** Moderate everything, but every investigator you taught stayed active. The real MVP.
- **The Rebel with a Cause:** Low obedience, but genuine connections and surprising baptisms. The Mission President has mixed feelings.
- **The Companion Whisperer:** Your companions always thrived after serving with you. Leadership material.

---

## 5. Tone & Writing Guidelines

- **Insider humor**: The game rewards people who know the culture, but shouldn't exclude those who don't. Every Mormon-specific term should be learnable in context.
- **Affectionate, not mean**: We're laughing WITH missionaries (and ourselves), not AT them. These are 18-year-old kids doing something genuinely hard. The comedy comes from the absurdity of the situation, not mockery of belief.
- **Specificity over generality**: Hungarian details matter. Real street names, real foods, real weather. The specificity IS the humor.
- **Moments of genuine emotion**: The game should occasionally hit you in the chest. A letter from your mom. An investigator who genuinely changed. A companion who became a lifelong friend. The funny makes the sincere land harder.
- **The church is the backdrop, not the target**: The game is about the human experience of being young, far from home, doing something weird and difficult. The LDS-specific elements are the texture, not the punchline.

---

## 6. Art Direction

- **Style:** Pixel art, warm but slightly desaturated palette
- **Palette:** Budapest in autumn — ochre, slate, warm grey, faded teal, paprika red accents
- **UI:** Clean, slightly retro — inspired by 90s/2000s management sims
- **Character art:** Simple but expressive pixel portraits. White shirts, name tags, backpacks.
- **Environment:** Iconic Budapest landmarks as pixel art backgrounds — Parliament, Chain Bridge, Gellért Hill, crumbling Pest apartment blocks, tram stops in the rain

---

## 7. Technical Scope (Web)

- **Framework:** React (single-page app)
- **State management:** Local state (no backend needed for v1)
- **Save system:** LocalStorage or exportable save file
- **Responsive:** Desktop-first, but playable on tablet/mobile
- **No accounts, no server:** Everything runs client-side
- **Target:** ~2MB total bundle size, instant load

---

## 8. MVP Scope (Prototype)

The first playable version should include:

1. **One in-game week** (7 days of time allocation)
2. **Three resource tracks** (Language, Spirit, Budget) — simplified
3. **One companion** (fixed, with basic rapport)
4. **Two investigators** (one promising, one time-waster)
5. **Basic random events** (3–5 events from a pool)
6. **P-Day choices** (simplified)
7. **End-of-week summary** with stats

This proves the core loop: "Does allocating time across competing priorities feel fun and meaningful?"

---

*Document version 1.0 — Two by Two Game Design Document*
*Created for Levi — March 2026*
