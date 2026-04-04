export const INVESTIGATOR_STAGES = [
  'Contact',
  'First Lesson',
  'Second Lesson',
  'Third Lesson',
  'Fourth Lesson',
  'Baptismal Date',
  'Interview',
  'Baptized',
]

export const STARTING_INVESTIGATORS = [
  {
    id: 'szabo_peter',
    name: 'Szabó Péter',
    personality: 'The Seeker',
    stage: 1,
    warmth: 7,
    weeksSinceContact: 0,
    objections: ['Why America?', 'What about the Roma people?'],
    isActive: true,
    description: 'A retired teacher who found a Book of Mormon in a used bookshop on Múzeum körút. He has questions. So many questions. But he listens too.',
    progressionBonus: 0.1,
  },
  {
    id: 'kiss_agi',
    name: 'Kiss Ági',
    personality: 'English Student',
    stage: 0,
    warmth: 5,
    weeksSinceContact: 0,
    objections: ['I just want English practice', 'My family would kill me', 'I\'m not religious'],
    isActive: true,
    description: 'University student who showed up to English class on Andrássy út. Stays for the cookies. Laughs at your Hungarian. Might stay for something more.',
    progressionBonus: -0.1,
  },
]
