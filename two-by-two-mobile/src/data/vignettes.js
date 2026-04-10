/**
 * Day-start vignettes — short flavor text shown at the start of each day.
 * Conditions are optional; unconditioned vignettes form the general pool.
 * Only one vignette shows per day, picked randomly from eligible pool.
 */

export const VIGNETTES = [
  // --- General (always eligible) ---
  { text: 'The radiator clanks awake at 6:30. Another day in Budapest.' },
  { text: 'Morning light filters through the thin curtains. The tram rattles past below.' },
  { text: 'You wake to the smell of bread from the pékség downstairs.' },
  { text: 'The alarm goes off. For a second you forget where you are.' },
  { text: 'Rain taps against the window. The city looks different when it\'s wet.' },
  { text: '6:30 AM. You can hear your companion breathing in the next bed.' },
  { text: 'The hot water works today. Small mercies.' },
  { text: 'Someone in the building is playing Beethoven. Badly.' },
  { text: 'You step outside and the cold hits you like a wall. Welcome to Hungary.' },
  { text: 'The elevator is broken again. Five flights of stairs it is.' },
  { text: 'Your shoes are still wet from yesterday. You put them on anyway.' },
  { text: 'The mission president\'s morning text: "Work hard. Stay faithful."' },
  { text: 'A pigeon watches you from the windowsill. It\'s been there all week.' },
  { text: 'The apartment smells like paprika from last night\'s cooking experiment.' },
  { text: 'You iron your white shirt. The collar is getting frayed.' },
  { text: 'Breakfast is bread with Nutella. Again. It\'s fine.' },
  { text: 'You can hear the Danube from here if you listen carefully. Or maybe it\'s traffic.' },
  { text: 'The morning light makes the parliament building glow gold across the river.' },
  { text: 'Your name tag is slightly crooked. You fix it without thinking.' },
  { text: 'Another day. Another chance to find someone who\'ll listen.' },

  // --- Low spirit (homesick / struggling) ---
  { text: 'You didn\'t sleep well. Home felt so close in your dreams.', condition: (s) => s.stats.spirit < 40 },
  { text: 'The weight on your chest is back. You breathe through it.', condition: (s) => s.stats.spirit < 30 },
  { text: 'You stare at the ceiling for ten minutes before getting up.', condition: (s) => s.stats.spirit < 35 },
  { text: 'Everything feels heavier today. Your shirt, your shoes, your purpose.', condition: (s) => s.stats.spirit < 25 },
  { text: 'You checked the calendar. Still so many weeks left.', condition: (s) => s.stats.spirit < 40 },
  { text: 'The thought of going outside makes your stomach clench.', condition: (s) => s.stats.spirit < 20 },

  // --- High spirit (on fire) ---
  { text: 'You wake up before the alarm. Today is going to be a great day.', condition: (s) => s.stats.spirit > 85 },
  { text: 'Something feels different this morning. Lighter. Better.', condition: (s) => s.stats.spirit > 80 },
  { text: 'You hum a hymn in the shower without realizing it.', condition: (s) => s.stats.spirit > 85 },
  { text: 'For the first time in a while, you feel exactly where you\'re supposed to be.', condition: (s) => s.stats.spirit > 90 },

  // --- Early mission (first 12 weeks) ---
  { text: 'Everything still smells foreign. You\'re starting to like it.', condition: (s) => s.week <= 12 },
  { text: 'You\'ve been here less than three months. It feels like a lifetime.', condition: (s) => s.week <= 12 },
  { text: 'You tried to order breakfast in Hungarian. The waitress answered in English.', condition: (s) => s.week <= 12 },
  { text: 'You accidentally took the wrong tram again. At least you know how to get back now.', condition: (s) => s.week <= 16 },

  // --- Mid mission (weeks 40-70) ---
  { text: 'You catch yourself thinking in Hungarian. When did that start?', condition: (s) => s.week >= 40 && s.week <= 70 },
  { text: 'Budapest feels less like a foreign city and more like home every day.', condition: (s) => s.week >= 40 && s.week <= 70 },
  { text: 'You navigate the metro without checking the map. You belong here now.', condition: (s) => s.week >= 50 && s.week <= 70 },

  // --- Late mission (weeks 80+) ---
  { text: 'You count the weeks left on your fingers. It\'s getting real.', condition: (s) => s.week >= 80 },
  { text: 'The mission is winding down. Every day matters more now.', condition: (s) => s.week >= 90 },
  { text: 'You look at Budapest differently now. Like you\'re already remembering it.', condition: (s) => s.week >= 85 },
  { text: 'Someone called you "the senior elder" yesterday. When did that happen?', condition: (s) => s.week >= 80 },
  { text: 'You realize you\'ll miss the tram, the bread, the cold. All of it.', condition: (s) => s.week >= 95 },
  { text: 'Last transfer. Make it count.', condition: (s) => s.week >= 98 },

  // --- Season-ish (rough week ranges for seasons) ---
  { text: 'Autumn in Budapest. The leaves on Margit-sziget are turning gold.', condition: (s) => s.week % 52 >= 35 && s.week % 52 <= 46 },
  { text: 'The first snow of winter dusts the city. It\'s beautiful and freezing.', condition: (s) => s.week % 52 >= 47 || s.week % 52 <= 8 },
  { text: 'Spring is here. The city feels alive again after the long grey winter.', condition: (s) => s.week % 52 >= 9 && s.week % 52 <= 20 },
  { text: 'Summer heat. The tram is a sauna. Your white shirt is see-through with sweat.', condition: (s) => s.week % 52 >= 21 && s.week % 52 <= 34 },

  // --- Companion rapport states ---
  { text: 'Your companion is already up and smiling. That\'s a good sign.', condition: (s) => s.companion.rapport >= 8 },
  { text: 'Silence at breakfast. Your companion stares at their cereal.', condition: (s) => s.companion.rapport <= 3 },
  { text: 'Your companion left a note: "Good morning, Elder. Today will be great."', condition: (s) => s.companion.rapport >= 9 },
  { text: 'Your companion is facing the wall. You eat breakfast in silence.', condition: (s) => s.companion.rapport <= 2 },

  // --- Budget ---
  { text: 'You count the forints in your wallet. It\'s going to be a tight week.', condition: (s) => s.stats.budget < 10000 },
  { text: 'The stipend just hit. You feel rich. Relatively speaking.', condition: (s) => s.week % 4 === 1 && s.stats.budget > 40000 },

  // --- After events ---
  { text: 'The stray cat is waiting outside the door again. It remembers you.', condition: (s) => s.catAdopted },

  // --- Monday specific (day 0) ---
  { text: 'Monday. A fresh start. The whole week stretches ahead of you.', condition: (s) => s.day === 0 },

  // --- Saturday (day 5, last workday before P-Day) ---
  { text: 'Almost P-Day. One more push.', condition: (s) => s.day === 5 },

  // --- Language milestones ---
  { text: 'You understood a whole conversation on the tram yesterday. Milestone.', condition: (s) => s.stats.language >= 40 && s.stats.language <= 45 },
  { text: 'An old woman on the bus complimented your Hungarian. You\'re flying now.', condition: (s) => s.stats.language >= 60 && s.stats.language <= 65 },
  { text: 'You dreamed in Hungarian last night. That\'s a first.', condition: (s) => s.stats.language >= 50 && s.stats.language <= 55 },
]

/**
 * Pick a vignette for the current game state.
 * Conditional vignettes are preferred (75% chance) if any match.
 * @param {object} state - Current game state
 * @returns {string|null} A vignette text or null
 */
export function pickVignette(state) {
  const conditional = VIGNETTES.filter((v) => v.condition && v.condition(state))
  const general = VIGNETTES.filter((v) => !v.condition)

  // 75% chance to use a conditional vignette if any match; otherwise general
  const pool = conditional.length > 0 && Math.random() < 0.75 ? conditional : general

  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)].text
}
