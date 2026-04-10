/**
 * 7 Companion Archetypes
 * Each has unique mechanical modifiers, rapport behavior, and personality.
 */
export const COMPANIONS = [
  {
    id: 'thompson',
    name: 'Elder Thompson',
    archetype: 'The Greenie',
    traits: ['nervous', 'eager', 'asks_too_many_questions'],
    initialRapport: 5,
    // Mechanical modifiers
    statModifiers: { language: 0, spirit: 0, skills: 0, obedience: 0.1 },
    rapportDecayRate: 1, // normal
    walkSpeed: 1, // normal
    likedActivities: ['personal_study', 'companion_study'],
    dislikedActivities: ['street_contact', 'tracting'],
    description: 'Fresh from Provo, UT. Memorized every discussion in English but panics when Hungarians talk to him. Brought three jars of peanut butter.',
    weekRange: [1, 24], // when they might appear
    quotes: {
      happy: [
        'Can you believe we get to be here?!',
        'I actually understood that whole sentence!',
        'This is the best mission in the whole church!',
        'That lady on the tram smiled at us!',
        'My Hungarian is getting so good, right? ...Right?',
      ],
      neutral: [
        'So... what are we doing next?',
        'I tried kocsonya. I have thoughts.',
        'How do you say "where is the bathroom" again?',
        'Do you think the Zone Leader likes us?',
        'Is palacsinta just a crepe? Because I love crepes.',
      ],
      unhappy: [
        'I just want to go home.',
        'You never let me teach.',
        'Are we even making a difference?',
        'I called my mom today. Don\'t tell anyone.',
        'Three more semesters of this...',
      ],
    },
  },
  {
    id: 'nagy',
    name: 'Elder Nagy',
    archetype: 'The Convert',
    traits: ['empathetic', 'spiritual', 'sensitive'],
    initialRapport: 6,
    statModifiers: { language: 0.15, spirit: 0.1, skills: 0, obedience: 0 },
    rapportDecayRate: 0.5, // slow — patient and understanding
    walkSpeed: 1,
    likedActivities: ['personal_study', 'teach_lesson', 'member_visit'],
    dislikedActivities: ['buy_peanut_butter'],
    description: 'Hungarian-American convert of 3 years. Speaks decent Hungarian from his grandparents. Quietly intense about the work. Cries during every testimony meeting.',
    weekRange: [1, 104],
    quotes: {
      happy: [
        'The Spirit was so strong in that lesson.',
        'My nagymama would be so proud of us.',
        'I feel like we\'re exactly where we need to be.',
        'Did you feel that? In the lesson? That was real.',
        'I made lángos from my grandmother\'s recipe!',
      ],
      neutral: [
        'We should fast about this investigator.',
        'Want to hear about my conversion story again?',
        'The language is coming back to me, slowly.',
        'I miss my family but I know this is right.',
        'Have you tried túró rudi? Life changing.',
      ],
      unhappy: [
        'I\'m not sure I\'m strong enough for this.',
        'Maybe I was wrong to come here.',
        'I feel like I\'m failing everyone.',
        'My parents don\'t even write back anymore.',
        'Do you even care about any of this?',
      ],
    },
  },
  {
    id: 'wright',
    name: 'Elder Wright',
    archetype: 'Trunky Senior',
    traits: ['experienced', 'cynical', 'counting_days'],
    initialRapport: 4,
    statModifiers: { language: 0, spirit: -0.1, skills: 0.15, obedience: -0.1 },
    rapportDecayRate: 2, // fast — hard to keep happy
    walkSpeed: 0.8, // drags feet
    likedActivities: ['explore_city', 'sports', 'buy_food'],
    dislikedActivities: ['personal_study', 'tracting', 'companion_study'],
    description: 'Has 3 months left and a girlfriend waiting in Rexburg. Knows every shortcut, every rule worth bending. Incredible teacher when he bothers to try.',
    weekRange: [52, 104],
    quotes: {
      happy: [
        'Okay fine, that was a good lesson.',
        'Only 87 more days. Not that I\'m counting.',
        'You know what, you\'re alright, Elder.',
        'I\'ll actually miss this kebab stand.',
        'Maybe I should try harder these last few weeks.',
      ],
      neutral: [
        'Did I tell you about my girlfriend?',
        'We could skip district meeting. Nobody would notice.',
        'I already know how this investigator conversation ends.',
        'The trick is to look busy when the ZL calls.',
        'Back home I\'m gonna eat so much Chick-fil-A.',
      ],
      unhappy: [
        'I didn\'t sign up for this.',
        'You remind me of every greenie I\'ve ever had.',
        'Two years of my life. For what?',
        'I\'m calling the mission president.',
        'Stop trying so hard. It\'s exhausting.',
      ],
    },
  },
  {
    id: 'park',
    name: 'Elder Park',
    archetype: 'The Zone Leader',
    traits: ['driven', 'perfectionist', 'by_the_book'],
    initialRapport: 5,
    statModifiers: { language: 0, spirit: 0, skills: 0.1, obedience: 0.2 },
    rapportDecayRate: 1.5, // demands a lot
    walkSpeed: 1.2, // power walker
    likedActivities: ['companion_study', 'teach_lesson', 'personal_study'],
    dislikedActivities: ['explore_city', 'sports'],
    description: 'Zone Leader material. Wakes up at 5:30 for extra study. Irons his shirts with military precision. Will report you if you break rules. Also genuinely cares.',
    weekRange: [12, 90],
    quotes: {
      happy: [
        'We hit our weekly goals! Great companionship!',
        'That lesson was textbook. Excellent work.',
        'I put in a good word for you with President.',
        'We should aim for 20 contacts this week.',
        'I see real potential in you, Elder.',
      ],
      neutral: [
        'We need to tighten up our schedule.',
        'Have you done your personal study today?',
        'I noticed we were 5 minutes late to zone meeting.',
        'Let\'s review the key indicators.',
        'The mission president expects a lot from us.',
      ],
      unhappy: [
        'This is unacceptable performance.',
        'I have to report this. It\'s my duty.',
        'Are you even trying to follow the white handbook?',
        'I\'m requesting a transfer. For both our sakes.',
        'You\'re making me look bad to President.',
      ],
    },
  },
  {
    id: 'jensen',
    name: 'Elder Jensen',
    archetype: 'The Secret Gamer',
    traits: ['funny', 'creative', 'distracted'],
    initialRapport: 7,
    statModifiers: { language: 0, spirit: 0.05, skills: -0.1, obedience: -0.15 },
    rapportDecayRate: 0.5, // easy going, rapport is stable
    walkSpeed: 1,
    likedActivities: ['sports', 'explore_city', 'companion_activity'],
    dislikedActivities: ['study_language', 'personal_study'],
    description: 'Smuggled a Game Boy in his luggage. Can quote Monty Python in Hungarian. Terrible at tracting but somehow every investigator loves him. The fun companion.',
    weekRange: [1, 104],
    quotes: {
      happy: [
        'Dude, I just beat the Elite Four. Don\'t tell anyone.',
        'What if we taught the lesson using sock puppets?',
        'I made that old lady laugh so hard she invited us back!',
        'This is like a video game. We\'re leveling up!',
        'I drew a comic of our companionship. Want to see?',
      ],
      neutral: [
        'Do you think Mario would make a good missionary?',
        'I\'m bored. Can we do something fun?',
        'What if we just... explored the city a bit?',
        'I had the weirdest dream about our investigator.',
        'Five more minutes of Tetris, then I\'ll study. Promise.',
      ],
      unhappy: [
        'You\'re no fun, you know that?',
        'Fine. I\'ll put the Game Boy away. Happy?',
        'Why does everything have to be so serious?',
        'I didn\'t come here to be miserable.',
        'Maybe I should just call my bishop.',
      ],
    },
  },
  {
    id: 'mortensen',
    name: 'Elder Mortensen',
    archetype: 'The True Believer',
    traits: ['devout', 'intense', 'unshakeable'],
    initialRapport: 5,
    statModifiers: { language: 0, spirit: 0.2, skills: 0.05, obedience: 0.15 },
    rapportDecayRate: 1,
    walkSpeed: 1,
    likedActivities: ['personal_study', 'teach_lesson', 'service_project'],
    dislikedActivities: ['explore_city', 'sports'],
    description: 'Seminary graduate, Eagle Scout, bishop\'s son. Has never questioned anything in his life. Prays before every meal, after every meal, and during every meal. Scarily sincere.',
    weekRange: [1, 104],
    quotes: {
      happy: [
        'I felt the Spirit so strongly today, Elder.',
        'Every minute of service is a blessing.',
        'I know with every fiber of my being this is true.',
        'Have you read your patriarchal blessing lately?',
        'The Lord is hastening His work through us!',
      ],
      neutral: [
        'Should we start the day with a hymn?',
        'I think we should fast more often.',
        'Every trial is a chance to grow closer to Heavenly Father.',
        'Have you been keeping your mission journal?',
        'I wonder if we\'re being humble enough.',
      ],
      unhappy: [
        'I\'m worried about your testimony, Elder.',
        'We need to pray about this. Seriously.',
        'I can\'t be companions with someone who doesn\'t try.',
        'The Spirit can\'t dwell where there\'s contention.',
        'I\'m going to counsel with the mission president.',
      ],
    },
  },
  {
    id: 'kimball',
    name: 'Elder Kimball',
    archetype: 'The Homesick Kid',
    traits: ['young', 'emotional', 'needs_support'],
    initialRapport: 6,
    statModifiers: { language: 0, spirit: -0.15, skills: 0, obedience: 0 },
    rapportDecayRate: 1.5, // needs constant attention
    walkSpeed: 0.9,
    likedActivities: ['companion_study', 'companion_activity', 'letters_home'],
    dislikedActivities: ['street_contact', 'tracting'],
    description: 'Left home at 18 from a small town in Idaho. Cries at least once a week. Desperately wants to be a good missionary but the homesickness is crushing. Needs a friend more than a trainer.',
    weekRange: [1, 60],
    quotes: {
      happy: [
        'Today was actually a really good day!',
        'Thanks for being patient with me.',
        'I didn\'t cry at all today!',
        'That investigator reminded me of my mom. In a good way.',
        'Maybe I can do this after all.',
      ],
      neutral: [
        'How long until we can call home?',
        'I keep dreaming about my dog.',
        'Do you think everyone at home forgot about me?',
        'The food here is... different.',
        'Is it normal to feel this way?',
      ],
      unhappy: [
        'I can\'t do this. I want to go home.',
        'Nobody even told me it would be this hard.',
        'I don\'t think I\'m cut out for this.',
        'Please don\'t leave me alone today.',
        'I called home again. I know I\'m not supposed to.',
      ],
    },
  },
]

// Get a specific companion by ID
export function getCompanionById(id) {
  const c = COMPANIONS.find(comp => comp.id === id)
  if (!c) return null
  return { ...c, rapport: c.initialRapport }
}

// Get the starting companion (always Thompson)
export const getStartingCompanion = () => {
  return getCompanionById('thompson')
}

// Get a random companion appropriate for the current week, excluding history
export function getTransferCompanion(week, companionHistory = []) {
  const eligible = COMPANIONS.filter(c =>
    !companionHistory.includes(c.id) &&
    week >= c.weekRange[0] &&
    week <= c.weekRange[1]
  )
  if (eligible.length === 0) {
    // Fallback: allow repeats but prefer new ones
    const fallback = COMPANIONS.filter(c =>
      week >= c.weekRange[0] && week <= c.weekRange[1]
    )
    if (fallback.length === 0) return getCompanionById('thompson')
    return getCompanionById(fallback[Math.floor(Math.random() * fallback.length)].id)
  }
  return getCompanionById(eligible[Math.floor(Math.random() * eligible.length)].id)
}
