export const COMPANIONS = [
  {
    id: 'thompson',
    name: 'Elder Thompson',
    archetype: 'The Greenie',
    traits: ['nervous', 'eager', 'asks_too_many_questions'],
    initialRapport: 5,
    description: 'Fresh from Provo, UT. Has memorized every discussion in English but panics when a Hungarian person actually talks to him. Brought three jars of peanut butter in his luggage.',
    quotes: {
      happy: [
        'Can you believe we get to be here?!',
        'I actually understood that whole sentence!',
        'This is the best mission in the whole church!',
        'I think that lady on the tram smiled at us!',
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
]

export const getStartingCompanion = () => {
  const c = COMPANIONS[0]
  return {
    ...c,
    rapport: c.initialRapport,
  }
}
