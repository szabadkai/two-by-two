/**
 * Investigator personality templates and Hungarian name pools.
 * Used by the investigator generator to create new investigators dynamically.
 */

export const HUNGARIAN_FIRST_NAMES_MALE = [
  'Péter', 'János', 'László', 'István', 'Gábor', 'Zoltán', 'Tamás',
  'András', 'Ferenc', 'Tibor', 'Attila', 'Balázs', 'Csaba', 'Dávid',
  'Márton', 'Bence', 'Ádám', 'Norbert', 'Kristóf', 'Máté',
]

export const HUNGARIAN_FIRST_NAMES_FEMALE = [
  'Ági', 'Katalin', 'Éva', 'Anna', 'Mária', 'Eszter', 'Zsuzsa',
  'Judit', 'Réka', 'Nóra', 'Dóra', 'Virág', 'Lilla', 'Boglárka',
  'Orsolya', 'Petra', 'Kinga', 'Adrienn', 'Fruzsina', 'Noémi',
]

export const HUNGARIAN_SURNAMES = [
  'Szabó', 'Kovács', 'Tóth', 'Nagy', 'Horváth', 'Varga', 'Kiss',
  'Molnár', 'Németh', 'Farkas', 'Balogh', 'Papp', 'Takács', 'Juhász',
  'Mészáros', 'Oláh', 'Simon', 'Rácz', 'Fekete', 'Lukács',
]

/**
 * Each template defines a personality type with:
 * - personality: display label
 * - description: flavor text (with {name} placeholder)
 * - progressionBonus: makes them easier/harder to advance
 * - warmthRange: starting warmth [min, max]
 * - objectionPool: possible objections they might raise
 * - source: how they're found ('street' | 'english' | 'member_referral')
 */
export const INVESTIGATOR_TEMPLATES = [
  {
    personality: 'The Seeker',
    descriptions: [
      'Found a Book of Mormon at a used bookshop. Has questions — so many questions. But genuinely listens.',
      'Approached you on the street after seeing your name tag. Says God told them in a dream to talk to missionaries.',
      'Read about Mormons online and is intensely curious. Takes notes during every lesson.',
    ],
    progressionBonus: 0.1,
    warmthRange: [5, 7],
    objectionPool: [
      'Why does God need a church?',
      'What about the Roma people?',
      'How is this different from Catholicism?',
      'Why can\'t you drink coffee?',
    ],
    sources: ['street', 'english'],
  },
  {
    personality: 'The Skeptic',
    descriptions: [
      'Philosophy student at ELTE. Agreed to listen but picks apart every argument. Brilliant and infuriating.',
      'Former Catholic who lost faith years ago. Wants to believe but can\'t turn off the critical thinking.',
      'Engineer who wants logical proof for everything. Treats each lesson like a peer review.',
    ],
    progressionBonus: -0.15,
    warmthRange: [3, 5],
    objectionPool: [
      'Where\'s the archaeological evidence?',
      'This sounds like American imperialism.',
      'I need more time to think about this.',
      'Your Hungarian is... creative. Let me read it myself.',
      'What about the contradictions?',
    ],
    sources: ['street', 'english'],
  },
  {
    personality: 'The Lonely',
    descriptions: [
      'Elderly widow who invites you in for tea and doesn\'t want you to leave. Mostly just wants company.',
      'Recent divorcee looking for community. More interested in church events than doctrine.',
      'New to Budapest from the countryside. Knows nobody. You\'re the first friendly faces.',
    ],
    progressionBonus: 0.05,
    warmthRange: [6, 8],
    objectionPool: [
      'Will there be people my age at church?',
      'I don\'t want to bother anyone.',
      'My family back home won\'t understand.',
      'Can I just come to activities without joining?',
    ],
    sources: ['street', 'member_referral'],
  },
  {
    personality: 'English Student',
    descriptions: [
      'University student who showed up for free English practice. Stays for the cookies.',
      'Young professional trying to improve English for work. Politely tolerates the spiritual parts.',
      'High schooler whose parents sent them for English lessons. Bored but surprisingly receptive.',
    ],
    progressionBonus: -0.1,
    warmthRange: [4, 6],
    objectionPool: [
      'I just want English practice.',
      'My family would kill me.',
      'I\'m not really religious.',
      'Can we just do English today?',
    ],
    sources: ['english'],
  },
  {
    personality: 'The Rebel',
    descriptions: [
      'Covered in tattoos and piercings. Hates organized religion but something about the missionaries intrigues them.',
      'Former punk who\'s searching for meaning after a rough year. Pushes back hard but keeps coming back.',
      'Art student who calls organized religion "the opiate of the masses" but can\'t stop asking about the Plan of Salvation.',
    ],
    progressionBonus: -0.05,
    warmthRange: [3, 5],
    objectionPool: [
      'Religion is just control.',
      'What about LGBTQ members?',
      'I don\'t do rules.',
      'Your church sounds very... American.',
      'Convince me this isn\'t a cult.',
    ],
    sources: ['street'],
  },
  {
    personality: 'The Referral',
    descriptions: [
      'A member\'s neighbor who agreed to listen as a favor. Surprisingly engaged.',
      'Coworker of a church member who\'s been curious for months. Finally said yes to a visit.',
      'Family friend of the branch president. Already knows some basics about the church.',
    ],
    progressionBonus: 0.15,
    warmthRange: [5, 7],
    objectionPool: [
      'My friend told me about tithing...',
      'I need to talk to my spouse about this.',
      'Will I lose my other friends?',
      'How much time does church really take?',
    ],
    sources: ['member_referral'],
  },
  {
    personality: 'The Intellectual',
    descriptions: [
      'History professor fascinated by the theological claims. Treats it as an academic exercise — for now.',
      'Librarian who has read about every major religion. Keeps comparing Mormon doctrine to others.',
      'Retired diplomat who\'s lived everywhere. Wants to understand the American religious experience.',
    ],
    progressionBonus: 0.0,
    warmthRange: [4, 6],
    objectionPool: [
      'How do you reconcile this with historical evidence?',
      'I\'ve read about your temple ceremonies.',
      'What about the multiple accounts of the First Vision?',
      'Interesting. But can you prove any of this?',
    ],
    sources: ['street', 'english'],
  },
  {
    personality: 'The Golden',
    descriptions: [
      'Felt something the moment they opened the door. Cried during the first prayer. This almost never happens.',
      'Had a life crisis and is searching desperately for answers. Ready to believe.',
      'Already believes in God deeply and says they\'ve been waiting for this message their whole life.',
    ],
    progressionBonus: 0.25,
    warmthRange: [7, 9],
    objectionPool: [
      'My family won\'t accept this.',
      'Is baptism really necessary?',
      'I\'m afraid of change.',
    ],
    sources: ['street', 'member_referral'],
  },
]

