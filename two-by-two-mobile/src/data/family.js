/**
 * Family contacts — the missionary's family back home.
 * Calling family boosts spirit. Available on P-Day and regular days.
 */
export const FAMILY = [
  {
    id: 'mom',
    name: 'Mom',
    relation: 'Mother',
    description: 'Sends care packages that take 6 weeks to arrive. Half the cookies are always crumbs.',
    callQuotes: [
      '"We\'re so proud of you, honey. Dad says hi. The dog misses you."',
      '"I put another package in the mail. Don\'t share ALL the peanut butter this time."',
      '"Your little sister bore her testimony about you on Sunday. I cried."',
      '"Are you eating enough? You sound tired. Please eat."',
      '"The ward put your name on the temple prayer roll. We love you."',
    ],
    callEffects: { spirit: 2 },
  },
  {
    id: 'dad',
    name: 'Dad',
    relation: 'Father',
    description: 'Man of few words, but every letter ends with "Stay strong, Elder."',
    callQuotes: [
      '"How\'s the work, son? ...Good, good. Keep at it."',
      '"Your Hungarian sounds impressive. Even if I can\'t understand a word."',
      '"Remember: hard things are worth doing. That\'s all I got."',
      '"Bishop asked about you. Told him you\'re the best missionary in Hungary."',
      '"Mom wanted me to ask if you need money. We\'re fine either way."',
    ],
    callEffects: { spirit: 2 },
  },
  {
    id: 'sibling',
    name: 'Little Sis',
    relation: 'Younger Sister',
    description: 'Sends memes via email. Claims she\'s funnier than you. She might be right.',
    callQuotes: [
      '"YOUR ROOM IS MINE NOW. I painted it purple. Sorry not sorry."',
      '"Mom cries every time she reads your emails. It\'s sweet but also a lot."',
      '"I told my friends my brother lives in Budapest and they think you\'re a spy."',
      '"Hurry home. This family is boring without you."',
      '"I\'m reading the Book of Mormon because you told me to. It\'s... actually good?"',
    ],
    callEffects: { spirit: 1 },
  },
]

/**
 * Leadership contacts — mission leadership the missionary can call.
 */
export const LEADERSHIP = [
  {
    id: 'president_taylor',
    name: 'President Taylor',
    relation: 'Mission President',
    description: 'Former stake president from Idaho Falls. Loves the missionaries. His interviews feel like therapy.',
    callQuotes: [
      '"Elder, how\'s your companion relationship? That matters more than numbers."',
      '"I\'ve been praying for your area. Something good is coming."',
      '"Remember why you\'re here. Not the church\'s mission — YOUR mission."',
      '"You sound like a different person than the kid who arrived. In a good way."',
      '"If you need anything, call. That\'s what I\'m here for."',
    ],
    callEffects: { spirit: 1, obedience: 1 },
  },
  {
    id: 'zone_leader',
    name: 'Zone Leader',
    relation: 'Zone Leader',
    description: 'Changes every transfer. Always has "great ideas" for your area.',
    callQuotes: [
      '"Hey Elder! How are the numbers this week?"',
      '"We should do a zone activity soon. Bowling?"',
      '"Have you tried the new tracting approach? It\'s working in our area."',
      '"President wants weekly reports in by Friday. Just a reminder."',
      '"Keep pushing. You\'re doing better than you think."',
    ],
    callEffects: { obedience: 1 },
  },
]
