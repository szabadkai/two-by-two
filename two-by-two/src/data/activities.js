export const ACTIVITIES = {
  study_language: {
    id: 'study_language',
    label: 'Study Hungarian',
    description: 'Flashcards, grammar drills, repeat "köszönöm" 47 times. Your brain hurts but the words are sticking.',
    effects: { language: [1, 2], spirit: [-1, 0], skills: [0, 0] },
  },
  street_contact: {
    id: 'street_contact',
    label: 'Street Contacting',
    description: 'Stand on Deák tér and talk to strangers. Most walk past. Some stop. One argues about the Habsburgs.',
    effects: { language: [0, 1], spirit: [-2, 1], skills: [0, 1] },
  },
  teach_lesson: {
    id: 'teach_lesson',
    label: 'Teach Investigator',
    description: 'Visit your most promising investigator and teach the next discussion. Bring your best Hungarian.',
    effects: { skills: [1, 1], language: [0, 1], spirit: [0, 1] },
    special: 'advanceInvestigator',
  },
  companion_study: {
    id: 'companion_study',
    label: 'Companion Study',
    description: 'Study together, quiz each other, practice role-plays. Elder Thompson tries very hard.',
    effects: { skills: [0, 1], spirit: [0, 1] },
    rapportEffect: [1, 2],
  },
  personal_study: {
    id: 'personal_study',
    label: 'Personal Study',
    description: 'Scripture study, journal writing, pondering life 6,000 miles from home.',
    effects: { spirit: [1, 2], obedience: [0, 1] },
  },
  member_visit: {
    id: 'member_visit',
    label: 'Visit Members',
    description: 'Sister Kovács insists you eat. Brother Tóth wants to practice his English. The kids show you their hamster.',
    effects: { spirit: [0, 1], language: [0, 1], budget: [-500, -200] },
  },
  service_project: {
    id: 'service_project',
    label: 'Service Project',
    description: 'Help move furniture, clean the church building, or weed someone\'s garden on Dózsa György út.',
    effects: { spirit: [1, 2], skills: [0, 0], obedience: [0, 1], language: [0, 0] },
  },
  english_class: {
    id: 'english_class',
    label: 'Teach English Class',
    description: 'Free English lessons at the church. Half the class is here for English. Half might be here for more.',
    effects: { skills: [0, 1], language: [0, 0], spirit: [0, 1] },
    special: 'englishClassContact',
  },
}

export const PDAY_ACTIVITIES = {
  letters_home: {
    id: 'letters_home',
    label: 'Write Letters Home',
    description: 'Dear Mom and Dad, Budapest is amazing/freezing/confusing. I love/miss/need you. Send Reese\'s.',
    effects: { spirit: [1, 3] },
  },
  laundry: {
    id: 'laundry',
    label: 'Do Laundry',
    description: 'The washing machine in the basement makes sounds no machine should make. But it works. Mostly.',
    effects: { obedience: [0, 1], spirit: [-1, 0] },
    special: 'resetLaundry',
  },
  explore_city: {
    id: 'explore_city',
    label: 'Explore Budapest',
    description: 'Walk along the Danube, ride tram 4/6 end to end, find a new street you\'ve never seen. This city is incredible.',
    effects: { spirit: [1, 2], language: [0, 1], obedience: [-1, 0] },
  },
  sports: {
    id: 'sports',
    label: 'Sports with Members',
    description: 'Basketball at the church gym. The Hungarian members play surprisingly aggressive foci instead.',
    effects: { spirit: [1, 2] },
    rapportEffect: [0, 1],
    special: 'injuryRisk',
  },
  shopping: {
    id: 'shopping',
    label: 'Shopping',
    description: 'Stock up at the Tesco on Váci út. Splurge on a túró rudi. Consider the black market peanut butter.',
    effects: { budget: [-3000, -1000], spirit: [0, 1] },
  },
  pday_study: {
    id: 'pday_study',
    label: 'Extra Study',
    description: 'Everyone else is relaxing, but you crack open the grammar book. The subjunctive isn\'t going to learn itself.',
    effects: { language: [1, 2], skills: [0, 1], spirit: [-1, 0] },
  },
  companion_activity: {
    id: 'companion_activity',
    label: 'Companion Outing',
    description: 'Grab lángos at the market, walk up Gellért Hill, or just sit by the Danube and talk about home.',
    effects: { spirit: [0, 1] },
    rapportEffect: [1, 2],
  },
}

export const ACTIVITY_LIST = Object.values(ACTIVITIES)
export const PDAY_ACTIVITY_LIST = Object.values(PDAY_ACTIVITIES)