/**
 * Objection scenarios triggered at specific teaching stages.
 * Each has a concern, 3-4 response options, and outcomes.
 */
export const STAGE_OBJECTIONS = {
  2: { // After Second Lesson
    trigger: 'The Word of Wisdom',
    scenarios: [
      {
        text: '{name} puts down their coffee cup slowly. "Wait... no coffee? No wine? I\'m Hungarian — that\'s basically asking me to stop breathing."',
        options: [
          { text: 'It\'s about taking care of your body, which is a gift from God.', quality: 'good' },
          { text: 'Many members find they feel healthier and more clear-headed.', quality: 'good' },
          { text: 'It\'s a commandment. You just have to trust God on this one.', quality: 'neutral' },
          { text: 'You can still drink herbal tea! And hot chocolate!', quality: 'weak' },
        ],
      },
    ],
  },
  4: { // After Fourth Lesson
    trigger: 'Tithing',
    scenarios: [
      {
        text: '{name} stares at the pamphlet. "Ten percent? Of my income? I barely make enough as it is. How can God ask that?"',
        options: [
          { text: 'It\'s an act of faith — and blessings always follow sacrifice.', quality: 'good' },
          { text: 'Start with what you can. God sees your heart, not the amount.', quality: 'good' },
          { text: 'The church uses it to build temples and help people worldwide.', quality: 'neutral' },
          { text: 'Most members say they\'re better off financially after paying tithing.', quality: 'weak' },
        ],
      },
    ],
  },
  6: { // Before Baptismal Interview
    trigger: 'The Commitment',
    scenarios: [
      {
        text: '{name} goes quiet for a long moment. "If I do this... everything changes. My family, my friends, my weekends. Am I really ready?"',
        options: [
          { text: 'You\'ll never feel 100% ready. But the Spirit you\'ve felt — that\'s real. Trust it.', quality: 'good' },
          { text: 'You don\'t have to lose anyone. You\'re adding something beautiful to your life.', quality: 'good' },
          { text: 'Pray about it one more time. If you feel peace, that\'s your answer.', quality: 'neutral' },
          { text: 'Some people say baptism is the best decision they ever made.', quality: 'weak' },
        ],
      },
    ],
  },
}
